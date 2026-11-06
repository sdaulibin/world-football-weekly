import Link from "next/link";
import type { Segment } from "@/lib/types";
import { KindBadge } from "@/components/Badges";

const kindMeta = {
  regular: { accent: "border-l-pitch-500" },
  special: { accent: "border-l-gold-400" },
  event: { accent: "border-l-sky-400" },
} as const;

export function SegmentCard({ segment }: { segment: Segment }) {
  const verifiedCount = segment.items.filter((i) => i.verified).length;
  return (
    <Link
      href={`/segments/${segment.slug}/`}
      className={`group flex flex-col rounded-2xl border border-pitch-100 border-l-4 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${kindMeta[segment.kind].accent}`}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-pitch-900 group-hover:text-pitch-600">
          {segment.name}
        </h3>
        <KindBadge kind={segment.kind} />
      </div>
      <p className="mt-1 font-mono text-[11px] text-slate-400">{segment.era}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {segment.tagline}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          {segment.items.length} 条条目
          {verifiedCount > 0 ? ` · 已核实 ${verifiedCount}` : ""}
        </span>
        <span className="font-medium text-pitch-600 transition-transform group-hover:translate-x-0.5">
          查看板块 →
        </span>
      </div>
    </Link>
  );
}
