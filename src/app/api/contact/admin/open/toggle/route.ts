import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  if (startIso) return new Date(startIso);
  if (!date || !time) throw new Error("Missing date/time");

  const base = parseYMD(date);
  const { h, mi } = parseHM(time);
  base.setHours(h, mi, 0, 0);

  // 🔧 Sparas i UTC så det funkar på Vercel
  const utc = new Date(base.getTime() - base.getTimezoneOffset() * 60000);
  return utc;
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

    // 🔍 hitta exakt slot (UTC)
    const existing = await prisma.openSlot.findUnique({
      where: { resourceId_start: { resourceId, start } },
    });

    if (desired === "open") {
      if (!existing) await prisma.openSlot.create({ data: { resourceId, start, end } });
    } else if (desired === "closed") {
      if (existing) await prisma.openSlot.delete({ where: { id: existing.id } });
    } else {
      if (existing) await prisma.openSlot.delete({ where: { id: existing.id } });
      else await prisma.openSlot.create({ data: { resourceId, start, end } });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("ADMIN SCHEMA ERROR", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Server error" }, { status: 500 });
  }
}
