"use client";

import { useEffect, useMemo, useState } from "react";
import type { SegmentItem } from "@/lib/types";
import { decadeOf } from "@/lib/utils";
import { sortVideos } from "@/lib/videoPriority";
import { VerifyBadge } from "@/components/Badges";
import { EpisodeThumb } from "@/components/EpisodeThumb";
import { playerPhotos } from "@/data/photos-as";

/** 年代筛选项由数据现场推导 */
const DECADE_LABELS: Record<string, string> = {
  "1990s": "1990 年代",
  "2000s": "2000 年代",
  "2010s": "2010 年代",
  "2020s": "2020 年代",
  unknown: "年份待考",
};

/** 文案弹层：夜场画框里的整段金句 */
function QuoteModal({
  item,
  onClose,
}: {
  item: SegmentItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const link = item.videos?.[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-pitch-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`《${item.title}》经典文案`}
    >
      <div
        className="floodlight relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-pitch-950 p-8 text-white shadow-2xl ring-1 ring-white/10 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          ✕
        </button>

        <p className="font-mono text-xs tracking-widest text-gold-400">
          ♪ 经典文案
        </p>

        <h3 className="mt-3 text-2xl font-bold leading-snug">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-pitch-300">
          {[item.subject, item.aired].filter(Boolean).join(" · ")}
        </p>

        <div aria-hidden className="mt-6 text-5xl leading-none text-gold-400/60">
          「
        </div>
        <p className="whitespace-pre-wrap px-1 text-[15px] leading-[30px] italic text-white/90">
          {item.quoteFull ?? item.quote}
        </p>
        <div aria-hidden className="mt-1 text-right text-5xl leading-none text-gold-400/60">
          」
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm">
          <span className="text-pitch-300">《天下足球》解说文案</span>
          {link && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-pitch-500 px-4 py-2 font-medium text-white transition-colors hover:bg-pitch-400"
            >
              ▶ 观看这期节目 ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 大板块条目浏览器：搜索 + 年代筛选。
 * 用于《绝对巨星》这类上百期条目的板块页。
 * 支持从首页精选卡片带 ?q=关键词 深链。
 */
export function EpisodeExplorer({ items }: { items: SegmentItem[] }) {
  const [query, setQuery] = useState(() =>
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("q") ?? "")
      : "",
  );
  const [decade, setDecade] = useState("all");
  const [quoteOnly, setQuoteOnly] = useState(false);
  const [modal, setModal] = useState<SegmentItem | null>(null);

  const decades = useMemo(() => {
    const set = new Set(items.map((i) => decadeOf(i.aired)));
    return [...set].sort((a, b) =>
      a === "unknown" ? 1 : b === "unknown" ? -1 : a.localeCompare(b),
    );
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (quoteOnly && !i.quote) return false;
      if (decade !== "all" && decadeOf(i.aired) !== decade) return false;
      if (!q) return true;
      return `${i.title} ${i.subject ?? ""} ${i.summary} ${i.quote ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, decade, quoteOnly]);

  const quoteCount = items.filter((i) => i.quote).length;

  const directLinks = filtered.reduce(
    (n, i) => n + (i.videos?.filter((v) => v.verified).length ?? 0),
    0,
  );

  return (
    <div>
      {/* 工具栏 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索球星或关键词，如：巴乔、亨利、门将…"
          className="w-full rounded-xl border border-pitch-200 bg-white px-4 py-2 text-sm text-pitch-950 outline-none placeholder:text-slate-400 focus:border-pitch-500 focus:ring-2 focus:ring-pitch-200 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setDecade("all")}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
              decade === "all"
                ? "bg-pitch-600 font-medium text-white"
                : "bg-white text-slate-600 ring-1 ring-pitch-100 hover:bg-pitch-50"
            }`}
          >
            全部年代
          </button>
          {decades.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDecade(d)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                decade === d
                  ? "bg-pitch-600 font-medium text-white"
                  : "bg-white text-slate-600 ring-1 ring-pitch-100 hover:bg-pitch-50"
              }`}
            >
              {DECADE_LABELS[d] ?? d}
            </button>
          ))}
          {quoteCount > 0 && (
            <button
              type="button"
              onClick={() => setQuoteOnly(!quoteOnly)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                quoteOnly
                  ? "bg-gold-400 font-medium text-pitch-950"
                  : "bg-white text-slate-600 ring-1 ring-pitch-100 hover:bg-gold-100"
              }`}
            >
              ♪ 经典文案 {quoteCount}
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        筛选出 <span className="font-mono font-bold text-pitch-700">{filtered.length}</span>{" "}
        / {items.length} 期
        {directLinks > 0 && ` · 含已验证直链 ${directLinks} 条`}
      </p>

      {/* 条目卡片网格：参考 hackertube 的视频卡片版式（缩略图在上，信息在下） */}
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, idx) => {
          const links = sortVideos(item.videos ?? []);
          const first = links[0];
          const backups = links.slice(1);
          return (
            <article
              key={`${decadeOf(item.aired)}-${item.title}-${idx}`}
              className="group min-w-0"
            >
              {first ? (
                <a
                  href={first.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  title={item.note}
                >
                  <EpisodeThumb
                    title={item.title}
                    subject={item.subject}
                    aired={item.aired}
                    duration={item.duration}
                    photo={item.subject ? playerPhotos[item.subject]?.src : undefined}
                  />
                </a>
              ) : (
                <EpisodeThumb
                  title={item.title}
                  subject={item.subject}
                  aired={item.aired}
                  duration={item.duration}
                  photo={item.subject ? playerPhotos[item.subject]?.src : undefined}
                />
              )}

              {/* 卡片信息区 */}
              <div className="pt-3">
                <h3 className="line-clamp-2 text-[15px] leading-[22px] font-medium text-pitch-950">
                  {first ? (
                    <a
                      href={first.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pitch-700"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>

                <div className="mt-1 flex items-center gap-1.5 text-[13px] leading-5 text-slate-500">
                  {item.subject && <span>{item.subject}</span>}
                  {item.aired && (
                    <>
                      {item.subject && <span aria-hidden>•</span>}
                      <span className="font-mono text-slate-400">
                        {item.aired}
                      </span>
                    </>
                  )}
                  <VerifyBadge verified={item.verified} />
                </div>

                {item.quote ? (
                  <button
                    type="button"
                    onClick={() => setModal(item)}
                    className="mt-2 block w-full cursor-pointer rounded-r-lg border-l-[3px] border-gold-400 bg-gold-100/45 px-3 py-2.5 text-left transition-colors hover:bg-gold-200/60"
                    aria-label={`展开《${item.title}》完整文案`}
                  >
                    <p className="line-clamp-2 text-[12.5px] leading-[20px] italic text-slate-600">
                      「{item.quote}」
                    </p>
                    <p className="mt-1.5 text-[10px] not-italic tracking-wide text-gold-700/80">
                      经典文案 · 点击展开全文 ↗
                    </p>
                  </button>
                ) : (
                  item.summary && (
                    <p className="mt-2 px-1 text-[12px] leading-[18px] text-slate-300">
                      {item.summary}
                    </p>
                  )
                )}

                {/* 观看入口 */}
                {first && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span className="text-pitch-600">▶</span>
                    <span className="rounded bg-pitch-600 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">
                      {first.platform}
                    </span>
                    <a
                      href={first.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-pitch-700 hover:underline"
                    >
                      观看节目 ↗
                    </a>
                    {first.verified ? (
                      <span className="rounded-full bg-pitch-100 px-1.5 py-0.5 text-[10px] font-medium text-pitch-700">
                        已验证直链
                      </span>
                    ) : (
                      <span className="rounded-full bg-gold-100 px-1.5 py-0.5 text-[10px] font-medium text-gold-700">
                        搜索入口
                      </span>
                    )}
                    {links.length > 1 && (
                      <span className="text-slate-400">
                        +{links.length - 1} 个入口
                      </span>
                    )}
                  </div>
                )}

                {/* 备用入口（B站/YouTube 之外的央视网等，默认折叠） */}
                {backups.length > 0 && (
                  <details className="mt-1.5 text-[11px]">
                    <summary className="cursor-pointer list-none text-slate-400 hover:text-slate-600">
                      更多入口（{backups.length}）▾
                    </summary>
                    <ul className="mt-1 space-y-1">
                      {backups.map((v) => (
                        <li key={v.url}>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-pitch-700 hover:underline"
                          >
                            {v.platform} · {v.label} ↗
                          </a>
                          {v.verified && (
                            <span className="ml-1 text-pitch-600">✓</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 rounded-2xl bg-pitch-50 px-5 py-6 text-center text-sm text-slate-400">
          没有匹配的期数——换个关键词，或清空筛选条件试试。
        </p>
      )}

      {modal && <QuoteModal item={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
