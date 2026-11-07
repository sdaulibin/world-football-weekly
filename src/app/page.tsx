import Link from "next/link";
import { allItems, segments, site } from "@/data";
import { EXPLORER_THRESHOLD } from "@/lib/utils";
import { SegmentCard } from "@/components/SegmentCard";
import { VerifyBadge } from "@/components/Badges";

/** 首页精选专题（板块 slug + 条目标题） */
const featured = [
  { segment: "specials", item: "贝影" },
  { segment: "absolute-stars", item: "亨利：海布里之王" },
  { segment: "top10", item: "世界足坛十大进球" },
  { segment: "farewells", item: "罗纳尔多退役特辑" },
] as const;

/** 转播图版式栏头：金色方块 + 标题 + 延伸发丝线 */
function SectionHead({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span aria-hidden className="h-2 w-2 shrink-0 bg-gold-400" />
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      <span aria-hidden className="hidden h-px min-w-8 flex-1 bg-line sm:block" />
      {hint && (
        <p className="w-full text-sm text-ink-faint sm:w-auto">{hint}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="text-sm font-medium text-pitch-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const items = allItems();
  const musicCount = items.filter((x) => x.item.music).length;
  const featuredEntries = featured
    .map(({ segment, item }) => {
      const seg = segments.find((s) => s.slug === segment);
      const it = seg?.items.find((i) => i.title === item);
      return seg && it ? { seg, it } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <>
      {/* ── Hero：夜场开球 ── */}
      <section className="floodlight relative overflow-hidden bg-night-950 text-ink">
        <div aria-hidden className="pitch-stripes absolute inset-0" />
        {/* 球场中圈线稿（chalk 白线 + 金色中点） */}
        <svg
          aria-hidden
          viewBox="0 0 560 560"
          className="absolute -right-28 bottom-0 hidden w-[480px] md:block"
        >
          <circle
            cx="280"
            cy="280"
            r="230"
            fill="none"
            stroke="rgba(233,244,238,0.13)"
            strokeWidth="2"
          />
          <circle
            cx="280"
            cy="280"
            r="106"
            fill="none"
            stroke="rgba(233,244,238,0.07)"
            strokeWidth="2"
          />
          <line
            x1="468"
            y1="280"
            x2="560"
            y2="280"
            stroke="rgba(233,244,238,0.13)"
            strokeWidth="2"
          />
          <circle cx="280" cy="280" r="5" fill="rgba(240,180,41,0.55)" />
        </svg>

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-28">
          {/* 记分牌式信息条 */}
          <p className="fade-up inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-night-900/80 px-3.5 py-1.5 font-mono text-xs tracking-widest text-gold-300">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            CCTV5 · {site.show.launchLabel}
          </p>
          <h1
            className="fade-up mt-5 text-5xl font-black tracking-tight text-ink sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            天下足球
            <span className="ml-3 align-baseline text-2xl font-bold text-pitch-300 sm:text-3xl">
              经典档案
            </span>
          </h1>
          <p
            className="fade-up mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted"
            style={{ animationDelay: "160ms" }}
          >
            {site.tagline}
          </p>
          <div
            className="fade-up mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/segments/"
              className="rounded-lg bg-pitch-500 px-5 py-2.5 font-semibold text-night-950 transition-colors hover:bg-pitch-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-300"
            >
              浏览板块档案
            </Link>
            <Link
              href="/timeline/"
              className="rounded-lg bg-night-800 px-5 py-2.5 font-medium text-ink ring-1 ring-line-strong transition-colors hover:bg-night-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
            >
              2000 → 至今大事记
            </Link>
          </div>

          {/* 记分牌数字列：发丝线分栏 + 等宽数字 */}
          <dl
            className="fade-up mt-14 grid max-w-2xl grid-cols-2 gap-y-6 sm:grid-cols-4"
            style={{ animationDelay: "320ms" }}
          >
            {[
              { label: "收录板块", value: segments.length },
              { label: "收录条目", value: items.length },
              { label: "记忆配乐", value: musicCount },
              { label: "覆盖年代", value: 26 },
            ].map((s) => (
              <div key={s.label} className="border-l border-line pl-4">
                <dt className="text-xs tracking-widest text-ink-faint">
                  {s.label}
                </dt>
                <dd className="mt-1 font-mono text-3xl font-bold tabular-nums text-ink">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 板块总览 ── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHead
          title="板块总览"
          hint="从《绝对巨星》到大赛特辑，25 年节目的骨架都在这里。"
          action={{ href: "/segments/", label: "全部板块 →" }}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {segments.slice(0, 6).map((s) => (
            <SegmentCard key={s.slug} segment={s} />
          ))}
        </div>
      </section>

      {/* ── 经典专题精选 ── */}
      <section className="border-y border-line bg-night-900/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHead
            title="经典专题精选"
            hint="球迷社区传诵度最高的几期，点开条目了解文案、配乐与视频线索。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {featuredEntries.map(({ seg, it }) => {
              // 大板块（如绝对巨星）用 ?q= 深链到浏览器组件，小板块用锚点
              const href =
                seg.items.length > EXPLORER_THRESHOLD
                  ? `/segments/${seg.slug}/?q=${encodeURIComponent(it.subject ?? it.title)}`
                  : `/segments/${seg.slug}/#${encodeURIComponent(it.title)}`;
              return (
                <Link
                  key={it.title}
                  href={href}
                  className="group rounded-xl border border-line bg-night-900 p-5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:bg-night-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-pitch-600 px-2 py-0.5 text-[11px] font-medium text-white">
                      {seg.name}
                    </span>
                    <VerifyBadge verified={it.verified} />
                    {it.aired && (
                      <span className="font-mono text-xs text-ink-faint">
                        {it.aired}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-ink transition-colors group-hover:text-pitch-300">
                    {it.subject ?? it.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                    {it.summary}
                  </p>
                  {it.quote && (
                    <p className="mt-3 text-sm italic leading-relaxed text-gold-200/80">
                      <span aria-hidden className="mr-0.5 text-gold-400/70">
                        「
                      </span>
                      {it.quote}
                      <span aria-hidden className="ml-0.5 text-gold-400/70">
                        」
                      </span>
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 数据说明 ── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-xl border border-line bg-night-900 p-8 sm:p-10">
          <h2 className="text-xl font-bold text-ink">
            这是一份「结构优先」的档案
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-muted">
            《天下足球》播出 25 年，各板块的名称、期数与首播时间在公开资料中常不一致。
            本站先建立可靠的板块框架，再逐条填充条目；凡是未经官方渠道确认的信息，
            一律打上
            <span className="mx-1 rounded bg-gold-400/15 px-1.5 py-0.5 text-xs font-medium text-gold-300 ring-1 ring-gold-400/30">
              待核实
            </span>
            徽章。欢迎补充线索、指正错误。
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              href="/about/"
              className="rounded-lg bg-night-800 px-4 py-2 font-medium text-ink ring-1 ring-line-strong transition-colors hover:bg-night-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
            >
              数据规范与免责声明
            </Link>
            <Link
              href="/stats/"
              className="rounded-lg bg-night-800 px-4 py-2 font-medium text-ink ring-1 ring-line-strong transition-colors hover:bg-night-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
            >
              档案统计
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
