"use client";
import { useEffect, useState, useMemo } from "react";

const RESOURCE_ID = "cmfmtab9i0000nc4owma6zi5i";
const TIMES = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

// ---- Hjälpare: lokal YYYY-MM-DD utan UTC-jitter ----
function pad2(n:number){ return String(n).padStart(2,"0"); }
function ymdLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}
// Viktigt: parsa "YYYY-MM-DD" till lokal date (inte UTC)
function parseYMD(ymd: string) {
  const [y,m,d] = ymd.split("-").map(Number);
  return new Date(y, (m??1)-1, d??1, 0, 0, 0, 0);
}
// Måndag som veckostart (lokal tid)
function startOfWeekLocal(d: Date) {
  const monday = new Date(d);
  const wd = monday.getDay();          // 0=Sun, 1=Mon, ... 6=Sat
  const delta = (wd + 6) % 7;          // hur många dagar att backa till måndag
  monday.setDate(monday.getDate() - delta);
  monday.setHours(0,0,0,0);
  return monday;
}

export default function AdminSchema() {
  // Initiera med dagens datum i LOKALT YMD-format
  const [weekAnchor, setWeekAnchor] = useState(() => ymdLocal(new Date()));
  const [days, setDays] = useState<Record<string, { iso: string; label: string }[]>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({}); // key: `${date}|${time}`

  const weekTitle = useMemo(() => {
    const a = parseYMD(weekAnchor);
    const m = startOfWeekLocal(a);
    const e = new Date(m); e.setDate(m.getDate() + 6);
    const df = new Intl.DateTimeFormat("sv-SE", { month: "short", day: "numeric" });
    return `${df.format(m).toUpperCase()} – ${df.format(e).toUpperCase()}`;
  }, [weekAnchor]);

  async function load() {
    const r = await fetch(
      `/api/contact/open/week?resourceId=${RESOURCE_ID}&week=${weekAnchor}`,
      { cache: "no-store" }
    );
    const data = await r.json();
    setDays(data.days || {});
  }
  useEffect(() => { load(); }, [weekAnchor]);

  function shiftWeek(delta:number){
    const d = parseYMD(weekAnchor);     // PARSA lokalt, inte new Date("YYYY-MM-DD")
    d.setDate(d.getDate() + delta*7);
    setWeekAnchor(ymdLocal(d));         // skriv alltid tillbaka i lokalt YMD-format
  }

  const cols = useMemo(() => {
    const a = parseYMD(weekAnchor);
    const m = startOfWeekLocal(a);
    return Array.from({length:7},(_,i)=>{
      const di = new Date(m);
      di.setDate(m.getDate()+i);
      const key = ymdLocal(di); // <-- lokal YMD som matchar serverns "days" keys
      const label = new Intl.DateTimeFormat("sv-SE",{ weekday:"short", day:"numeric"}).format(di);
      const openSet = new Set((days[key]||[]).map(s=>s.label)); // "10:00", ...
      return { key, label, openSet };
    });
  }, [weekAnchor, days]);

  function slotKey(date:string, time:string){ return `${date}|${time}`; }

  async function toggle(date:string, time:string, makeOpen:boolean) {
    const key = slotKey(date, time);

    // Optimistisk uppdatering: uppdatera UI direkt
    setDays(prev => {
      const next = { ...prev };
      const arr = next[date] ? [...next[date]] : [];
      const has = arr.some(s => s.label === time);
      if (makeOpen) {
        if (!has) arr.push({ iso: "", label: time });
      } else {
        if (has) {
          const filtered = arr.filter(s => s.label !== time);
          next[date] = filtered;
          return next;
        }
      }
      next[date] = arr;
      return next;
    });

    // Markera pending och disable knappen
    setPending(p => ({ ...p, [key]: true }));

    try {
      const res = await fetch("/api/contact/admin/open/toggle", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          resourceId: RESOURCE_ID,
          date,       // YYYY-MM-DD (lokal)
          time,       // "HH:mm"
          desired: makeOpen ? "open" : "closed"
        })
      });
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok || !json?.ok) throw new Error(json?.error || `HTTP ${res.status}`);

      // Liten delay för att undvika replikerings-race i moln
      await new Promise(r => setTimeout(r, 60));
      await load();
    } catch (err:any) {
      // Rollback: ladda om serverstatus om API faller
      console.error("Toggle failed", err);
      await load();
    } finally {
      setPending(p => {
        const n = { ...p }; delete n[key]; return n;
      });
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="text-xl font-semibold mb-2">Admin – öppna tider</h1>

      <div className="flex items-center justify-between mb-3">
        <button onClick={()=>shiftWeek(-1)} className="rounded-full border px-3 py-1">Tidigare</button>
        <div className="text-sm uppercase tracking-wide">{weekTitle}</div>
        <button onClick={()=>shiftWeek(1)} className="rounded-full border px-3 py-1">Senare</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-sm">
        {cols.map(({key,label,openSet})=>(
          <div key={key} className="border rounded-lg p-2">
            <div className="font-medium mb-2">{label}</div>
            <div className="flex flex-col gap-2">
              {TIMES.map(t=>{
                const isOpen = openSet.has(t);
                const isPending = pending[slotKey(key, t)] === true;
                return (
                  <button key={t}
                          onClick={()=>!isPending && toggle(key, t, !isOpen)}
                          disabled={isPending}
                          className={`rounded-xl px-3 py-2 border ${isOpen ? "bg-emerald-50 border-emerald-300" : "bg-gray-50 border-gray-300"} ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}>
                    {t} {isOpen ? "• öppen" : "• stängd"}{isPending ? " (sparar…)" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
