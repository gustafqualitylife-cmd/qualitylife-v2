import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const all = getAllPosts();
  const meta = all.find(p => p.slug === params.slug);
  if (!meta) return {};
  return { title: `${meta.title} – Qualitylife`, description: meta.excerpt };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const { meta, content } = getPost(params.slug);
  if (!meta) return notFound();
  return (
    <article className="container py-12 prose max-w-none">
      <h1 className="text-3xl sm:text-4xl font-semibold">{meta.title}</h1>
      <p className="text-sm text-gray-500">{new Date(meta.date).toLocaleDateString("sv-SE")}</p>
      <div className="mt-6 prose max-w-none">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
