"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { TimelineEvent } from "@/lib/types";
import { VerifyBadge } from "@/components/Badges";
import { yearOf } from "@/lib/utils";

const decades = [
  { key: "all", label: "全部" },
  { key: "2000", label: "2000 年代" },
  { key: "2010", label: "2010 年代" },
  { key: "2020", label: "2020 年代" },
] as const;

export function TimelineExplorer({ events }: { events: TimelineEvent[] }) {
  const [decade, setDecade] = useState<string>("all");

  const filtered = useMemo(
    () =>
      events.filter(
        (e) => decade === "all" || String(yearOf(e.date)).startsWith(decade),
      ),
    [events, decade],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {decades.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setDecade(d.key)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              decade === d.key
                ? "bg-pitch-600 font-medium text-white"
                : "bg-white text-slate-600 ring-1 ring-pitch-100 hover:bg-pitch-50 hover:text-pitch-700"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <ol className="relative mt-8 space-y-8 border-l-2 border-pitch-100 pl-6">
        {filtered.map((e, i) => (
          <li key={`${e.date}-${e.title}`} className="relative">
            <span
              aria-hidden
              className={`absolute top-1.5 -left-[31px] h-3 w-3 rounded-full border-2 ${
                e.verified
                  ? "border-pitch-600 bg-pitch-600"
                  : "border-gold-400 bg-gold-400/40"
              }`}
            />
            <div className="flex flex-wrap items-center gap-2">
              <time className="font-mono text-sm font-bold text-pitch-700">
                {e.date}
              </time>
              <VerifyBadge verified={e.verified} />
              {i === 0 && decade === "all" && (
                <span className="rounded-full bg-pitch-950 px-2 py-0.5 text-[11px] font-medium text-white">
                  起点
                </span>
              )}
            </div>
            <h3 className="mt-1 font-bold text-pitch-950">{e.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {e.detail}
            </p>
            {e.segmentSlug && (
              <Link
                href={`/segments/${e.segmentSlug}/`}
                className="mt-2 inline-block text-xs font-medium text-pitch-600 hover:underline"
              >
                相关板块 →
              </Link>
            )}
          </li>
        ))}
      </ol>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-slate-400">该年代暂无收录事件。</p>
      )}
    </div>
  );
}
