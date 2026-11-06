/** 从 "2007" / "2006-07" / "2011-02" 等字段提取年份 */
export function yearOf(dateLike?: string): number | undefined {
  if (!dateLike) return undefined;
  const m = dateLike.match(/^(\d{4})/);
  return m ? Number(m[1]) : undefined;
}

/** 年份 → 年代分组键，如 2007 → "2000s"；无年份返回 "unknown" */
export function decadeOf(dateLike?: string): string {
  const y = yearOf(dateLike);
  return y ? `${Math.floor(y / 10) * 10}s` : "unknown";
}

/** 板块条目数超过该阈值时，详情页启用搜索+筛选浏览器 */
export const EXPLORER_THRESHOLD = 8;
