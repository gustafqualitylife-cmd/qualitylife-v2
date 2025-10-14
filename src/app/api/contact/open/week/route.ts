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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resourceId = searchParams.get("resourceId") ?? "";
  const weekAnchor = searchParams.get("week") ?? "";

  if (!resourceId || !weekAnchor) {
    return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
  }

  const anchor = parseYMD(weekAnchor);
  const weekStart = startOfWeekLocal(anchor);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const slots = await prisma.openSlot.findMany({
    where: { resourceId, start: { gte: weekStart, lt: weekEnd } },
    orderBy: { start: "asc" },
  });

  const days: Record<string, { iso: string; label: string }[]> = {};

  const tz = "Europe/Stockholm";
  const timeFmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const ymdFmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  for (const s of slots) {
    const d = new Date(s.start);
    const key = ymdFmt.format(d); // YYYY-MM-DD in Stockholm tz
    const label = timeFmt.format(d); // HH:mm in Stockholm tz
    if (!TIMES.includes(label)) continue;
    if (!days[key]) days[key] = [];
    days[key].push({ iso: s.start.toISOString(), label });
  }

  return NextResponse.json({ ok: true, days });
}
