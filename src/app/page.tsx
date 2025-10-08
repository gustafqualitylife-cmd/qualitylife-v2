import Image from "next/image";
import Button from "@/components/Button";
import Section from "@/components/Section";
import BeforeAfter from "@/components/BeforeAfter";
import TestimonialCard from "@/components/TestimonialCard";
import { beforeAfter } from "@/data/gallery";
import { testimonials } from "@/data/testimonials";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 to-white -z-10" />
        <div className="container grid md:grid-cols-2 gap-10 items-center py-14 md:py-20">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
              Matt- och möbeltvätt hemma hos dig
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Rena soffor, fräscha mattor och skönare madrasser – utan att du behöver lyfta ett finger.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button href="/book">Boka kostnadsfri demonstration</Button>
              <Button href="/services" variant="secondary">Våra tjänster</Button>
            </div>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <li>• Vi kommer hem till dig</li>
              <li>• Professionell utrustning</li>
              <li>• Miljövänliga medel</li>
              <li>• Snabb torktid</li>
            </ul>
          </div>
          <div>
            <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-soft">
              <Image src="/images/grön.efter.jpg" alt="Qualitylife i arbete" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      <Section title="Före & efter" subtitle="Se skillnaden direkt">
        <div className="grid md:grid-cols-2 gap-6">
          {beforeAfter.map((b, i) => <BeforeAfter key={i} {...b} />)}
        </div>
      </Section>

      <Section title="Omdömen" subtitle="Riktiga kunder, riktiga resultat">
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </div>
      </Section>

      <Section>
        <div className="card flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Redo för ett fräschare hem?</h3>
            <p className="text-gray-700 mt-1">Boka en kostnadsfri demonstration så visar vi vad vi kan.</p>
          </div>
          <Button href="/book">Boka kostnadsfri demonstration</Button>
        </div>
      </Section>
    </>
  );
}
