import Section from "@/components/Section";
import Button from "@/components/Button";
import { services } from "@/data/services";

export const metadata = { title: "Priser – Qualitylife" };

export default function PricingPage() {
  return (
    <>
      <Section title="Från-priser">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map(s => (
            <div key={s.slug} className="card">
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-700">{s.desc}</p>
              <p className="mt-3 text-2xl font-semibold text-brand-600">fr. {s.fromPrice} kr</p>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <div className="card flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Vill du se vad vi kan göra hemma hos dig?</h3>
            <p className="text-gray-700 mt-1">Boka en kostnadsfri demonstration.</p>
          </div>
          <Button href="/contact">Boka</Button>
        </div>
      </Section>
    </>
  );
}
