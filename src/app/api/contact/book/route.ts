// qualitylife/src/app/api/contact/book/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

import { sendMail } from "@/lib/mailer";
import { internalNotification } from "@/emails/internalNotification";
import { bookingConfirmationEmail } from "@/emails/bookingConfirmation";

type Body = {
  resourceId: string;
  startIso: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

const INTERNAL_RECIPIENTS = [
  "gustaf@qualitylife.se",
  "gustaf.muda@gmail.com",
];

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Body;

  if (!body?.resourceId || !body?.startIso || !body?.name || !body?.email || !body?.phone || !body?.address) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  const start = new Date(body.startIso);
  const end = new Date(+start + 60 * 60 * 1000);

  try {
    const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const open = await tx.openSlot.findFirst({
        where: { resourceId: body.resourceId, start },
        select: { id: true },
      });
      if (!open) throw new Error("SlotClosed");

      const created = await tx.booking.create({
        data: {
          resourceId: body.resourceId,
          start,
          end,
          name: body.name,
          email: body.email,
          phone: body.phone,
          address: body.address,
        },
        select: { id: true, start: true, resourceId: true, name: true, email: true, phone: true, address: true },
      });

      await tx.openSlot.delete({ where: { id: open.id } });
      return created;
    });

    // --- EFTER lyckad transaktion: skicka mejl ---
    // 1) Intern notis (textmallen din kräver html i sendMail – wrappa i <pre>)
    const internalText = internalNotification({
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      startIso: body.startIso,
    });

    // 2) Kundbekräftelse (HTML)
    const datetimeLocal = new Date(body.startIso).toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Bygg en enkel cancelUrl – byt till din riktiga avbokningssida/token-logik
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.PUBLIC_URL ||
      "https://qualitylife.se";
    const cancelUrl = `${baseUrl}/avboka?bookingId=${booking.id}`;

    // Skicka parallellt men fånga fel utan att krascha svaret
    Promise.allSettled([
      sendMail({
        to: INTERNAL_RECIPIENTS,
        subject: "Ny bokning",
        html: `<pre style="font-family:ui-monospace, Menlo, Consolas, monospace; white-space:pre-wrap;">${internalText}</pre>`,
        text: internalText,
      }),
      sendMail({
        to: body.email,
        subject: "Bekräftelse: din bokning hos Qualitylife",
        html: bookingConfirmationEmail({
          name: body.name,
          datetimeLocal,
          phone: body.phone,
          address: body.address,
        }),
        text: `Tack för din bokning, ${body.name}! Tid: ${datetimeLocal}. Adress: ${body.address}.`,
      }),
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(i === 0 ? "INTERNAL MAIL FAILED" : "CONFIRMATION MAIL FAILED", r.reason);
        }
      });
    });

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (e: any) {
    if (e?.code === "P2002" || e?.message === "SlotClosed") {
      return NextResponse.json(
        { ok: false, error: "Tiden är inte längre tillgänglig" },
        { status: 409 }
      );
    }
    console.error("BOOKING ERROR", e);
    return NextResponse.json({ ok: false, error: "Kunde inte boka" }, { status: 500 });
  }
}
