"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/segments/", label: "板块档案" },
  { href: "/timeline/", label: "大事记" },
  { href: "/stats/", label: "数据" },
  { href: "/about/", label: "关于" },
];

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const norm = (p: string) => p.replace(/\/+$/, "") || "/";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night-950 rounded-lg"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-pitch-600 text-sm font-bold text-white">
            天
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold-400"
            />
          </span>
          <span className="text-base font-bold text-ink">
            天下足球<span className="mx-1.5 text-gold-400">·</span>
            <span className="font-normal text-ink-muted">经典档案</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active = norm(pathname) === norm(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60 ${
                  active
                    ? "bg-night-800 font-medium text-ink ring-1 ring-line-strong"
                    : "text-ink-muted hover:bg-night-900 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
