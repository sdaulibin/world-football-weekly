/**
 * 信息核实状态徽章：
 * verified = 已核实（绿）；否则显示「待核实」（琥珀），全站统一口径。
 */
export function VerifyBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex shrink-0 items-center rounded-full bg-pitch-100 px-2 py-0.5 text-[11px] font-medium text-pitch-700">
      已核实
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-medium text-gold-700">
      待核实
    </span>
  );
}

/** 板块性质徽章 */
export function KindBadge({ kind }: { kind: "regular" | "special" | "event" }) {
  const map = {
    regular: { label: "常设板块", cls: "bg-pitch-100 text-pitch-700" },
    special: { label: "特别制作", cls: "bg-gold-100 text-gold-700" },
    event: { label: "大赛特辑", cls: "bg-sky-100 text-sky-700" },
  } as const;
  const { label, cls } = map[kind];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
