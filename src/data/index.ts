import { site, sources } from "./site";
import { segments } from "./segments";
import { timeline } from "./timeline";
import type { Segment, SegmentItem } from "@/lib/types";

export { site, sources, segments, timeline };
export { yearOf, decadeOf } from "@/lib/utils";

/** 按 slug 查板块 */
export function findSegment(slug: string): Segment | undefined {
  return segments.find((s) => s.slug === slug);
}

/** 查某板块下的条目 */
export function findItem(
  segmentSlug: string,
  itemTitle: string,
): SegmentItem | undefined {
  return findSegment(segmentSlug)?.items.find((i) => i.title === itemTitle);
}

/** 相邻板块（详情页底部的上一篇/下一篇） */
export function segmentNeighbors(slug: string) {
  const idx = segments.findIndex((s) => s.slug === slug);
  const prev = segments[(idx - 1 + segments.length) % segments.length];
  const next = segments[(idx + 1) % segments.length];
  return { prev, next };
}

/** 全站条目（带所属板块引用） */
export interface FlatItem {
  segment: Segment;
  item: SegmentItem;
}

export function allItems(): FlatItem[] {
  return segments.flatMap((segment) =>
    segment.items.map((item) => ({ segment, item })),
  );
}
