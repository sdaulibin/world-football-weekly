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
    <header className="sticky top-0 z-40 border-b border-pitch-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pitch-600 text-sm font-bold text-white">
            天
          </span>
          <span className="text-base font-bold text-pitch-900">
            天下足球<span className="mx-1 font-normal text-slate-400">·</span>
            经典档案
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active = norm(pathname) === norm(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-pitch-100 font-medium text-pitch-800"
                    : "text-slate-600 hover:bg-pitch-50 hover:text-pitch-700"
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
