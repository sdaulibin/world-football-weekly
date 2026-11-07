import Link from "next/link";
import { site } from "@/data";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-night-900/40">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-ink-muted sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-ink">
            <span
              aria-hidden
              className="h-2 w-2 bg-gold-400"
            />
            {site.name}
          </div>
          <p className="mt-2.5 leading-relaxed text-ink-muted">{site.tagline}</p>
        </div>
        <div>
          <div className="font-medium text-ink">数据说明</div>
          <p className="mt-2.5 leading-relaxed">
            全站数据截至 {site.dataAsOf}。条目多为球迷整理，
            <span className="font-medium text-gold-300">「待核实」</span>
            徽章代表信息尚未经官方渠道确认，欢迎指正补充。
          </p>
        </div>
        <div>
          <div className="font-medium text-ink">站点性质</div>
          <p className="mt-2.5 leading-relaxed">
            非官方球迷资料站，与央视及节目组无隶属关系；不存储任何视频与图片，
            仅提供指向官方或公开平台的入口。
            <Link
              href="/about/"
              className="mx-1 text-pitch-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-400/60"
            >
              了解更多
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center font-mono text-xs text-ink-faint">
        {site.name} · {site.show.channel} · {site.show.launchLabel} · 数据截至{" "}
        {site.dataAsOf}
      </div>
    </footer>
  );
}
