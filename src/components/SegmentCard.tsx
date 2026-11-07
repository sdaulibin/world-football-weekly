import Link from "next/link";
import type { Segment } from "@/lib/types";
import { KindBadge } from "@/components/Badges";

export function SegmentCard({ segment }: { segment: Segment }) {
  const verifiedCount = segment.items.filter((i) => i.verified).length;
  return (
    <Link
      href={`/segments/${segment.slug}/`}
      className="group flex flex-col rounded-xl border border-line bg-night-900 p-5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:bg-night-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-ink transition-colors group-hover:text-pitch-300">
          {segment.name}
        </h3>
        <KindBadge kind={segment.kind} />
      </div>
      <p className="mt-1 font-mono text-[11px] tracking-wider text-ink-faint">
        {segment.era}
      </p>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">
        {segment.tagline}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-faint">
        <span className="font-mono">
          {segment.items.length} 条条目
          {verifiedCount > 0 ? ` · 已核实 ${verifiedCount}` : ""}
        </span>
        <span className="font-medium text-pitch-300 transition-transform group-hover:translate-x-0.5">
          查看板块 →
        </span>
      </div>
    </Link>
  );
}
