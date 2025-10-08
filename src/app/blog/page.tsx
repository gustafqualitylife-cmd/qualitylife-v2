import Link from "next/link";
import Section from "@/components/Section";
import { getAllPosts } from "@/lib/blog";

export const metadata = { title: "Blogg – Qualitylife" };

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <Section title="Blogg" subtitle="Tips och guider för ett fräschare hem">
      <div className="space-y-6">
        {posts.map(p => (
          <article key={p.slug} className="card">
            <h3 className="text-xl font-semibold">
              <Link className="underline" href={`/blog/${p.slug}`}>{p.title}</Link>
            </h3>
            <p className="mt-2 text-gray-700">{p.excerpt}</p>
            <p className="mt-1 text-sm text-gray-500">{new Date(p.date).toLocaleDateString("sv-SE")}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
