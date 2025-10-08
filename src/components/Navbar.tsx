"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import Button from "./Button";
import { SITE } from "@/data/site";

type NavItem = {
  label: string;
  href: Route;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Tjänster", href: "/services" as Route },
  { label: "Så funkar det", href: "/process" as Route },
  { label: "Före & efter", href: "/gallery" as Route },
  { label: "Priser", href: "/pricing" as Route },
  { label: "FAQ", href: "/faq" as Route },
  { label: "Blogg", href: "/blog" as Route },
  { label: "Kontakt", href: "/contact" as Route },
];

const HOME: Route = "/";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = useCallback(
    (href: Route) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const headerClass = useMemo(
    () =>
      [
        "sticky top-0 z-50 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        "border-b border-transparent transition-shadow motion-reduce:transition-none",
        scrolled ? "shadow-sm border-gray-100" : "",
      ].join(" "),
    [scrolled]
  );

  const mobileMenuId = "primary-mobile-menu";

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href={HOME}
            className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-lg"
          >
            <Image
              src="/images/logga.jpg"
              alt={SITE.name}
              width={32}
              height={32}
              className="rounded-sm"
              priority
            />
            <span className="font-semibold tracking-tight text-gray-900">
              {SITE.name}
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Huvudmeny"
            role="navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "text-sm font-medium transition-colors motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md px-1.5 py-1",
                    active
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button href="/book">{SITE.ctaLabel ?? "Boka"}</Button>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden relative inline-flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-controls={mobileMenuId}
            aria-expanded={open}
          >
            <span aria-hidden className="sr-only">Meny</span>
            <div className="relative h-5 w-6 motion-safe:transition-[transform] motion-safe:duration-200">
              <span
                className={[
                  "absolute left-0 top-0 block h-0.5 w-6 bg-gray-900 origin-center",
                  "motion-safe:transition-all motion-safe:duration-200",
                  open ? "translate-y-2.5 rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-2.5 block h-0.5 w-6 bg-gray-900",
                  "motion-safe:transition-opacity motion-safe:duration-200",
                  open ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 bottom-0 block h-0.5 w-6 bg-gray-900 origin-center",
                  "motion-safe:transition-all motion-safe:duration-200",
                  open ? "-translate-y-2.5 -rotate-45" : "",
                ].join(" ")}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        id={mobileMenuId}
        className={[
          "md:hidden overflow-hidden",
          "motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out",
          open ? "max-h-[640px]" : "max-h-0",
        ].join(" ")}
      >
        <div
          className={[
            "container mx-auto px-4 pb-4 pt-2 origin-top",
            "motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out",
            open ? "opacity-100 scale-100" : "opacity-0 scale-95",
          ].join(" ")}
        >
          <nav aria-label="Mobilmeny" role="navigation" className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-md px-2 py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    active
                      ? "text-gray-900 bg-gray-50"
                      : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Button href="/book" wide>
                {SITE.ctaLabel ?? "Boka"}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
