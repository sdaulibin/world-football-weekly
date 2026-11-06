import type { Metadata } from "next";
import { segments } from "@/data";
import { SegmentCard } from "@/components/SegmentCard";

export const metadata: Metadata = {
  title: "板块档案",
  description: "《天下足球》经典板块总览：绝对巨星、大型专题片、十大系列、看球听歌与大赛特辑。",
};

const groups = [
  { kind: "regular", label: "常设板块", hint: "随每周节目固定或长期出现的板块" },
  { kind: "special", label: "特别制作", hint: "整期倾注的大型专题与告别特辑" },
  { kind: "event", label: "大赛特辑", hint: "世界杯、欧洲杯等大赛节点的内容" },
] as const;

export default function SegmentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-pitch-950">板块档案</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
          按「常设板块 / 特别制作 / 大赛特辑」三类组织。每个板块页内附条目清单、
          经典文案、配乐线索与视频入口。
        </p>
      </header>

      {groups.map((g) => {
        const list = segments.filter((s) => s.kind === g.kind);
        if (list.length === 0) return null;
        return (
          <section key={g.kind} className="mt-12">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-bold text-pitch-900">{g.label}</h2>
              <span className="text-sm text-slate-400">{g.hint}</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <SegmentCard key={s.slug} segment={s} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
