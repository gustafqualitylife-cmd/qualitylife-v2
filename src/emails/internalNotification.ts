export function internalNotification(params: {
  name: string;
  email: string;
  phone: string;
  address: string;
  startIso: string;
}) {
  const { name, email, phone, address, startIso } = params;
  return `Ny bokning 🗓

• Namn: ${name}
• E-post: ${email}
• Telefon: ${phone}
• Adress: ${address}
• Start: ${startIso}
`;
}
