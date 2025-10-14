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

// ✅ Konverterar lokal tid till UTC innan sparning
function startFromDateTime(date?: string, time?: string, startIso?: string) {
  if (startIso) {
    const s = new Date(startIso);
    s.setSeconds(0, 0);
    return s;
  }

  if (!date || !time) throw new Error("Missing date/time");

  // Skapa lokal tid från datum + klockslag (admin klickar lokalt)
  const base = parseYMD(date);
  const { h, mi } = parseHM(time);
  base.setHours(h, mi, 0, 0);

  // 🔧 Justera till UTC innan vi sparar (för att DB alltid ska ha rätt)
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

    let toggled: "added" | "removed" | "kept" | "kept-closed" = "kept";

    // Styrd åtgärd om desired finns
    if (desired === "open") {
      if (!existing) {
        await prisma.openSlot.create({ data: { resourceId, start, end } });
        toggled = "added";
      }
    } else if (desired === "closed") {
      if (existing) {
        await prisma.openSlot.delete({ where: { id: existing.id } });
        toggled = "removed";
      } else {
        toggled = "kept-closed";
      }
    } else {
      // Fallback: toggle
      if (existing) {
        await prisma.openSlot.delete({ where: { id: existing.id } });
        toggled = "removed";
      } else {
        await prisma.openSlot.create({ data: { resourceId, start, end } });
        toggled = "added";
      }
    }

    // ✅ Skicka tillbaka både UTC och svensk tid till admin-UI
    const startLocal = new Date(start).toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return NextResponse.json({
      ok: true,
      toggled,
      startUtc: start.toISOString(),
      startLocal,
    });
  } catch (err: any) {
    console.error("ADMIN SCHEMA ERROR", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
