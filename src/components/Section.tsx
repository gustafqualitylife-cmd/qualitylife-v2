export default function Section({ id, title, subtitle, children }: { id?: string; title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-16 sm:py-20">
      <div className="container">
        {title && <h2 className="text-3xl sm:text-4xl font-semibold">{title}</h2>}
        {subtitle && <p className="mt-3 text-gray-600">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
