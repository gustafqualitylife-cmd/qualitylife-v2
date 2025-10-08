import Link from "next/link";
import { SITE } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100">
      <div className="container py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold">{SITE.name}</h3>
          <p className="mt-2 text-sm text-gray-600">Professionell matt- och möbeltvätt hemma hos dig.</p>
          <p className="mt-4 text-sm text-gray-700">Org.nr {SITE.orgnr}</p>
        </div>
        <div>
          <h4 className="font-medium">Kontakt</h4>
          <ul className="mt-2 text-sm">
            <li>Telefon: <a className="underline" href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>
            <li>E-post: <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li>Adress: {SITE.address}</li>
            <li>Öppet: {SITE.openingHours}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Snabblänkar</h4>
          <ul className="mt-2 text-sm space-y-1">
            <li><Link className="underline" href="/services">Tjänster</Link></li>
            <li><Link className="underline" href="/pricing">Priser</Link></li>
            <li><Link className="underline" href="/faq">FAQ</Link></li>
            <li><Link className="underline" href="/contact">Boka</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-6">
        <div className="container text-xs text-gray-500">
          © {new Date().getFullYear()} {SITE.name}. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}
