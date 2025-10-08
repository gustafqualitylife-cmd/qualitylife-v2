import Link from "next/link";
import Section from "@/components/Section";
import type { UrlObject } from "url";

export const metadata = {
  title: "Så funkar det – QualityLife",
  description:
    "Professionell tvätt av mattor, möbler och madrasser – gratis demonstration hemma hos dig. Skonsam våtextraktion, miljövänliga medel och endast ca 3 % restfukt.",
};

// Länkar: bokning vs frågor
const BOOK_LINK: UrlObject = { pathname: "/book", query: { demo: "1" } };
const CONTACT_LINK: UrlObject = { pathname: "/contact" };

// Samma knappstil överallt
const BTN =
  "group inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white font-medium " +
  "transition-transform duration-300 hover:-translate-y-0.5 hover:bg-gray-800 active:translate-y-0 " +
  "focus:outline-none focus:ring-2 focus:ring-black/30";

export default function ProcessPage() {
  return (
    <main className="space-y-16">
      {/* HERO */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Professionell tvätt av mattor & möbler – direkt hemma hos dig
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Upplev skillnaden på ett enda besök. Vi visar på plats hur vi tar
              bort kvalster, hudavlagringar, allergener och ingrodd smuts –
              gratis demonstration, inget köptvång.
            </p>
            <div className="mt-6">
              <Link href={BOOK_LINK} className={BTN}>
                Boka kostnadsfri demonstration
                <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Tryggt för barn & husdjur · Miljövänliga medel · Endast ca 3 % restfukt
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Har du frågor?{" "}
              <Link
                href={CONTACT_LINK}
                className="underline underline-offset-4 decoration-gray-400 hover:decoration-gray-700 transition-colors"
              >
                Kontakta oss
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Därför känns hemmet fräschare */}
      <Section title="Därför känns hemmet fräschare efter vår tvätt">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              t: "Djupare rengöring än dammsugning",
              d: "Smuts och partiklar lyfts ur fibrerna med kontrollerad våtextraktion.",
            },
            { t: "Bättre inomhusmiljö", d: "Färre allergener och mindre damm i luften." },
            {
              t: "Förlänger livslängden",
              d: "Textilier återfår färg och lyster – du slipper byta i onödan.",
            },
            {
              t: "Neutral doft av rent",
              d: "Skonsamma, pH-anpassade medel – inga starka parfymer.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold">{item.t}</h3>
              <p className="mt-2 text-gray-700">{item.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Så funkar det */}
      <Section title="Så funkar det – enkelt från start till klart">
        <ol className="space-y-4">
          {[
            { t: "Boka tid", d: "Välj en tid som passar dig." },
            {
              t: "Vi kommer hem till dig",
              d: "All utrustning ingår; du behöver inte förbereda något.",
            },
            {
              t: "Gratis demonstration (30–40 min)",
              d: "Vi rengör ett provområde så att du ser resultatet direkt.",
            },
            { t: "Endast ca 3 % restfukt", d: "Vår metod lämnar textilen nästan helt torr." },
            {
              t: "Välj själv",
              d: "Nöjd? Boka hel tvätt för de ytor du vill. Inga överraskningar.",
            },
          ].map((s, i) => (
            <li
              key={i}
              className="rounded-2xl border border-gray-100 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-black text-white text-sm grid place-items-center">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold">{s.t}</p>
                  <p className="text-gray-700">{s.d}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={BOOK_LINK} className={BTN}>
            Boka kostnadsfri demonstration
            <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href={CONTACT_LINK}
            className="text-gray-700 underline underline-offset-4 decoration-gray-400 hover:decoration-gray-700 transition-colors"
          >
            Frågor? Kontakta oss
          </Link>
        </div>
      </Section>

      {/* Före & efter */}
      <Section title="Före & efter – riktig skillnad">
        <blockquote className="text-gray-800 italic">
          ”Vi trodde soffan var körd – efter tvätten såg den ut som ny.”
        </blockquote>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            {
              before: "Soffa, 5 år: Fettfläckar & djurhår",
              after: "Återställd färg och struktur",
            },
            {
              before: "Matta i hallen: Vägsalt & grus",
              after: "Ren, jämn och fräsch yta",
            },
          ].map((pair, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="aspect-[4/3] rounded-xl bg-gray-100"
                  aria-label="Före-bild (platshållare)"
                />
                <div
                  className="aspect-[4/3] rounded-xl bg-gray-100"
                  aria-label="Efter-bild (platshållare)"
                />
              </div>
              <div className="mt-3 text-sm text-gray-700">
                <p>
                  <strong>Före:</strong> {pair.before}
                </p>
                <p>
                  <strong>Efter:</strong> {pair.after}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Visa 2–4 bildpar med korta bildtexter.
        </p>
      </Section>

      {/* Vad ingår i demon */}
      <Section title="Vad ingår i demon?">
        <ul className="grid md:grid-cols-2 gap-4">
          {[
            "Inspektion av dina textilier och rekommendationer.",
            "Prov-tvätt av utvalt område (soffa/karmstol/matta).",
            "Realistisk bedömning av resultat & skötselråd.",
            "Tydligt prisförslag för hel tvätt – bara om du vill.",
            "Kostnad: 0 kr. Köptvång: Inget.",
          ].map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-gray-100 p-4 text-gray-700 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {/* Vanliga ytor */}
      <Section title="Vanliga ytor vi tvättar">
        <ul className="grid md:grid-cols-2 gap-4">
          {[
            "Soffor & fåtöljer (tyg & mikrofiber)",
            "Mattor (vardagsrum, hall, sovrum)",
            "Madrasser (för fräschare sovmiljö)",
            "Stolsitsar & textila sänggavlar",
          ].map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-gray-100 p-4 text-gray-700 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-gray-700">
          Osäker på din textil? Vi testar fibrer/färgäkthet vid behov i demon.{" "}
          <Link
            href={CONTACT_LINK}
            className="underline underline-offset-4 decoration-gray-400 hover:decoration-gray-700 transition-colors"
          >
            Ställ en fråga
          </Link>
          .
        </p>
      </Section>

      {/* Teknik & säkerhet */}
      <Section title="Teknik & säkerhet – skonsamt men effektivt">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { t: "Kontrollerad våtextraktion", d: "Lossa → lyft → extrahera smuts djupt ur fibrerna." },
            { t: "Endast ca 3 % restfukt", d: "Metoden lämnar textilen praktiskt taget torr." },
            {
              t: "Utan “torrschampo-typ”",
              d: "Vi använder inte torrschampo-liknande pulver. För känsliga material kan vi även utföra tvätt helt utan sådana produkter.",
            },
            { t: "Miljövänliga, pH-anpassade medel", d: "Säkert för barn och husdjur." },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold">{item.t}</h3>
              <p className="mt-2 text-gray-700">{item.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Priser & garanti */}
      <Section title="Priser & garanti">
        <ul className="space-y-3 text-gray-700">
          <li>Pris efter omfattning och yta. Du får tydlig offert efter demon.</li>
          <li>
            <strong>Nöjd-kund-garanti:</strong> Ser du inte en tydlig förbättring på provytan, bokar du inte.
          </li>
          <li>
            <strong>Transparens:</strong> Inga dolda avgifter. Resa och utrustning ingår i offert.
          </li>
          <li>
            <em>Tips:</em> Kombinera flera ytor (t.ex. soffa + matta) för paketpris.
          </li>
        </ul>
        <div className="mt-6">
          <Link href={BOOK_LINK} className={BTN}>
            Boka kostnadsfri demonstration
            <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Section>

      {/* Kundomdömen */}
      <Section title="Kundomdömen">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { n: "Amanda, Göteborg", q: "Soffan blev som ny och ingen stark lukt." },
            { n: "Daniel, Malmö", q: "Proffsigt bemötande och märkbar skillnad på allergier." },
          ].map((r, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-gray-100 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div aria-hidden className="text-yellow-500">⭐️⭐️⭐️⭐️⭐️</div>
              <blockquote className="mt-2 text-gray-800">“{r.q}”</blockquote>
              <figcaption className="mt-2 text-sm text-gray-600">– {r.n}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Vanliga frågor (FAQ)">
        <div className="space-y-5">
          {[
            { q: "Kostar demonstrationen något?", a: "Nej, den är helt gratis och utan köptvång." },
            {
              q: "Hur lång tid tar det?",
              a: "Demon tar 30–40 minuter. En hel tvätt beror på yta/antal, men tidsplanen får du på plats.",
            },
            {
              q: "Blir det blött?",
              a: "Nej – metoden lämnar endast ca 3 % restfukt, så textilen är i praktiken nästan torr.",
            },
            {
              q: "Använder ni torrschampo?",
              a: "Nej. Vi använder inte torrschampo-typ produkter. För särskilt känsliga textilier kan vi även tvätta helt utan sådana medel.",
            },
            {
              q: "Är produkterna säkra för barn och husdjur?",
              a: "Ja, vi använder skonsamma, miljövänliga medel utan starka parfymer.",
            },
            {
              q: "Kan alla fläckar försvinna?",
              a: "Vissa permanenta missfärgningar (t.ex. blekmedel/solblekning) kan inte återställas. Vi är ärliga och visar vad som är realistiskt i demon.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="font-semibold">{item.q}</p>
              <p className="mt-1 text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Fler frågor?{" "}
          <Link
            href={CONTACT_LINK}
            className="underline underline-offset-4 decoration-gray-400 hover:decoration-gray-700 transition-colors"
          >
            Kontakta oss
          </Link>
          .
        </p>
      </Section>

      {/* Varför boka demo */}
      <Section title="Varför boka en demonstration innan hel tvätt?">
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>
            <strong>Zero risk:</strong> Du ser resultatet på din egen textil.
          </li>
          <li>
            <strong>Rätt beslut:</strong> Du får fakta om skick och förväntat resultat.
          </li>
          <li>
            <strong>Smart investering:</strong> Förlänger livslängden – billigare än att ersätta.
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={BOOK_LINK} className={BTN}>
            Se skillnaden själv – boka gratis demo
            <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href={CONTACT_LINK}
            className="text-gray-700 underline underline-offset-4 decoration-gray-400 hover:decoration-gray-700 transition-colors"
          >
            Frågor? Kontakta oss
          </Link>
        </div>
      </Section>

      {/* Om QualityLife */}
      <Section title="Om QualityLife">
        <p className="text-gray-700">
          Vi hjälper hem att andas renare genom professionell tvätt av madrasser, möbler och mattor – på plats, på dina
          villkor. Vår filosofi: visa först, sälj sen. Det gör valet tryggt för dig och sätter kvalitet i första rummet.
        </p>
      </Section>

      {/* Täckning & tider */}
      <Section title="Täckning & tider">
        <p className="text-gray-700">
          Vi erbjuder hembesök i [ditt område/städer] med flexibla tider vardag/kväll/helg. Begränsat antal demotider
          per vecka – reservera din slot idag.
        </p>
        <div className="mt-6">
          <Link href={BOOK_LINK} className={BTN}>
            Boka kostnadsfri demonstration
            <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Section>
    </main>
  );
}
