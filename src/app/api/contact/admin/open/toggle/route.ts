import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Always handle dynamically (no static caching)
export const dynamic = "force-dynamic";

// Hjälpare
function parseYMD(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}
function parseHM(hm: string) {
  const [h, mi] = hm.split(":").map(Number);
  return { h: h ?? 0, mi: mi ?? 0 };
}

function startFromDateTime(date?: string, time?: string, startIso?: string) {
  if (startIso) {
    // Tolka startIso som UTC, men nollställ sekunder/ms
    const d = new Date(startIso);
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0, 0));
  }
  if (!date || !time) throw new Error("Missing date/time");

  const base = parseYMD(date);
  const { h, mi } = parseHM(time);
  // Skapa UTC-tid från lokal tid, nollställ sekunder/ms
  return new Date(Date.UTC(base.getFullYear(), base.getMonth(), base.getDate(), h, mi, 0, 0));
}

type Body =
  | { resourceId: string; startIso: string; desired?: "open" | "closed" }
  | { resourceId: string; date: string; time: string; desired?: "open" | "closed" };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const resourceId = (body as any).resourceId;
    const desired = (body as any).desired;

    if (!resourceId) {
      return NextResponse.json({ ok: false, error: "Missing resourceId" }, { status: 400 });
    }

    await prisma.resource.upsert({
      where: { id: resourceId },
      create: { id: resourceId, name: "Default" },
      update: {},
    });

    const start = startFromDateTime((body as any).date, (body as any).time, (body as any).startIso);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h

    // Logga för felsökning
    console.log("ADMIN TOGGLE", { resourceId, date: (body as any).date, time: (body as any).time, start: start.toISOString() });

    // Hitta slot med exakt tid (nollställ sekunder/ms för säker jämförelse)
    const slot = await prisma.openSlot.findFirst({
      where: {
        resourceId,
        start: {
          gte: new Date(start.getTime()),
          lt: new Date(start.getTime() + 60 * 1000), // matcha exakt minut
        },
      },
    });

    if (desired === "open") {
      if (!slot) await prisma.openSlot.create({ data: { resourceId, start, end } });
    } else if (desired === "closed") {
      if (slot) await prisma.openSlot.delete({ where: { id: slot.id } });
    } else {
      if (slot) await prisma.openSlot.delete({ where: { id: slot.id } });
      else await prisma.openSlot.create({ data: { resourceId, start, end } });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("ADMIN SCHEMA ERROR", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Server error" }, { status: 500 });
  }
}
