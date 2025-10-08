"use client";
import { useEffect, useState, useMemo } from "react";

const RESOURCE_ID = "cmfln61ru0000nca48mor1acd";

function fmtWeekTitle(d: Date) {
  const monday = new Date(d);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const df = new Intl.DateTimeFormat("sv-SE", { month: "short", day: "numeric" });
  return `${df.format(monday).toUpperCase()} – ${df.format(sunday).toUpperCase()}`;
}

export default function BookPage() {
  const [weekAnchor, setWeekAnchor] = useState(() => new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState<Record<string, { iso: string; label: string }[]>>({});
  const weekTitle = useMemo(() => fmtWeekTitle(new Date(weekAnchor)), [weekAnchor]);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/open/week?resourceId=${RESOURCE_ID}&week=${weekAnchor}`);
      const data = await r.json();
      setDays(data.days || {});
    })();
  }, [weekAnchor]);

  function shiftWeek(delta: number) {
    const d = new Date(weekAnchor);
    d.setDate(d.getDate() + delta * 7);
    setWeekAnchor(d.toISOString().slice(0, 10));
  }

  const cols = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekAnchor);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
    const key = d.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat("sv-SE", { weekday: "short", day: "numeric" }).format(d);
    return { key, label, slots: days[key] || [] };
  });

  async function book(iso: string) {
    const name = prompt("Ditt namn:");
    const email = prompt("Din e-post:");
    const phone = prompt("Telefon:");
    const address = prompt("Adress:");
    if (!name || !email || !phone || !address) return;
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId: RESOURCE_ID, startIso: iso, name, email, phone, address }),
    });
    const data = await res.json();
    alert(res.ok ? "Bokat!" : (data.error || "Kunde inte boka"));
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="text-xl font-semibold mb-2">Välj tid</h1>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shiftWeek(-1)} className="rounded-full border px-3 py-1">Tidigare</button>
        <div className="text-sm uppercase tracking-wide">{weekTitle}</div>
        <button onClick={() => shiftWeek(1)} className="rounded-full border px-3 py-1">Senare</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-sm">
        {cols.map(({ key, label, slots }) => (
          <div key={key} className="border rounded-lg p-2 min-h-[420px]">
            <div className="font-medium mb-2">{label}</div>
            <div className="flex flex-col gap-2">
              {slots.length ? slots.map(s => (
                <button key={s.iso}
                        onClick={() => book(s.iso)}
                        className="rounded-xl border px-3 py-2 hover:shadow">
                  {s.label}
                </button>
              )) : <div className="text-gray-400">Inga tider</div>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
