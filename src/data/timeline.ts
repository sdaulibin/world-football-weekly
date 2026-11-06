import type { TimelineEvent } from "@/lib/types";

/** 节目大事记（按时间顺序；存疑事件一律 verified: false） */
export const timeline: TimelineEvent[] = [
  {
    date: "2000-11",
    title: "《天下足球》开播",
    detail:
      "CCTV5 推出足球专题栏目，长期定档周一晚黄金时段。公开资料多记首播为 2000 年 11 月 27 日，具体日期待核实。",
    verified: false,
  },
  {
    date: "2001",
    title: "《绝对巨星》成型",
    detail:
      "球星纪录片板块《绝对巨星》渐成栏目王牌，早期专题以巴乔、马拉多纳等一代球星为主角，期序待核实。",
    verified: false,
    segmentSlug: "absolute-stars",
  },
  {
    date: "2002",
    title: "韩日世界杯特辑",
    detail:
      "中国队首进世界杯、巴西第五次捧杯。栏目围绕大赛制作特别内容，「看球听歌」等环节的剪辑开始在网络流传。",
    verified: false,
    segmentSlug: "tournament-specials",
  },
  {
    date: "2006",
    title: "德国世界杯年",
    detail: "围绕德国世界杯制作回顾与前瞻特辑；同年齐达内决赛红牌成为其后专题片的重要素材。",
    verified: false,
    segmentSlug: "tournament-specials",
  },
  {
    date: "2007",
    title: "《贝影》播出",
    detail:
      "贝克汉姆专题片《贝影》上线，被视为栏目大型专题片的巅峰之作，配乐与文案至今仍被球迷反复引用。",
    verified: false,
    segmentSlug: "specials",
  },
  {
    date: "2009",
    title: "马尔蒂尼挂靴告别",
    detail: "红黑队长 24 年米兰生涯落幕，栏目制作告别特辑，《Because of You》等配乐随剪辑广泛传播。",
    verified: false,
    segmentSlug: "farewells",
  },
  {
    date: "2011-02",
    title: "送别罗纳尔多",
    detail:
      "大罗宣布退役，栏目推出告别特辑；「岁月你别催，该来的我不推」成为流传最广的栏目文案之一。",
    verified: false,
    segmentSlug: "farewells",
  },
  {
    date: "2013",
    title: "贝克汉姆退役、《贝影》终章",
    detail: "万人迷宣布退役，栏目回顾其职业生涯，为 2007 年的《贝影》写下续篇。",
    verified: false,
    segmentSlug: "farewells",
  },
  {
    date: "2014",
    title: "巴西世界杯特别策划",
    detail: "德国 7:1 东道主、梅西屈居亚军——大赛之年栏目推出系列回顾与专题。",
    verified: false,
    segmentSlug: "tournament-specials",
  },
  {
    date: "2018",
    title: "俄罗斯世界杯特别节目",
    detail: "围绕俄罗斯世界杯制作系列内容；「绝代双骄」时代进入世界杯叙事的核心章节。",
    verified: false,
    segmentSlug: "tournament-specials",
  },
  {
    date: "2020-11",
    title: "开播二十周年",
    detail:
      "栏目播出满 20 年。当年是否有官方周年特辑待核实，但球迷社区的「二十年盘点」自发酵已成现象。",
    verified: false,
  },
  {
    date: "2022-12",
    title: "梅西封王 · 卡塔尔之冬",
    detail:
      "卢塞尔决赛之夜为「绝代双骄」时代画上句点，栏目围绕卡塔尔世界杯推出特别内容，梅西专题再迎流量高峰。",
    verified: false,
    segmentSlug: "tournament-specials",
  },
  {
    date: "2023",
    title: "新媒体时代续播",
    detail:
      "节目随总台媒体格局调整，通过央视频、B站央视体育官方账号等新媒体渠道继续触达观众，经典专题正版回看逐步上架。",
    verified: false,
  },
  {
    date: "2025-11",
    title: "开播二十五周年",
    detail: "栏目迎来 25 周年。官方纪念安排待核实——也是本档案站持续补全条目的动力。",
    verified: false,
  },
];
