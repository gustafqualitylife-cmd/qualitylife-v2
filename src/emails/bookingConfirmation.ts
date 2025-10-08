export function bookingConfirmationEmail(params: {
  name: string;
  datetimeLocal: string;
  phone: string;
  address: string;
}) {
  const { name, datetimeLocal, phone, address } = params;
  return `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: auto; background: #FFFFFF; border: 1px solid #E6E6E6; border-radius: 14px; padding: 32px; color: #000000;">
    <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #000000;">
      Tack för din bokning, ${name}!
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; color: #000000;">
      Vi har tagit emot din bokning och ser fram emot att ses.
    </p>

    <div style="background: #F9FAF8; border: 1px solid #B3B3B3; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px;">
      <p style="margin: 0 0 8px; font-size: 15px; color: #000000;">
        <strong>Tid:</strong> ${datetimeLocal}
      </p>
      <p style="margin: 0 0 8px; font-size: 15px; color: #000000;">
        <strong>Telefon:</strong> ${phone}
      </p>
      <p style="margin: 0; font-size: 15px; color: #000000;">
        <strong>Adress:</strong> ${address}
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid #E6E6E6; margin: 28px 0;">

    <h3 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #000000;">
      Kontakta oss
    </h3>


    <div style="background: #F9FAF8; border-radius: 10px; padding: 16px 20px; margin: 0 0 20px;">
      <p style="margin: 0 0 6px; font-size: 15px; color: #000000;">
        <strong>Adress:</strong> Bergtorpsvägen 43A, 183 64 Täby
      </p>
      <p style="margin: 0 0 6px; font-size: 15px; color: #000000;">
        <strong>Telefon:</strong> <a href="tel:087330015" style="color: #A6CE39; text-decoration: none;">08 733 00 15</a>
      </p>
      <p style="margin: 0 0 6px; font-size: 15px; color: #000000;">
        <strong>E-post:</strong> <a href="mailto:info@qualitylife.se" style="color: #A6CE39; text-decoration: none;">info@qualitylife.se</a>
      </p>
      <p style="margin: 0; font-size: 15px; color: #000000;">
        <strong>Öppettider:</strong> Mån–Fre 8:00–18:00<br>
        <span style="color: #666666;">Telefon: Alltid tillgängliga</span>
      </p>
    </div>

    <p style="margin: 0; font-size: 15px; color: #666666;">
      Vänliga hälsningar<br>
      <strong style="color: #000000;">Qualitylife</strong>
    </p>
  </div>`;
}
