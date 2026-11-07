/**
 * 信息核实状态徽章：
 * verified = 已核实（绿）；否则显示「待核实」（金），全站统一口径。
 */
export function VerifyBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex shrink-0 items-center rounded-full bg-pitch-500/15 px-2 py-0.5 text-[11px] font-medium text-pitch-300 ring-1 ring-pitch-500/30">
      已核实
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center rounded-full bg-gold-400/15 px-2 py-0.5 text-[11px] font-medium text-gold-300 ring-1 ring-gold-400/30">
      待核实
    </span>
  );
}

/** 板块性质徽章 */
export function KindBadge({ kind }: { kind: "regular" | "special" | "event" }) {
  const map = {
    regular: {
      label: "常设板块",
      cls: "bg-pitch-500/15 text-pitch-300 ring-pitch-500/30",
    },
    special: {
      label: "特别制作",
      cls: "bg-gold-400/15 text-gold-300 ring-gold-400/30",
    },
    event: {
      label: "大赛特辑",
      cls: "bg-sky-400/15 text-sky-300 ring-sky-400/30",
    },
  } as const;
  const { label, cls } = map[kind];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${cls}`}
    >
      {label}
    </span>
  );
}
