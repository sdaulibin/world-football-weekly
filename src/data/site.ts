/** 站点配置 */
export const site = {
  name: "天下足球 · 经典档案",
  shortName: "天下档案",
  show: {
    zh: "天下足球",
    channel: "CCTV5（央视体育频道）",
    /** 首播时间：公开资料多记为 2000 年 11 月 27 日（周一晚） */
    launch: "2000-11",
    launchLabel: "2000 年 11 月开播 · 周一晚黄金档",
  },
  /** 全站数据快照；节目仍在播出，档案会持续补充 */
  dataAsOf: "2026-11",
  tagline: "用足球星星点亮平凡人生——一份由球迷整理的《天下足球》经典板块档案。",
  description:
    "收录 CCTV5《天下足球》自 2000 年开播以来的经典板块与专题：绝对巨星、十大系列、看球听歌、大型专题片与大赛特辑。非官方球迷资料站，条目逐条标注核实状态。",
} as const;

/** 数据与影像参考来源 */
export const sources = [
  { label: "维基百科 · 天下足球（节目沿革）", url: "https://zh.wikipedia.org/wiki/天下足球" },
  { label: "央视网体育 · 天下足球（官方栏目页）", url: "https://sports.cctv.com/" },
  { label: "央视频 · CCTV5 官方账号（官方回看）", url: "https://www.yangshipin.cn/" },
  { label: "B站 · 央视体育官方账号（正版搬运）", url: "https://space.bilibili.com/382616282" },
] as const;
