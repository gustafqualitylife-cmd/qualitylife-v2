import Section from "@/components/Section";
import { beforeAfter } from "@/data/gallery";
import BeforeAfter from "@/components/BeforeAfter";

export const metadata = { title: "Före & efter – Qualitylife" };

export default function GalleryPage() {
  return (
    <Section title="Före & efter">
      <div className="grid md:grid-cols-2 gap-6">
        {beforeAfter.map((b, i) => <BeforeAfter key={i} {...b} />)}
      </div>
    </Section>
  );
}
