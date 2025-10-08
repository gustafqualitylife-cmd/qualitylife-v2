"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Section from "@/components/Section";
import { SITE } from "@/data/site";
import { ShieldCheck, Phone, Mail, MessageSquare, Timer, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"fallback"|"error">("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState({ name: "", email: "", phone: "", address: "", message: "", consent: "false", newsletter: "false", company: "" }); // <lade till address och newsletter
  const [chars, setChars] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX = 800;
  const MIN_MSG = 20;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  }, [values.message]);

  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email), [values.email]);
  const nameOk = useMemo(() => values.name.trim().length >= 2, [values.name]);
  const messageOk = useMemo(() => values.message.trim().length >= MIN_MSG, [values.message]);
  const consentOk = values.consent === "true";
  const phoneHint = values.phone && !/^[0-9+\s-]*$/.test(values.phone) ? "Använd siffror, mellanslag eller +" : "";

  const formValid = nameOk && emailOk && messageOk && consentOk;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, type } = e.target as any;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked ? "true" : "false" : e.target.value;
    setValues(v => ({ ...v, [name]: value }));
    if (name === "message") setChars((e.target as HTMLTextAreaElement).value.length);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) {
      setTouched({ name: true, email: true, message: true, consent: true });
      return;
    }
    if (values.company) return; // Honeypot
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("ok");
        setValues({ name: "", email: "", phone: "", address: "", message: "", consent: "false", newsletter: "false", company: "" });
        setChars(0);
      } else if (json.fallback) setStatus("fallback");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const mailtoHref = `mailto:${SITE.email}?subject=Bokningsförfrågan Qualitylife&body=Hej,%0D%0A%0D%0AJag vill boka en kostnadsfri demonstration.%0D%0ANamn:%0D%0ATelefon:%0D%0AMeddelande:%0D%0A`;
  const smsHref = `sms:${SITE.phone}`;
  const waHref = `https://wa.me/${SITE.phone.replace(/[^0-9]/g, "")}`;

  const baseInput = "mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition";
  const okRing = "focus:ring-brand-500";
  const errRing = "focus:ring-red-500 border-red-500";

  return (
    <Section
      title="Boka tid idag"
      subtitle="Fyll i formuläret eller kontakta oss direkt. Vi svarar vanligtvis inom 2 timmar under vardagar."
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulär */}
        <form
          onSubmit={handleSubmit}
          className="card space-y-5 relative overflow-hidden"
          aria-describedby="form-help"
          noValidate
        >
          {/* Dekorativ gradient-”glow” */}
          <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-40 [mask-image:radial-gradient(150px_80px_at_20%_0%,black,transparent)] bg-gradient-to-r from-brand-500/30 via-brand-400/20 to-brand-300/10" />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Trygg kontakt: GDPR-säkrat & svar inom arbetstid
          </div>

