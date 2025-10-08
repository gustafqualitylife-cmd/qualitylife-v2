import Image from "next/image";
import Section from "@/components/Section";

export const metadata = { title: "Om oss – Qualitylife" };

export default function AboutPage() {
  return (
    <Section title="Om Qualitylife" subtitle="Enkelt, tryggt och professionellt">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
          <Image src="/images/nedladdning.jpg" alt="Teamet" fill className="object-cover" />
        </div>
        <div className="prose max-w-none">
          <p>Vi startade Qualitylife för att göra det enkelt att hålla hemmet fräscht. Vi kommer hem till dig och tvättar på plats — med professionell utrustning och skonsamma medel.</p>
          <p>För oss är trygghet viktigt. Vi arbetar noggrant, förklarar vad vi gör och lämnar allt i toppskick.</p>
        </div>
      </div>
    </Section>
  );
}
