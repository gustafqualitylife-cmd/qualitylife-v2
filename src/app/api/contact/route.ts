export const runtime = "nodejs";

import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body ?? {};
    if (!name || !email || !message) {
      return Response.json({ ok: false, error: "Saknar namn, e-post eller meddelande." }, { status: 400 });
    }

    const hasSMTP = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO);

    if (!hasSMTP) {
      console.warn("Ingen SMTP konfigurerad. Skicka via mailto istället.");
      return Response.json({ ok: false, fallback: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });


    await transporter.sendMail({
  from: `"Qualitylife Web" <${process.env.SMTP_USER!}>`,
  to: email,
  subject: "Tack för din bokning hos Qualitylife!",
  text: `Hej ${name},

Tack för din bokning hos Qualitylife!

Vi har tagit emot din förfrågan och återkommer så snart som möjligt med en bekräftelse.

Har du frågor eller vill komplettera din bokning? Svara gärna på detta mejl eller ring oss direkt på ${process.env.CONTACT_TO}.

Vänliga hälsningar,
Qualitylife
www.qualitylife.se
`,
html: `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f4f5f7;border-radius:16px;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(90deg,#16A34A,#22C55E);padding:24px;text-align:center;color:#fff;">
      <div style="font-weight:700;font-size:18px;letter-spacing:.2px;">Qualitylife</div>
      <div style="opacity:.95;font-size:13px;margin-top:6px;">Tack för din förfrågan – vi hör av oss snart</div>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:24px 28px;">
      <h2 style="margin:0 0 8px 0;color:#111827;font-size:20px;line-height:1.35;">Tack, ${name}!</h2>
      <p style="margin:0 0 14px 0;color:#374151;font-size:15px;line-height:1.6;">
        Vi har tagit emot din bokningsförfrågan och återkommer så snart som möjligt
        med en bekräftelse (vanligtvis inom <strong>~2 timmar</strong> på vardagar).
      </p>

      <p style="margin:16px 0 0 0;color:#374151;font-size:15px;line-height:1.6;">
        Har du frågor eller vill komplettera din bokning?<br>
        Svara gärna på detta mejl eller ring oss direkt.
      </p>

      <!-- CTA-knappar -->
      <div style="margin-top:16px;">
        <a href="mailto:${process.env.CONTACT_TO}?subject=Ang.%20min%20bokningsf%C3%B6rfr%C3%A5gan"
           style="display:inline-block;background:#16A34A;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">
          Svara i e-post
        </a>
        ${process.env.SITE_PHONE ? `
        <a href="tel:${process.env.SITE_PHONE}"
           style="display:inline-block;margin-left:8px;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">
          Ring oss
        </a>` : ``}
      </div>

      <p style="margin:16px 0 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
        Öppettider: <strong>Mån–Fre 09–19</strong>. Behöver du ändra något? Svara på detta mejl så uppdaterar vi din förfrågan.
      </p>

      <p style="margin:14px 0 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
        Vänliga hälsningar,<br>
        <strong>Qualitylife</strong><br>
        <a href="https://www.qualitylife.se" style="color:#16A34A;text-decoration:none;">www.qualitylife.se</a>
      </p>
    </div>
  </div>
`,
});

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: "Tekniskt fel." }, { status: 500 });
  }
}
