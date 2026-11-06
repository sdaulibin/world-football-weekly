# 天下足球 · 经典档案

收录 CCTV5《天下足球》自 2000 年开播以来的经典板块与专题：绝对巨星、大型专题片、
十大系列、看球听歌、大赛特辑、退役告别等。非官方球迷资料站，条目逐条标注核实状态。

## 技术栈

与 `~/workspace/messi` 保持一致：

- Next.js 16（App Router，`output: "export"` 纯静态导出）
- React 19 + TypeScript
- Tailwind CSS v4（`@tailwindcss/postcss`）
- Node 22（见 `.nvmrc`）

## 目录结构

```
src/
├── app/                  # 路由页面（静态导出）
│   ├── page.tsx          # 首页
│   ├── segments/         # 板块列表 + [slug] 板块详情（大板块启用搜索浏览器）
│   ├── timeline/         # 节目大事记（年代筛选）
│   ├── stats/            # 档案统计（由数据实时计算）
│   └── about/            # 关于 / 数据规范 / 版权声明
├── components/           # Navbar、Footer、卡片、徽章、EpisodeExplorer 等
├── data/                 # 全部内容数据
│   ├── segments.ts       # 板块框架
│   ├── absolute-stars.ts # 《绝对巨星》全期档案（115 期，见下）
│   └── timeline.ts       # 节目大事记
├── lib/                  # types / utils / videos（链接构造器）
└── research/             # 调研原始笔记（期数列表的来源与考证过程）
```

## 《绝对巨星》数据说明

`src/data/absolute-stars.ts` 收录 2001–2026 年 115 期球星专题，链接 96 条为已验证直链
（B 站 API / 央视网页面核验），其余为平台关键词搜索入口：

- 2001–2010：CCTV 官网老存档页 + B 站补档（巴乔、亨利、巴蒂、皮耶罗、齐祖等）
- 2011–2018：CCTV 官网搜索 API 全量核验 + 豆瓣豆列 + B 站 2018 全年合集（42 期）
- 2019–2026：央视网官方整期页面（伊布、阿圭罗、克罗斯、罗伊斯、凯恩、萨卡等）；
  2019 年起官方不再使用「绝对巨星」板块名，按「整期球星专题」口径收录
- 已知缺口：2001–2002、2005、2007–2009 年期数无公开资料，2014–2017 部分专题仅到年份，
  均在页面与条目 note 中如实标注

## 经典文案字段

条目可带 `quote`（经典解说文案摘录，≤150 字，版权归央视及原作者）与 `quoteSource`
（考据出处链接）；页面提供「♪ 经典文案」筛选，只看已收录文案的期。

考据要点（详见 research/ 笔记）：

- 文案多来自球迷整理的合集长文（网易、头条、游民星空、知乎），故一律标注出处链接与可信度；
- **张冠李戴高发**：「时光列车」属 2014 亨利《谁与争锋》而非 2004 亨利期；「岁月你别催」
  属 2011《罗纳尔多：传奇》；马尔蒂尼名句出自 2010《号码传奇》3 号篇；
- 归属存疑的文案在条目 note 中注明，不强行归期；确认无公开文案的期不做杜撰。

## 常用命令

```bash
npm run dev     # 本地开发
npm run build   # 静态导出至 out/
npm run lint    # ESLint
```

## 部署（Cloudflare Pages）

Git 集成部署：Cloudflare Dashboard → Workers & Pages → Create → Pages →
连接 GitHub 仓库 `sdaulibin/world-football-weekly`，构建配置：

- **框架预设**：Next.js（静态 HTML 导出）/ 或自定义
- **构建命令**：`npx next build`
- **构建输出目录**：`out`
- **Node 版本**：22（仓库已带 `.nvmrc`；如需环境变量则设 `NODE_VERSION=22`）

保存后每次 `git push` 自动构建部署。

## 数据规范

- 所有内容集中在 `src/data/`，页面只负责展示；补充条目即编辑数据文件。
- 每条数据带 `verified` 标记：`false` 在站内显示「待核实」徽章。
- 节目期数、首播日期的公开资料常不一致，条目备注（`note`）记录存疑点。
- 本站不存储视频与图片，视频线索只指向央视频 / 央视网 / B站官方等公开平台。
