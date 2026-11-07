import type { VideoHint } from "@/lib/types";
import { sortVideos } from "@/lib/videoPriority";

/**
 * 视频线索卡：本站不存储视频，仅提供官方/公开平台入口。
 * 优先级：B站 > YouTube > 央视网（CCTV 作为备用入口排在最后）。
 * verified = true 表示链接经人工打开核验；否则为关键词搜索入口。
 */
export function WatchLinks({ videos }: { videos: VideoHint[] }) {
  if (videos.length === 0) return null;
  const sorted = sortVideos(videos);
  return (
    <div className="mt-3 space-y-2">
      {sorted.map((v, i) => (
        <div
          key={v.url}
          className={`flex flex-wrap items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${
            i === 0
              ? "border-pitch-500/40 bg-pitch-500/10"
              : "border-line bg-night-800/60"
          }`}
        >
          <span className={i === 0 ? "text-pitch-300" : "text-ink-faint"}>▶</span>
          <span
            className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-medium text-white ${
              v.platform.includes("B站") ? "bg-pink-600" : "bg-pitch-600"
            }`}
          >
            {v.platform}
          </span>
          <a
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-pitch-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
          >
            {v.label} ↗
          </a>
          {v.verified ? (
            <span className="rounded-full bg-pitch-500/15 px-2 py-0.5 text-[11px] font-medium text-pitch-300 ring-1 ring-pitch-500/30">
              已验证直链
            </span>
          ) : (
            <span className="text-xs text-ink-faint">关键词搜索入口</span>
          )}
          {i === 0 && (
            <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-night-950">
              荐
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
