import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { SITE } from "@/data/site";

// ✅ Läs tagline säkert även om den inte finns i typen
type SiteWithOptionalTagline = typeof SITE & { tagline?: string };
const TAGLINE = (SITE as SiteWithOptionalTagline).tagline ?? "Rent & fräscht, bokat på två minuter";

export default function HomePage() {
  return (
    <main className="relative">
      {/* ... */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-900">
              {TAGLINE}
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-gray-900 md:text-5xl">
              {SITE.name} – resultat som känns direkt
            </h1>
            <p className="mt-4 max-w-prose text-pretty text-gray-600 md:text-lg">
              Sluta gissa. Vi gör jobbet ordentligt och lämnar hemmet som nytt.
              Transparent prissättning, snabb bokning och proffs som bryr sig.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button href="/book">{SITE.ctaLabel ?? "Boka"}</Button>
              <Link
                href="/pricing"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2"
                aria-label="Se priser"
              >
                Se priser
              </Link>
            </div>
            {/* Trust row */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
              <span>★ ★ ★ ★ ★</span>
              <span>Över 1 000 nöjda kunder</span>
              <span className="hidden md:inline">•</span>
              <span>100% nöjd-kund-garanti</span>
            </div>
          </div>

          {/* Hero-bild/kollage */}
          <div className="relative">
            <div className="relative isolate rounded-2xl border border-black/5 bg-white/60 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/50 motion-safe:transition-transform motion-safe:duration-300 hover:rotate-[-0.5deg] hover:scale-[1.01]">
              <Image
                src="/images/hero-clean.jpg"
                alt="Före och efter – soffa rengjord till nyskick"
                width={1200}
                height={900}
                className="h-auto w-full rounded-xl object-cover"
                priority
              />
              <div className="pointer-events-none absolute -left-4 -top-4 -z-10 h-24 w-24 rounded-xl bg-gradient-to-br from-sky-200 to-indigo-200 blur-2xl opacity-60" />
              <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-24 w-24 rounded-xl bg-gradient-to-br from-amber-200 to-rose-200 blur-2xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        aria-labelledby="features-title"
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <h2 id="features-title" className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Varför välja oss?
        </h2>
        <p className="mt-2 max-w-prose text-gray-600">
          Vi kombinerar metod, maskiner och noggrannhet – utan krångel.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group relative rounded-2xl border border-black/5 bg-white/70 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 motion-safe:transition-transform motion-safe:duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
                {/* enkel inline-ikon */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d={f.iconPath} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
              <Link
                href={f.href}
                className="mt-3 inline-flex items-center rounded-lg px-2 py-1 text-sm font-medium text-gray-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2"
                aria-label={`Läs mer om ${f.title}`}
              >
                Läs mer →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Before/After mini-gallery */}
      <section
        aria-labelledby="gallery-title"
        className="container mx-auto px-4 pb-16 md:pb-24"
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 id="gallery-title" className="text-2xl font-semibold text-gray-900 md:text-3xl">
              Före & efter
            </h2>
            <p className="mt-2 max-w-prose text-gray-600">
              Se skillnaden några av våra kunder har fått hemma.
            </p>
          </div>
          <Link
            href="/gallery"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 md:inline-flex"
          >
            Visa galleri
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g) => (
            <figure key={g.alt} className="rounded-xl border border-black/5 bg-white/70 p-2 shadow-sm">
              <Image
                src={g.src}
                alt={g.alt}
                width={800}
                height={600}
                className="h-56 w-full rounded-lg object-cover"
              />
              <figcaption className="px-2 py-2 text-sm text-gray-600">{g.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link
            href="/gallery"
            className="inline-flex rounded-lg px-3 py-2 text-sm font-medium text-gray-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2"
          >
            Visa galleri →
          </Link>
        </div>
      </section>

      {/* CTA banner */}
      <section
        aria-label="Boka tid"
        className="container mx-auto px-4 pb-24"
      >
        <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-tr from-gray-50 to-white p-6 md:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
              Klart på några minuter
            </h2>
            <p className="mt-2 text-gray-600">
              Välj datum, bekräfta – och låt oss göra resten. Vi tar med allt som behövs.
            </p>
            <div className="mt-5">
              <Button href="/book">{SITE.ctaLabel ?? "Boka tid"}</Button>
            </div>
          </div>
          <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-sky-200 to-indigo-200 blur-2xl opacity-60" />
        </div>
      </section>
    </main>
  );
}

const FEATURES = [
  {
    title: "Proffsiga resultat",
    desc: "Industriella maskiner, rätt medel och metod – anpassat för ditt hem.",
    href: "/services",
    iconPath:
      "M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9zm-1 13-4-4 1.41-1.41L11 12.17l5.59-5.59L18 8z",
  },
  {
    title: "Transparent pris",
    desc: "Inga överraskningar. Se pris innan du bokar – punkt.",
    href: "/pricing",
    iconPath:
      "M12 1.5 3 6v12l9 4.5 9-4.5V6L12 1.5zm1 6h3v2h-3v2h3v2h-3V17h-2v-1.5H8V13h3v-2H8V9h3V7.5h2V9z",
  },
  {
    title: "Snabb bokning",
    desc: "Välj tid som passar. På plats i tid och klara snabbt.",
    href: "/book",
    iconPath:
      "M7 2h10v2h3v16H4V4h3V2zm2 6h6v2H9V8zm0 4h6v2H9v-2z",
  },
] as const;

const GALLERY = [
  {
    src: "/images/before-after-1.jpg",
    alt: "Matta före och efter djuprengöring",
    caption: "Matta – före/efter (30 min arbete)",
  },
  {
    src: "/images/before-after-2.jpg",
    alt: "Soffa före och efter djuprengöring",
    caption: "Soffa – före/efter (1 besök)",
  },
  {
    src: "/images/before-after-3.jpg",
    alt: "Bilsäte före och efter djuprengöring",
    caption: "Bil – före/efter (Premium)",
  },
] as const;
