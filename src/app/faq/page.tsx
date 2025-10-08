import Section from "@/components/Section";
import FAQList from "@/components/FAQList";
import { faqs } from "@/data/faqs";

export const metadata = { title: "FAQ – Qualitylife" };

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <Section title="Vanliga frågor">
        <FAQList items={faqs} />
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
