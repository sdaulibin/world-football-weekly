import type { VideoHint } from "@/lib/types";

/**
 * 视频入口构造器：统一「已验证直链 / 关键词搜索入口」两类链接的口径。
 * verified: true 表示链接经人工打开或官方 API 验证。
 */

/** B 站关键词搜索入口 */
export function biliSearch(keyword: string): VideoHint {
  return {
    platform: "B站",
    label: `搜索「${keyword}」`,
    url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`,
  };
}

/** B 站已验证视频直链 */
export function bili(bvid: string, label: string): VideoHint {
  return {
    platform: "B站",
    label,
    url: `https://www.bilibili.com/video/${bvid}/`,
    verified: true,
  };
}

/** 央视网官方页面（已验证） */
export function cctv(url: string, label = "官方页面 · 央视网"): VideoHint {
  return { platform: "央视网", label, url, verified: true };
}

/** YouTube 关键词搜索入口（大陆网络需代理访问） */
export function ytSearch(keyword: string): VideoHint {
  return {
    platform: "YouTube",
    label: `搜索「${keyword}」`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`,
  };
}

/** YouTube 已验证视频直链 */
export function yt(videoId: string, label = "在 YouTube 观看"): VideoHint {
  return {
    platform: "YouTube",
    label,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    verified: true,
  };
}
