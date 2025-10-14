"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const RESOURCE_ID = "cmfmtab9i0000nc4owma6zi5i";

type DaySlot = { iso: string; label: string };
type DaysMap = Record<string, DaySlot[]>;
type WeekResponse = { days?: DaysMap };

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
  const m = new Date(d);
  const wd = m.getDay();
  const delta = (wd + 6) % 7;
  m.setDate(m.getDate() - delta);
  m.setHours(0, 0, 0, 0);
  return m;
}
function endOfWeekLocal(d: Date) {
  const s = startOfWeekLocal(d);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}
function formatDayLabel(di: Date) {
  return new Intl.DateTimeFormat("sv-SE", { weekday: "short", day: "numeric" }).format(di);
}
function formatRangeLabel(aYmd: string) {
  const a = parseYMD(aYmd);
  const s = startOfWeekLocal(a);
  const e = endOfWeekLocal(a);
  const fmt = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short" });
  const sameMonth = s.getMonth() === e.getMonth();
  const left = fmt.format(s);
  const right = sameMonth
    ? new Intl.DateTimeFormat("sv-SE", { day: "numeric" }).format(e)
    : fmt.format(e);
  const year = s.getFullYear() === e.getFullYear() ? s.getFullYear() : `${s.getFullYear()}–${e.getFullYear()}`;
  return `${left}–${right} ${typeof year === "number" ? year : year}`;
}
function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isPhone(v: string) {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7;
}
function isAddress(v: string) {
  return v.trim().length >= 5;
}

