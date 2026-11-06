import type { Metadata } from "next";
import { timeline, site } from "@/data";
import { TimelineExplorer } from "@/components/TimelineExplorer";

export const metadata: Metadata = {
  title: "大事记",
  description: "《天下足球》2000 年开播至今的节目大事记：开播、名场面专题与大赛节点。",
};

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-pitch-950">节目大事记</h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          从 {site.show.launchLabel.split(" · ")[0]}到今天：开播、王牌板块成型、
          名场面专题与大赛节点。绿点为已核实事件，琥珀点为待核实事件。
        </p>
      </header>
      <div className="mt-10">
        <TimelineExplorer events={timeline} />
      </div>
    </div>
  );
}
