import type { Metadata } from "next";
import { site, sources } from "@/data";

export const metadata: Metadata = {
  title: "关于本站",
  description: "本站定位、数据规范、版权声明与技术说明。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-pitch-950">关于本站</h1>
        <p className="mt-3 leading-relaxed text-slate-600">{site.tagline}</p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-pitch-900">定位</h2>
        <p className="mt-3 leading-loose text-slate-600">
          本站是球迷自建的《天下足球》经典板块档案站，收录自{" "}
          {site.show.launchLabel.split(" · ")[0]}
          以来的板块框架与代表条目：
          绝对巨星、大型专题片、十大系列、看球听歌、大赛特辑等。本站与中央广播电视总台、
          CCTV5 及节目组无任何隶属关系。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-pitch-900">数据规范</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-loose text-slate-600">
          <li>
            每条数据带核实状态徽章：
            <span className="mx-1 rounded-full bg-pitch-100 px-2 py-0.5 text-xs font-medium text-pitch-700">
              已核实
            </span>
            表示信息经过交叉验证；
            <span className="mx-1 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
              待核实
            </span>
            表示来自球迷整理、尚待官方渠道确认。
          </li>
          <li>首播时间精度不一，按已知程度记录为年、年月或具体日期。</li>
          <li>
            经典文案（如「岁月你别催」「当时光的列车……」）在球迷社区流传广泛，
            但具体出处期数常无定论，凡引用均按待核实处理。
          </li>
          <li>发现错误或愿意补充线索，欢迎提出修正——档案因分享而完整。</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-pitch-900">版权声明</h2>
        <p className="mt-3 leading-loose text-slate-600">
          本站不存储、不分发任何节目视频与音频；条目中的视频入口仅指向
          央视频、央视网、B站央视体育官方账号等官方或公开平台。文案引文仅为
          短句引用与评论目的，权利归原作者及中央电视台所有。
        </p>
        <p className="mt-3 leading-loose text-slate-600">
          球星封面图来自维基百科各条目头图（多为自由授权内容），本站按原授权协议
          署名使用并自托管；每张图对应的原始条目见{" "}
          <code className="rounded bg-pitch-50 px-1.5 py-0.5 text-xs">src/data/photos-as.ts</code>
          。如权利人对具体图片有异议，请提出，我们将及时移除。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-pitch-900">参考来源</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pitch-700 hover:underline"
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-pitch-900">技术说明</h2>
        <p className="mt-3 leading-loose text-slate-600">
          Next.js（App Router，纯静态导出）+ React + Tailwind CSS + TypeScript。
          全部内容为类型化数据文件，构建产物为纯静态页面，可部署到任意静态托管。
        </p>
      </section>
    </div>
  );
}
