import "./globals.css";
import type { Metadata } from "next";
import { SITE } from "@/data/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export const metadata: Metadata = {
  title: `${SITE.name} – Matt- och möbeltvätt hemma hos dig`,
  description: "Professionell matt- och möbeltvätt i hemmet. Enkelt, tryggt och miljövänligt. Boka kostnadsfri demonstration.",
  metadataBase: new URL(SITE.domain),
  openGraph: {
    title: `${SITE.name} – Matt- och möbeltvätt i hemmet`,
    description: "Rena soffor, mattor och madrasser – vi kommer hem till dig.",
    url: SITE.domain,
    siteName: SITE.name,
    images: [{ url: "/images/logga.jpg", width: 1200, height: 630, alt: "Qualitylife" }],
    locale: "sv_SE",
    type: "website",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    image: `${SITE.domain}/images/logga.jpg`,
    url: SITE.domain,
    telephone: SITE.phone,
    address: { "@type": "PostalAddress", streetAddress: SITE.address, addressLocality: "Stockholm", addressCountry: "SE" },
    areaServed: ["Stockholm", "Uppsala", "Södertälje"],
    openingHours: SITE.openingHours,
    sameAs: [],
  };

  return (
    <html lang="sv">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <MobileStickyCTA />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
