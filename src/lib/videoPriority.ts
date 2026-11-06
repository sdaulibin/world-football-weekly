import type { VideoHint } from "@/lib/types";

/**
 * 视频入口优先级（直链优先，搜索兜底）：
 * 1. B站直链
 * 2. YouTube 直链
 * 3. CCTV（央视网/央视频）直链
 * 4. B站搜索入口
 * 5. YouTube 搜索入口及其他搜索
 */

function isSearch(v: VideoHint): boolean {
  return /search\.bilibili\.com|youtube\.com\/results|\/search/i.test(v.url);
}

export function priorityOf(v: VideoHint): number {
  const search = isSearch(v);
  const ytPlat = v.platform.includes("YouTube");
  const biliPlat = v.platform.includes("B站");

  if (!search) {
    if (biliPlat) return 0; // B站直链
    if (ytPlat) return 1; // YouTube 直链
    return 2; // CCTV 等官方直链
  }
  if (biliPlat) return 3; // B站搜索
  if (ytPlat) return 4; // YouTube 搜索
  return 5;
}

/** 按优先级稳定排序（同级保持原顺序） */
export function sortVideos(videos: VideoHint[]): VideoHint[] {
  return videos
    .map((v, i) => ({ v, i, p: priorityOf(v) }))
    .sort((a, b) => a.p - b.p || a.i - b.i)
    .map((x) => x.v);
}

/** 主入口（最高优先级的一条） */
export function primaryVideo(videos: VideoHint[]): VideoHint | undefined {
  return sortVideos(videos)[0];
}

/** 备用入口（主入口之外的全部） */
export function backupVideos(videos: VideoHint[]): VideoHint[] {
  return sortVideos(videos).slice(1);
}
