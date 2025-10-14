import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Hjälpare
function parseYMD(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0); // lokal tid
}
function parseHM(hm: string) {
  const [h, mi] = hm.split(":").map(Number);
  return { h: h ?? 0, mi: mi ?? 0 };
}

// ✅ Fixad version: konverterar lokal tid till UTC innan sparning
function startFromDateTime(date?: string, time?: string, startIso?: string) {
  if (startIso) {
    const s = new Date(startIso);
    s.setSeconds(0, 0);
    return s;
  }

  if (!date || !time) throw new Error("Missing date/time");

  // Skapa lokal tid från datum + klockslag
  const base = parseYMD(date);
  const { h, mi } = parseHM(time);
  base.setHours(h, mi, 0, 0);

  // 🔧 Justera till UTC innan vi sparar
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
    const desired = (body as any).desired as "open" | "closed" | undefined;

    if (!resourceId) {
      return NextResponse.json({ ok: false, error: "Missing resourceId" }, { status: 400 });
    }

    // Säkerställ att Resource finns (hindrar FK-fel)
    await prisma.resource.upsert({
      where: { id: resourceId },
      create: { id: resourceId, name: "Default" },
      update: {},
    });

    // Beräkna start & end (30 min)
    const start = startFromDateTime(
      (body as any).date,
      (body as any).time,
      (body as any).startIso
    );
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    // Finns slotten redan?
    const existing = await prisma.openSlot.findUnique({
      where: { resourceId_start: { resourceId, start } }, // kräver @@unique([resourceId, start])
    });

    // Styrd åtgärd om desired finns
    if (desired === "open") {
      if (existing) {
        return NextResponse.json({ ok: true, toggled: "kept", start: start.toISOString() });
      }
      try {
        await prisma.openSlot.create({ data: { resourceId, start, end } });
        return NextResponse.json({ ok: true, toggled: "added", start: start.toISOString() });
      } catch (e) {
        // Unique clash → behandla som redan öppen
        return NextResponse.json({ ok: true, toggled: "kept", start: start.toISOString() });
      }
    } else if (desired === "closed") {
      if (existing) {
        await prisma.openSlot.delete({ where: { id: existing.id } });
        return NextResponse.json({ ok: true, toggled: "removed", start: start.toISOString() });
      }
      return NextResponse.json({ ok: true, toggled: "kept-closed", start: start.toISOString() });
    }

    // Fallback: toggle
    if (existing) {
      await prisma.openSlot.delete({ where: { id: existing.id } });
      return NextResponse.json({ ok: true, toggled: "removed", start: start.toISOString() });
    } else {
      await prisma.openSlot.create({ data: { resourceId, start, end } });
      return NextResponse.json({ ok: true, toggled: "added", start: start.toISOString() });
    }
  } catch (err: any) {
    console.error("ADMIN SCHEMA ERROR", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Server error" }, { status: 500 });
  }
}
