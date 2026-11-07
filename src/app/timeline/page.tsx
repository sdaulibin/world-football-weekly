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
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-2 w-2 bg-gold-400" />
          <h1 className="text-3xl font-bold text-ink">节目大事记</h1>
          <span aria-hidden className="h-px min-w-8 flex-1 bg-line" />
        </div>
        <p className="mt-4 leading-relaxed text-ink-muted">
          从 {site.show.launchLabel.split(" · ")[0]}到今天：开播、王牌板块成型、
          名场面专题与大赛节点。实心绿点为已核实事件，空心金点为待核实事件。
        </p>
      </header>
      <div className="mt-10">
        <TimelineExplorer events={timeline} />
      </div>
    </div>
  );
}