export default function BookPage() {
  const [weekAnchor, setWeekAnchor] = useState(() => ymdLocal(new Date()));
  const [days, setDays] = useState<DaysMap>({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedIso, setSelectedIso] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean; address?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const r = await fetch(
        `/api/contact/open/week?resourceId=${RESOURCE_ID}&week=${weekAnchor}`,
        { cache: "no-store" }
      );
      const data: WeekResponse = await r.json();
      if (!r.ok) throw new Error("Kunde inte hämta lediga tider.");
      setDays(data.days || {});
    } catch (e: any) {
      setLoadError(e?.message ?? "Ett fel uppstod när tider skulle hämtas.");
      setDays({});
    } finally {
      setLoading(false);
    }
  }, [weekAnchor]);

  useEffect(() => {
    load();
  }, [load]);

  function shiftWeek(delta: number) {
    const d = parseYMD(weekAnchor);
    d.setDate(d.getDate() + delta * 7);
    setWeekAnchor(ymdLocal(d));
    setSelectedIso(null);
    setDoneMsg(null);
    setErrorMsg(null);
  }

  const week = useMemo(() => {
    const a = parseYMD(weekAnchor);
    const m = startOfWeekLocal(a);
    return Array.from({ length: 7 }, (_, i) => {
      const di = new Date(m);
      di.setDate(m.getDate() + i);
      const key = ymdLocal(di);
      return { key, label: formatDayLabel(di), slots: (days[key] || []) as DaySlot[] };
    });
  }, [weekAnchor, days]);

  const hasAnySlots = useMemo(() => {
    return Object.values(days).some((arr) => (arr?.length || 0) > 0);
  }, [days]);

  const onKeyDownWeek = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      shiftWeek(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      shiftWeek(1);
    }
  };

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setDoneMsg(null);

    const nameOk = !!name.trim();
    const emailOk = isEmail(email);
    const phoneOk = isPhone(phone);
    const addressOk = isAddress(address);
    if (!selectedIso) {
      setErrorMsg("Välj en tid först.");
      return;
    }
    if (!nameOk || !emailOk || !phoneOk || !addressOk) {
      setTouched({ name: true, email: true, phone: true, address: true });
      setErrorMsg("Kontrollera att alla fält är korrekt ifyllda.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  resourceId: RESOURCE_ID,
  startIso: new Date(selectedIso).toISOString(), // 👈 konvertera till UTC innan du skickar
  name,
  email,
  phone,
  address,
}),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Kunde inte boka tiden.");
      setDoneMsg("Tack! Din bokningsförfrågan är mottagen. Vi återkommer med bekräftelse.");
      setDays((prev) => {
        const d = new Date(selectedIso);
        const key = ymdLocal(d);
        const updated = { ...prev };
        updated[key] = (updated[key] || []).filter((s) => s.iso !== selectedIso);
        return updated;
      });
      setSelectedIso(null);
      setTouched({});
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Ett fel uppstod.");
    } finally {
      setSubmitting(false);
    }
  }

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setTouched({});
    setDoneMsg(null);
    setErrorMsg(null);
  };

  const goToCurrentWeek = () => {
    setWeekAnchor(ymdLocal(new Date()));
    setSelectedIso(null);
  };

  const selectedLabel = selectedIso ? new Date(selectedIso).toLocaleString("sv-SE") : "Ingen vald";

  return (
    <main className="mx-auto max-w-5xl p-4">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Boka en tid</h1>
        <p className="text-sm text-gray-600 mt-1">
          Välj en ledig tid och fyll i dina uppgifter. Tider visas i din lokala tidszon.
        </p>
      </header>

      <section
        ref={navRef}
        tabIndex={0}
        onKeyDown={onKeyDownWeek}
        aria-label="Veckonavigering"
        className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200"
      >
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => shiftWeek(-1)}
              className="rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              aria-label="Föregående vecka"
            >
              Tidigare
            </button>
            <button
              onClick={() => shiftWeek(1)}
              className="rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              aria-label="Nästa vecka"
            >
              Senare
            </button>
          </div>
          <div className="text-sm font-medium text-gray-700" aria-live="polite">
            {formatRangeLabel(weekAnchor)}
          </div>
        </div>
      </section>

      {loadError && (
        <Alert kind="error" onRetry={load}>
          {loadError} <span className="sr-only">.</span>
        </Alert>
      )}

      <section className="mt-4">
        {loading ? (
          <WeekSkeleton />
        ) : (
          <>
            {!hasAnySlots && (
              <div className="mb-6 rounded-xl border border-gray-200 p-4 text-sm text-gray-700 bg-white">
                Det finns inga lediga tider den här veckan. Prova att byta vecka med knapparna ovan.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {week.map(({ key, label, slots }) => (
                <DayCard key={key} label={label} empty={slots.length === 0}>
                  {slots.length === 0 ? (
                    <span className="text-xs text-gray-500">Inga lediga tider</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {slots.map((s) => {
                        const active = selectedIso === s.iso;
                        return (
                          <SlotButton
                            key={s.iso}
                            label={s.label}
                            iso={s.iso}
                            active={active}
                            onSelect={() => setSelectedIso(s.iso)}
                          />
                        );
                      })}
                    </div>
                  )}
                </DayCard>
              ))}
            </div>

            {selectedIso && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl max-w-xl">
                <div className="text-sm font-medium text-emerald-900 mb-1">Du har valt:</div>
                <div className="text-lg font-semibold text-emerald-900">
                  {new Date(selectedIso).toLocaleString("sv-SE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <p className="text-xs text-emerald-700 mt-1">Fyll i dina uppgifter nedan för att slutföra bokningen.</p>
              </div>
            )}
          </>
        )}
      </section>

      <section aria-live="polite" className="max-w-xl">
        {errorMsg && <Alert kind="warning">{errorMsg}</Alert>}
        {doneMsg && selectedIso === null && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <h2 className="font-medium mb-1">Tack!</h2>
            <p className="text-sm">{doneMsg}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                Boka en till tid
              </button>
              <button
                onClick={goToCurrentWeek}
                className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                Gå till denna vecka
              </button>
            </div>
          </div>
        )}
      </section>

      <form
        onSubmit={submitBooking}
        className="border rounded-2xl p-4 md:p-6 space-y-4 max-w-xl bg-white shadow-sm"
        aria-busy={submitting ? "true" : "false"}
      >
        <h2 className="text-lg font-semibold">Dina uppgifter</h2>

        <div>
          <label htmlFor="selected" className="block text-sm font-medium">
            Vald tid
          </label>
          <input
            id="selected"
            className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-50"
            value={selectedLabel}
            readOnly
          />
          <p className="mt-1 text-xs text-gray-500">Tider visas i din lokala tidszon.</p>
        </div>

        <Field
          id="name"
          label="Namn"
          value={name}
          onChange={(v) => setName(v)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          autoComplete="name"
          required
          invalid={touched.name && !name.trim()}
          errorText="Ange ditt namn."
        />

        <Field
          id="email"
          type="email"
          label="E-post"
          value={email}
          onChange={(v) => setEmail(v)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          autoComplete="email"
          required
          invalid={touched.email && !isEmail(email)}
          errorText="Ange en giltig e-postadress."
        />

        <Field
          id="phone"
          label="Telefon"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(v) => setPhone(v)}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          required
          invalid={touched.phone && !isPhone(phone)}
          errorText="Ange ett giltigt telefonnummer."
        />

        <Field
          id="address"
          label="Adress"
          value={address}
          onChange={(v) => setAddress(v)}
          onBlur={() => setTouched((t) => ({ ...t, address: true }))}
          autoComplete="street-address"
          required
          invalid={touched.address && !isAddress(address)}
          errorText="Ange en fullständig adress."
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={!selectedIso || submitting}
            className="rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {submitting ? "Skickar…" : "Skicka bokningsförfrågan"}
          </button>
        </div>
      </form>
    </main>
  );
}

function DayCard({
  label,
  empty,
  children,
}: {
  label: string;
  empty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-3 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium capitalize">{label}</div>
        {empty && <span className="text-xs text-gray-400" aria-hidden>–</span>}
      </div>
      {children}
    </div>
  );
}

function SlotButton({
  label,
  iso,
  active,
  onSelect,
}: {
  label: string;
  iso: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`text-sm rounded-full px-3 py-1 border transition focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
        active
          ? "bg-emerald-600 text-white border-emerald-600"
          : "bg-white hover:bg-gray-50 border-gray-300"
      }`}
      title={new Date(iso).toLocaleString("sv-SE")}
    >
      {label}
    </button>
  );
}

function Alert({
  kind = "info",
  children,
  onRetry,
}: {
  kind?: "info" | "warning" | "error";
  children: React.ReactNode;
  onRetry?: () => void;
}) {
  const styles =
    kind === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : kind === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-gray-200 bg-gray-50 text-gray-900";
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`mb-4 rounded-xl border p-3 ${styles}`}
    >
      <div className="text-sm">{children}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          Försök igen
        </button>
      )}
    </div>
  );
}

function Field(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  required?: boolean;
  invalid?: boolean;
  errorText?: string;
}) {
  const {
    id,
    label,
    value,
    onChange,
    onBlur,
    type = "text",
    inputMode,
    autoComplete,
    required,
    invalid,
    errorText,
  } = props;
  const describedBy = invalid ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label} {required && <span className="text-red-600" aria-hidden>*</span>}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
          invalid ? "border-red-500" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={invalid ? "true" : "false"}
        aria-describedby={describedBy}
        required={required}
      />
      {invalid && errorText && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {errorText}
        </p>
      )}
    </div>
  );
}

function WeekSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-3 bg-white shadow-sm">
          <div className="h-4 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((__, j) => (
              <div key={j} className="h-7 w-16 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
