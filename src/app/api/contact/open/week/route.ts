import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure no caching on Vercel and always compute dynamically
export const dynamic = "force-dynamic";

const TIMES = [
  "10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function ymdLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function parseYMD(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}
function startOfWeekLocal(d: Date) {
  const monday = new Date(d);
  const wd = monday.getDay();
  const delta = (wd + 6) % 7;
  monday.setDate(monday.getDate() - delta);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Compute the UTC instant for a Stockholm-local midnight (YYYY-MM-DD 00:00 in Europe/Stockholm)
function stockholmMidnightUtc(ymd: string) {
  const tz = "Europe/Stockholm";
  const [y, m, d] = ymd.split("-").map(Number);
  const guessUtc = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0));
  const tzDate = new Date(guessUtc.toLocaleString("en-US", { timeZone: tz }));
  const offsetMin = (tzDate.getTime() - guessUtc.getTime()) / 60000;
  const utc = new Date(guessUtc.getTime() - offsetMin * 60000);
  utc.setSeconds(0, 0);
  return utc;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resourceId = searchParams.get("resourceId") ?? "";
  const weekAnchor = searchParams.get("week") ?? "";

  if (!resourceId || !weekAnchor) {
    return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
  }

  // Interpret incoming weekAnchor as Stockholm-local date and build UTC boundaries for the DB query
  const anchorLocal = parseYMD(weekAnchor);
  const weekStartLocal = startOfWeekLocal(anchorLocal);
  const weekStartYmd = ymdLocal(weekStartLocal);
  const weekEndLocal = new Date(weekStartLocal);
  weekEndLocal.setDate(weekStartLocal.getDate() + 7);
  const weekEndYmd = ymdLocal(weekEndLocal);
  const weekStart = stockholmMidnightUtc(weekStartYmd);
  const weekEnd = stockholmMidnightUtc(weekEndYmd);

  const slots = await prisma.openSlot.findMany({
    where: { resourceId, start: { gte: weekStart, lt: weekEnd } },
    orderBy: { start: "asc" },
  });

  const days: Record<string, { iso: string; label: string }[]> = {};
  const tz = "Europe/Stockholm";
  for (const s of slots) {
    // Transform the UTC instant into a Date that reflects Stockholm-local wall time
    const stockholm = new Date(new Date(s.start).toLocaleString("en-US", { timeZone: tz }));
    const key = ymdLocal(stockholm);
    const label = stockholm.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    if (!TIMES.includes(label)) continue;
    if (!days[key]) days[key] = [];
    days[key].push({ iso: s.start.toISOString(), label });
  }

  return NextResponse.json({ ok: true, days });
}
