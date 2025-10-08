import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
};

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".mdx"));
  return files.map(filename => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data } = matter(raw);
    return { title: data.title, excerpt: data.excerpt, date: data.date, slug } as PostMeta;
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string) {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { meta: { ...data, slug } as PostMeta, content };
}
