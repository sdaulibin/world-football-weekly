import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findSegment, segmentNeighbors, segments } from "@/data";
import { KindBadge, VerifyBadge } from "@/components/Badges";
import { WatchLinks } from "@/components/WatchLinks";
import { EpisodeExplorer } from "@/components/EpisodeExplorer";
import { EXPLORER_THRESHOLD } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return segments.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const segment = findSegment(slug);
  if (!segment) return {};
  return {
    title: segment.name,
    description: segment.tagline,
  };
}

export default async function SegmentPage({ params }: PageProps) {
  const { slug } = await params;
  const segment = findSegment(slug);
  if (!segment) notFound();

  const { prev, next } = segmentNeighbors(slug);
  const verifiedCount = segment.items.filter((i) => i.verified).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-ink-faint">
        <Link href="/" className="hover:text-ink">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/segments/" className="hover:text-ink">
          板块档案
        </Link>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <KindBadge kind={segment.kind} />
          <span className="font-mono text-xs tracking-wider text-ink-faint">{segment.era}</span>
        </div>
        <h1 className="mt-3 text-4xl font-bold text-ink">{segment.name}</h1>
        <p className="mt-3 text-lg text-ink-muted">{segment.tagline}</p>
      </header>

      {segment.signature && (
        <blockquote className="mt-6 rounded-xl bg-gold-400/10 px-5 py-4 text-sm leading-relaxed text-gold-200/90">
          {segment.signature}
        </blockquote>
      )}

      <article className="mt-6 space-y-4 leading-loose text-ink-muted">
        {segment.description.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <div className="mt-6 rounded-xl border border-line bg-night-900 px-4 py-3 text-xs text-ink-muted">
        共收录 <span className="font-mono font-bold text-pitch-300">{segment.items.length}</span>{" "}
        条条目，其中已核实 {verifiedCount} 条。标注
        <span className="mx-1 font-medium text-gold-300">待核实</span>
        的内容以节目实际播出为准。本站不存储视频，条目内链接仅为观看入口。
      </div>

      {segment.officialLinks && segment.officialLinks.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {segment.officialLinks.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-pitch-500/15 px-4 py-2 text-xs font-medium text-pitch-300 ring-1 ring-pitch-500/30 transition-colors hover:bg-pitch-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
            >
              ▶ {l.label} ↗
            </a>
          ))}
        </div>
      )}

      {segment.items.length > EXPLORER_THRESHOLD ? (
        <section className="mt-10">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-2 w-2 bg-gold-400" />
            <h2 className="text-xl font-bold text-ink">全期条目</h2>
            <span aria-hidden className="h-px min-w-8 flex-1 bg-line" />
          </div>
          <div className="mt-5">
            <EpisodeExplorer items={segment.items} />
          </div>
        </section>
      ) : (
        <section className="mt-10 space-y-8">
          {segment.items.map((item) => (
            <article
              key={item.title}
              id={encodeURIComponent(item.title)}
              className="scroll-mt-20 rounded-xl border border-line bg-night-900 p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-ink">{item.title}</h2>
                <VerifyBadge verified={item.verified} />
                {item.aired && (
                  <span className="font-mono text-xs text-ink-faint">
                    {item.aired}
                  </span>
                )}
              </div>
              {item.subject && item.subject !== item.title && (
                <p className="mt-1 text-sm font-medium text-pitch-300">
                  {item.subject}
                </p>
              )}
              {item.summary && (
                <p className="mt-3 leading-loose text-ink-muted">{item.summary}</p>
              )}

              {item.quote && (
                <blockquote className="mt-4 rounded-xl bg-gold-400/10 px-4 py-3 text-sm italic leading-relaxed text-gold-200/90">
                  <p className="whitespace-pre-wrap">
                    「{item.quoteFull ?? item.quote}」
                  </p>
                  {item.quoteFull && (
                    <span className="mt-2 block text-[11px] not-italic tracking-widest text-gold-300/70">
                      经典文案 · 全文
                    </span>
                  )}
                </blockquote>
              )}

              {item.music && (
                <p className="mt-3 text-sm text-ink-muted">
                  <span className="mr-1.5 text-gold-300">♪</span>
                  {item.music}
                </p>
              )}

              {item.videos && <WatchLinks videos={item.videos} />}

              {item.note && (
                <p className="mt-3 rounded-lg bg-night-800/70 px-3 py-2 text-xs leading-relaxed text-ink-faint">
                  备注：{item.note}
                </p>
              )}
            </article>
          ))}
        </section>
      )}

      <nav className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6 text-sm">
        <Link
          href={`/segments/${prev.slug}/`}
          className="text-ink-muted transition-colors hover:text-ink"
        >
          ← {prev.name}
        </Link>
        <Link
          href={`/segments/${next.slug}/`}
          className="text-ink-muted transition-colors hover:text-ink"
        >
          {next.name} →
        </Link>
      </nav>
    </div>
  );
}
