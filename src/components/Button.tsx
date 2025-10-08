import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

export default function Button({
  href = "/contact",
  children = "Boka din gratis demonstration hemma",
  variant = "primary",
  wide = false,
}: { href?: Route | string; children?: React.ReactNode; variant?: "primary"|"secondary"; wide?: boolean }) {
  const cls = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <Link href={href as Route} className={`${cls} ${wide ? "w-full" : ""}`}>
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}