<div className="grid gap-4">
            {/* Namn */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Namn <span className="text-brand-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="Ditt fullständiga namn"
                className={[
                  baseInput,
                  nameOk || !touched.name ? "border" : errRing,
                  okRing,
                ].join(" ")}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.name && !nameOk}
                aria-describedby={touched.name && !nameOk ? "err-name" : undefined}
              />
              {touched.name && !nameOk && (
                <p id="err-name" className="mt-1 text-xs text-red-600">Ange minst två tecken.</p>
              )}
            </div>

            {/* E-post */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                E-post <span className="text-brand-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="namn@exempel.se"
                className={[
                  baseInput,
                  emailOk || !touched.email ? "border" : errRing,
                  okRing,
                ].join(" ")}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.email && !emailOk}
                aria-describedby={(touched.email && !emailOk) ? "err-email" : "email-help"}
              />
              <p id="email-help" className="mt-1 text-xs text-muted-foreground">
                Vi delar aldrig din e-post med tredje part.
              </p>
              {touched.email && !emailOk && (
                <p id="err-email" className="mt-1 text-xs text-red-600">Ogiltig e-postadress.</p>
              )}
            </div>

            {/* Telefon */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">Telefon</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="070 123 45 67"
                pattern="^[0-9+\s-]*$"
                title="Använd siffror, mellanslag eller +"
                className={[baseInput, "border", okRing].join(" ")}
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={phoneHint ? "phone-hint" : undefined}
              />
              {!!phoneHint && (
                <p id="phone-hint" className="mt-1 text-xs text-orange-600">{phoneHint}</p>
              )}
            </div>

            {/* Adressfält - NYTT */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium">
                Adress <span className="text-brand-600">*</span>
              </label>
              <input
                id="address"
                name="address"
                required
                placeholder="Din adress"
                className={baseInput}
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* Meddelande */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Meddelande <span className="text-brand-600">*</span>
              </label>
              <textarea
                ref={textareaRef}
                id="message"
                name="message"
                rows={5}
                required
                maxLength={MAX}
                placeholder="Berätta kort vad du vill ha hjälp med och föreslå gärna tider som passar."
                className={[
                  baseInput,
                  messageOk || !touched.message ? "border" : errRing,
                  okRing,
                  "resize-none",
                ].join(" ")}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.message && !messageOk}
                aria-describedby="msg-help"
              />
              <div id="msg-help" className="mt-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Minst {MIN_MSG} tecken för att vi ska kunna hjälpa dig snabbare.
                </span>
                <span className={chars > MAX - 40 ? "text-orange-600" : "text-muted-foreground"}>
                  {chars}/{MAX}
                </span>
              </div>
            </div>

            {/* Nyhetsbrev - NYTT */}
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="newsletter"
                className="mt-1 accent-brand-600"
                checked={values.newsletter === "true"}
                onChange={handleChange as any}
                onBlur={handleBlur as any}
              />
              <span>Jag vill få nyhetsbrev och erbjudanden.</span>
            </label>

            {/* GDPR/opt-in */}
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="consent"
                className="mt-1 accent-brand-600"
                checked={values.consent === "true"}
                onChange={handleChange as any}
                onBlur={handleBlur as any}
                aria-invalid={touched.consent && !consentOk}
              />
              <span>Jag godkänner att ni kontaktar mig enligt er integritetspolicy.</span>
            </label>

            {/* Honeypot mot spam (gömd) */}
            <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" onChange={handleChange} />
          </div>

          <button
            className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-70"
            type="submit"
            disabled={!formValid || status === "loading"}
            aria-live="polite"
          >
            {status === "loading" ? (
              <>
                <Spinner /> Skickar…
              </>
            ) : (
              <>Skicka förfrågan</>
            )}
          </button>

          <p id="form-help" className="text-xs text-muted-foreground">
            Tryggt och enkelt. Du får en bekräftelse direkt i din e-post.
          </p>

          {/* Statusmeddelanden */}
          <div aria-live="polite" className="min-h-[1.25rem]">
            {status === "ok" && (
              <p className="flex items-center gap-1 text-green-700">
                <CheckCircle2 className="h-4 w-4" /> Tack! Vi återkommer snarast.
              </p>
            )}
            {status === "fallback" && (
              <div className="text-sm">
                <p className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-orange-600" /> Kunde inte skicka via servern. Klicka för att mejla istället:
                </p>
                <a className="underline text-brand-600" href={mailtoHref}>Öppna e-post</a>
              </div>
            )}
            {status === "error" && (
              <p className="flex items-center gap-1 text-red-700">
                <AlertTriangle className="h-4 w-4" /> Något gick fel. Prova igen eller mejla oss.
              </p>
            )}
          </div>
        </form>

        {/* Snabbkontakt + info */}
        <div className="card space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-muted/40 p-3">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold">Kontakta oss direkt</h3>
              <p className="mt-1">
                <strong>Telefon:</strong>{" "}
                <a className="underline" href={`tel:${SITE.phone}`}>{SITE.phone}</a>
              </p>
              <p>
                <strong>E-post:</strong>{" "}
                <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
              <div className="flex flex-wrap gap-2 pt-3">
                <a className="btn-secondary inline-flex items-center gap-1" href={smsHref}><Phone className="h-4 w-4" />SMS</a>
                <a className="btn-secondary inline-flex items-center gap-1" href={waHref} target="_blank" rel="noopener noreferrer"><MessageSquare className="h-4 w-4" />WhatsApp</a>
                <a className="btn-secondary inline-flex items-center gap-1" href={mailtoHref}><Mail className="h-4 w-4" />E-post</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Timer className="h-4 w-4" /> Svarstid</p>
              <p className="font-medium">~2 h vardagar</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4" /> Öppettider</p>
              <p className="font-medium">Mån–Fre 09–19</p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/30 p-4">
            <p className="text-sm">
              Föredrar du att boka via telefon? Ring så hjälper vi dig direkt och hittar en tid.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-20" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" />
    </svg>
  );
}