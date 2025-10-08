import { SITE } from "@/data/site";
export default async function sitemap() {
  const base = SITE.domain;
  const routes = ["", "about", "services", "process", "gallery", "pricing", "faq", "blog", "contact"].map(p => ({
    url: `${base}/${p}`,
    lastModified: new Date(),
  }));
  return routes;
}
