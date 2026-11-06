/**
 * 天下足球 · 经典档案 数据模型
 *
 * 所有内容数据集中在 src/data/，页面只负责展示。
 * 节目资料以电视播出为准，网上整理的期数常有不一致：
 * 每条数据带 verified 标记 —— false 表示待核实，站内以「待核实」徽章明示。
 */

/** 板块性质：常设板块 / 特别制作 / 大赛特辑 */
export type SegmentKind = "regular" | "special" | "event";

/** 板块下的一个条目：一期专题、一期盘点或一首记忆配乐 */
export interface SegmentItem {
  title: string;
  /** 主题人物 / 事件，如「罗伯特·巴乔」 */
  subject?: string;
  /** 首播时间，精度不一："2007" / "2011-02"；缺失即未考证 */
  aired?: string;
  summary: string;
  /** 与该期强关联的经典文案摘录（短句，≤150 字；版权归央视及原作者） */
  quote?: string;
  /** 文案全文（多段时以 \n 分隔；弹卡中完整展示） */
  quoteFull?: string;
  /** 文案摘录的来源页面链接（考据依据） */
  quoteSource?: string;
  /** 关联配乐（BGM 是天下足球的灵魂） */
  music?: string;
  /** 节目时长文本，如 "107 分钟"（卡片右下角时长徽章） */
  duration?: string;
  /** 视频线索（可多条）：本站不存储视频，只留官方/公开平台入口 */
  videos?: VideoHint[];
  /** 信息可信度：false = 网友整理、待核实 */
  verified: boolean;
  /** 备注：口径、存疑点等 */
  note?: string;
}

/** 视频线索（搜索入口或官方页面，非嵌入） */
export interface VideoHint {
  /** 平台名：B站 / 央视频 / 央视网 等 */
  platform: string;
  /** 链接文案，如「搜索《贝影》」「在 B 站观看」 */
  label: string;
  /** 是否经人工打开验证过的直链 */
  verified?: boolean;
  url: string;
}

/** 一个板块（栏目） */
export interface Segment {
  slug: string;
  name: string;
  kind: SegmentKind;
  /** 活跃年代，如「2001 年起」「2007 年前后」 */
  era: string;
  /** 一句话定位 */
  tagline: string;
  /** 板块介绍（1–2 段） */
  description: string[];
  /** 板块记忆点 / 观众口碑 */
  signature?: string;
  /** 板块级官方观看入口（央视网/央视频/B站官方账号等聚合页） */
  officialLinks?: { label: string; url: string }[];
  items: SegmentItem[];
}

/** 节目大事记（时间轴用） */
export interface TimelineEvent {
  /** 精度不一："2000-11" / "2007" */
  date: string;
  title: string;
  detail: string;
  verified: boolean;
  /** 关联板块 slug（可选） */
  segmentSlug?: string;
}
