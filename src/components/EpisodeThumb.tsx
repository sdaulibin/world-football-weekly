/**
 * 节目缩略图（参考 hackertube 的视频卡片版式）：
 * 16:9 圆角画框 + 右下角深色时长徽章。
 * 有球星照片时用照片做封面（维基百科自由版权图，自托管于 /public/photos/as/），
 * 无照片时回退为 CSS 生成的「气质画」：草坪条纹 + 主角巨型剪影字 + 年份 + 朝代标签。
 */

/** 年份 → 画框主色（夜场绿 → 金色荣耀 → 深空蓝） */
function toneFor(aired?: string): { from: string; to: string; glyph: string } {
  const y = aired ? Number(aired.match(/^(\d{4})/)?.[1]) : undefined;
  if (y === undefined) {
    return { from: "#334155", to: "#1e293b", glyph: "待考" };
  }
  if (y < 2011) return { from: "#0f5132", to: "#052e1a", glyph: "经典" };
  if (y < 2019) return { from: "#8a5a00", to: "#3d2a00", glyph: "告别" };
  return { from: "#1e3a8a", to: "#0b1226", glyph: "新篇" };
}

export function EpisodeThumb({
  title,
  subject,
  aired,
  duration,
  photo,
}: {
  title: string;
  subject?: string;
  aired?: string;
  duration?: string;
  photo?: string;
}) {
  const tone = toneFor(aired);
  const year = aired?.match(/^(\d{4})/)?.[1] ?? "待考";
  // 剪影取主角名的前两字，无主角则取标题前两字
  const glyph = (subject ?? title).slice(0, 2);

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${tone.from}, ${tone.to})`,
      }}
    >
      {photo ? (
        <>
          <img
            src={photo}
            alt={`${subject ?? title} 封面`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* 压暗底部，保证年份与时长徽章可读 */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,.45), transparent 45%), linear-gradient(to bottom, rgba(0,0,0,.25), transparent 30%)",
            }}
          />
        </>
      ) : (
        <>
          {/* 草坪条纹 */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 14%, transparent 14% 28%)",
            }}
          />
          {/* 泛光 */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 120%, rgba(255,255,255,.28), transparent 65%)",
            }}
          />
          {/* 巨型剪影字 */}
          <span
            aria-hidden
            className="absolute -bottom-3 left-3 select-none font-black leading-none text-white/15"
            style={{ fontSize: "clamp(48px, 9vw, 76px)" }}
          >
            {glyph}
          </span>
        </>
      )}

      {/* 左上角标：年份 + 朝代 */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
        <span className="rounded-md bg-black/45 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white/95 backdrop-blur-sm">
          {year}
        </span>
        <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
          {tone.glyph}
        </span>
      </div>

      {/* 右下角时长徽章（参考站同款位置与配色） */}
      {duration && (
        <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-white">
          {duration}
        </span>
      )}
    </div>
  );
}
