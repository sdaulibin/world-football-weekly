import type { Metadata } from "next";
import Link from "next/link";
import { allItems, segments, yearOf } from "@/data";

export const metadata: Metadata = {
  title: "档案统计",
  description: "收录进度、条目年代分布与板块规模统计。",
};

export default function StatsPage() {
  const items = allItems();
  const verified = items.filter((x) => x.item.verified).length;
  const verifiedPct = items.length
    ? Math.round((verified / items.length) * 100)
    : 0;

  // 条目年代分布（ aired 字段精度不一，缺失归入「未标注」）
  const byDecade = new Map<string, number>();
  for (const { item } of items) {
    const y = yearOf(item.aired);
    const key = y ? `${Math.floor(y / 10) * 10}s` : "未标注";
    byDecade.set(key, (byDecade.get(key) ?? 0) + 1);
  }
  const decadeRows = [...byDecade.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  // 各板块条目数
  const maxSegment = Math.max(...segments.map((s) => s.items.length), 1);

  // 记忆配乐清单
  const musicItems = items.filter((x) => x.item.music);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header>
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-2 w-2 bg-gold-400" />
          <h1 className="text-3xl font-bold text-ink">档案统计</h1>
          <span aria-hidden className="h-px min-w-8 flex-1 bg-line" />
        </div>
        <p className="mt-4 leading-relaxed text-ink-muted">
          收录进度一目了然。所有数字由数据文件实时计算，补充条目后自动更新。
        </p>
      </header>

      {/* 头部数字 */}
      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "板块", value: segments.length },
          { label: "条目", value: items.length },
          { label: "已核实", value: `${verifiedPct}%` },
          { label: "配乐线索", value: musicItems.length },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-line bg-night-900 p-4 text-center"
          >
            <dd className="font-mono text-3xl font-bold tabular-nums text-pitch-300">
              {s.value}
            </dd>
            <dt className="mt-1 text-xs text-ink-faint">{s.label}</dt>
          </div>
        ))}
      </dl>

      {/* 条目年代分布 */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-2 w-2 bg-gold-400" />
          <h2 className="text-xl font-bold text-ink">条目年代分布</h2>
          <span aria-hidden className="h-px min-w-8 flex-1 bg-line" />
        </div>
        <p className="mt-2 text-sm text-ink-faint">
          依据条目首播时间（精度不一），未标注日期的条目单独归类。
        </p>
        <div className="mt-5 space-y-3">
          {decadeRows.map(([decade, count]) => (
            <div key={decade} className="flex items-center gap-3">
              <span className="w-16 font-mono text-sm text-ink-muted">
                {decade}
              </span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-night-800">
                <div
                  className="h-full rounded-full bg-pitch-500"
                  style={{
                    width: `${(count / items.length) * 100}%`,
                  }}
                />
              </div>
              <span className="w-8 text-right font-mono text-sm tabular-nums text-ink-muted">
                {count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 各板块规模 */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-2 w-2 bg-gold-400" />
          <h2 className="text-xl font-bold text-ink">各板块收录规模</h2>
          <span aria-hidden className="h-px min-w-8 flex-1 bg-line" />
        </div>
        <div className="mt-5 space-y-3">
          {segments.map((s) => (
            <div key={s.slug} className="flex items-center gap-3">
              <Link
                href={`/segments/${s.slug}/`}
                className="w-40 shrink-0 truncate text-sm font-medium text-pitch-300 hover:underline"
              >
                {s.name}
              </Link>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-night-800">
                <div
                  className="h-full rounded-full bg-pitch-500"
                  style={{ width: `${(s.items.length / maxSegment) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-sm tabular-nums text-ink-muted">
                {s.items.length}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 记忆配乐 */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-2 w-2 bg-gold-400" />
          <h2 className="text-xl font-bold text-ink">记忆配乐清单</h2>
          <span aria-hidden className="h-px min-w-8 flex-1 bg-line" />
        </div>
        <p className="mt-2 text-sm text-ink-faint">
          BGM 是天下足球的灵魂。下列配乐线索多为球迷社区整理，以「待核实」口径收录。
        </p>
        <ul className="mt-5 divide-y divide-line overflow-hidden rounded-xl border border-line bg-night-900">
          {musicItems.map(({ segment, item }) => (
            <li
              key={`${segment.slug}-${item.title}`}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 text-sm"
            >
              <span className="text-gold-300">♪</span>
              <span className="font-medium text-ink">{item.music}</span>
              <span className="text-ink-faint">
                ·《{item.title}》· {segment.name}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
