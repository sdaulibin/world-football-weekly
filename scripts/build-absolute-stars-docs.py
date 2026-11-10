#!/usr/bin/env python3
"""
从 src/data/absolute-stars.ts 生成《绝对巨星》每期一个的 Markdown 文案档案。

数据来源：项目内 absolute-stars.ts（经 esbuild 解析为 JSON，不手抄、不猜测）。
输出：文案/绝对巨星/NNN-slug.md，一期一个文件。

B 阶段补录的完整旁白存放在 文案/绝对巨星/_补充文案/<key>.md，
本脚本会自动合并进对应期；没有补充文案的期如实标注「尚未收录」。

用法：
    python3 scripts/build-absolute-stars-docs.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "文案" / "绝对巨星"
SUPP_DIR = OUT_DIR / "_补充文案"
EXTRA_MD = OUT_DIR / "_清单外期次.md"
DATA_TS = ROOT / "src" / "data" / "absolute-stars.ts"

# TS 中按年份定义的 B 站合集号（p<YYYY> 帮助函数引用）
COLLECTIONS: dict[str, str] = {}


def _load_collections(src: str) -> None:
    for m in re.finditer(r'const COLLECTION_(\d{4})\s*=\s*"(BV[\w]+)"', src):
        COLLECTIONS[m.group(1)] = m.group(2)

# 每年一期，序号用于文件排序，与真实年份一一对应
FIELD_ORDER = ["title", "subject", "aired", "duration", "summary", "quote",
               "quoteFull", "quoteSource", "videos", "verified", "note"]


def load_data() -> list[dict]:
    """从 TS 源解析条目：按缩进定位条目，用括号配对取完整块，再逐字段解析。

    不依赖 esbuild/node；括号配对保证不会像松散正则那样漏条目。
    """
    src = DATA_TS.read_text(encoding="utf-8")
    _load_collections(src)
    start = src.index("export const absoluteStars")
    body = src[start:]

    blocks = []
    i = 0
    while True:
        # 条目起始：行首两空格 + "{"
        m = re.compile(r"^  \{\s*$", re.M).search(body, i)
        if not m:
            break
        j = m.end()
        depth = 1
        k = m.start() + body[m.start():].index("{")
        k += 1
        while k < len(body) and depth:
            c = body[k]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            elif c == '"' or c == "'":
                # 跳过字符串，避免字符串里的花括号干扰
                q = c
                k += 1
                while k < len(body) and body[k] != q:
                    k += 2 if body[k] == "\\" else 1
            k += 1
        blocks.append(body[m.start():k])
        i = k

    items = []
    for raw in blocks:
        items.append(parse_block(raw))
    return items


def _unescape(s: str) -> str:
    return (s.replace("\\n", "\n").replace("\\t", "\t")
             .replace('\\"', '"').replace("\\'", "'").replace("\\\\", "\\"))


def parse_block(raw: str) -> dict:
    """解析单个条目块中的标量与 videos 数组。"""
    item: dict = {}
    # 标量字段：key: "..."（跨行也支持）
    for key in ("title", "subject", "aired", "duration", "summary",
                "quote", "quoteFull", "quoteSource"):
        m = re.search(r'\n    ' + key + r':\s*"((?:[^"\\]|\\.)*)"', raw)
        if m:
            item[key] = _unescape(m.group(1))
    for key in ("verified",):
        m = re.search(r'\n    ' + key + r':\s*(true|false)', raw)
        if m:
            item[key] = m.group(1) == "true"
    # note 有可能是字符串拼接，取第一个字符串字面量
    m = re.search(r'\n    note:\s*"((?:[^"\\]|\\.)*)"', raw)
    if m:
        item["note"] = _unescape(m.group(1))
    # videos 数组
    item["videos"] = parse_videos(raw)
    return item


def parse_videos(raw: str) -> list[dict]:
    """解析 videos 数组：同时支持对象字面量与 bili/cctv/yt/biliSearch/p2018 调用。"""
    m = re.search(r"\n    videos:\s*\[", raw)
    if not m:
        return []
    start = raw.index("[", m.start())
    depth, k = 0, start
    while k < len(raw):
        if raw[k] == "[":
            depth += 1
        elif raw[k] == "]":
            depth -= 1
            if depth == 0:
                break
        elif raw[k] in "\"'`":
            q = raw[k]
            k += 1
            while k < len(raw) and raw[k] != q:
                k += 2 if raw[k] == "\\" else 1
        k += 1
    arr = raw[start:k + 1]

    import urllib.parse
    vids: list[dict] = []

    # 1) 对象字段形式：platform/label/url（可能与其他调用混排）
    for vm in re.finditer(r"\{([^{}]*)\}", arr):
        seg = vm.group(1)
        v: dict = {}
        for f in ("platform", "label", "url"):
            fm = re.search(f + r':\s*[`"\']((?:[^`"\']|\\.)*)[`"\']', seg)
            if fm:
                v[f] = _unescape(fm.group(1))
        if v.get("url"):
            if re.search(r"verified:\s*true", seg):
                v["verified"] = True
            vids.append(v)

    def grab(name: str) -> list[tuple[str, ...]]:
        out = []
        for fm in re.finditer(name + r"\(([^()]*)\)", arr):
            # 同时捕获字符串字面量与裸数字，位置保持原顺序
            args = [a or b for a, b in
                    re.findall(r'[`"\']((?:[^`"\']|\\.)*)[`"\']|(\d+)', fm.group(1))]
            out.append(tuple(args))
        return out

    # 2) bili("BV...", "label") / cctv("url", "label") / yt("id", "label")
    for vid, label in [a for a in grab("bili") if not a[0].startswith("http")]:
        vids.append({"platform": "B站", "label": label,
                     "url": f"https://www.bilibili.com/video/{vid}/", "verified": True})
    for url, label in grab("cctv"):
        vids.append({"platform": "央视网", "label": label or "官方页面 · 央视网",
                     "url": url, "verified": True})
    for vid, label in grab("yt"):
        vids.append({"platform": "YouTube", "label": label or "在 YouTube 观看",
                     "url": f"https://www.youtube.com/watch?v={vid}", "verified": True})
    # 3) biliSearch("kw") / ytSearch("kw")
    for (kw,) in grab("biliSearch"):
        vids.append({"platform": "B站", "label": f"搜索「{kw}」",
                     "url": "https://search.bilibili.com/all?keyword=" + urllib.parse.quote(kw)})
    # 4) p2018(n, "label") —— 2018 全年合集分 P
    for args in grab("p2018"):
        if len(args) >= 2:
            n, label = args[0], args[1]
        elif len(args) == 1:
            n, label = args[0], "在 B 站观看整期"
        else:
            continue
        if not n.isdigit():
            continue
        vids.append({"platform": "B站", "label": label,
                     "url": f"https://www.bilibili.com/video/BV11W411Q7VK?p={n}", "verified": True})
    # 5) p<YYYY>(n, "label") 形式的其他年份合集（p2018 已由规则 4 处理）
    for fm in re.finditer(r"(?<![\w])p(\d{4})\(([^()]*)\)", arr):
        year = fm.group(1)
        if year == "2018":
            continue
        args = [a or b for a, b in
                re.findall(r'[`"\']((?:[^`"\']|\\.)*)[`"\']|(\d+)', fm.group(2))]
        bv = COLLECTIONS.get(year)
        if not (bv and args):
            continue
        vids.append({"platform": "B站", "label": args[-1],
                     "url": f"https://www.bilibili.com/video/{bv}?p={args[0]}",
                     "verified": True})

    # 去重并保持首次出现顺序
    seen, uniq = set(), []
    for v in vids:
        sig = (v.get("platform"), v.get("url"), v.get("label"))
        if sig not in seen:
            seen.add(sig)
            uniq.append(v)
    return uniq


def slugify(name: str, maxlen: int = 40) -> str:
    """文件名安全化：保留中日韩、字母数字，其余折叠为连字符。"""
    name = unicodedata.normalize("NFKC", name).strip()
    name = re.sub(r"[·・\s]+", "-", name)          # 间隔号 → 连字符
    name = re.sub(r"[（）()【】\[\]「」《》]", "", name)  # 去掉括号类
    name = re.sub(r"[^\w\-\u4e00-\u9fff\u3040-\u30ff]", "", name, flags=re.UNICODE)
    name = re.sub(r"-{2,}", "-", name).strip("-")
    return name[:maxlen] or "untitled"


def supplement_for(key: str) -> str | None:
    """B 阶段补录的完整旁白；_补充文案/<key>.md 存在则读入。"""
    p = SUPP_DIR / f"{key}.md"
    if p.exists():
        text = p.read_text(encoding="utf-8").strip()
        return text or None
    return None


def key_of(index: int, item: dict) -> str:
    """稳定 key：位置 + 球星 + 年份，供补充文案文件名使用。"""
    return f"{index:03d}-{slugify(item.get('subject') or item['title'])}-{item.get('aired') or 'NA'}"


def video_lines(videos: list[dict]) -> list[str]:
    lines = []
    for v in videos or []:
        mark = " ✓" if v.get("verified") else ""
        lines.append(f"- [{v.get('platform','')}] {v.get('label','')}{mark} — {v.get('url','')}")
    return lines


def render(index: int, item: dict, full_text: str | None, supp_key: str) -> str:
    title = item.get("title") or ""
    subject = item.get("subject") or ""
    aired = item.get("aired")
    duration = item.get("duration")
    summary = item.get("summary") or ""
    quote = item.get("quote") or ""
    quote_full = item.get("quoteFull") or ""
    quote_source = item.get("quoteSource") or ""
    note = item.get("note") or ""
    verified = item.get("verified")

    year = aired or "年份待考"
    L: list[str] = []

    # ── 标题区 ──────────────────────────────────────────
    if subject:
        L.append(f"# {subject}　《{title}》")
    else:
        L.append(f"# 《{title}》")
    L.append("")
    meta = [f"**播出年份**：{year}"]
    if duration:
        meta.append(f"**片长**：{duration}")
    if subject:
        meta.append(f"**主角**：{subject}")
    L.append("　·　".join(meta))
    L.append("")

    # ── 文案正文 ────────────────────────────────────────
    # 已收录文案与补录文案**并列展示**，不互相替换：
    # 补录文件装的是从公开来源新找到的段落，不该把原数据里的文案挤掉。
    L.append("## 解说文案")
    L.append("")

    def emit(body: str, lead: str) -> None:
        """写一段文案：把自带的 > 来源行与说明行合并成单个引用块。"""
        notes, kept = [], []
        for line in (body or "").split("\n"):
            s = line.strip()
            if s.startswith(">"):
                notes.append(s.lstrip(">").strip())
            else:
                kept.append(line)
        L.append("> " + "　".join([lead] + notes))
        L.append("")
        for para in "\n".join(kept).split("\n"):
            para = para.strip()
            if para:
                L.append(para)
                L.append("")

    base = quote_full or quote
    if base:
        emit(base, "该项目已收录的文案原文；该期节目完整旁白尚未收录。"
             if quote_full else
             "该项目已收录的文案摘录；该期节目完整旁白尚未收录。")

    if full_text:
        if base:
            L.append("### 补录段落")
            L.append("")
        emit(full_text, "以下为从公开来源补录的文案段落；"
                        "该期节目完整旁白尚未收录。")

    if not base and not full_text:
        L.append("**该期解说文案尚未收录。**")
        L.append("")
        L.append("现有公开可核来源中未检索到本期旁白原文，此处不臆造、不用其他期文案顶替。")
        L.append("")
        L.append("补充方法：将找到的旁白原文写入 "
                 f"`文案/绝对巨星/_补充文案/{supp_key}.md`，重跑生成脚本即可自动并入。")
        L.append("")

    # 摘录与全文不同时，附上摘录便于对照
    if quote and quote_full and quote.strip() not in quote_full:
        L.append("### 流传摘录")
        L.append("")
        L.append(quote)
        L.append("")

    # ── 节目信息 ────────────────────────────────────────
    L.append("## 节目信息")
    L.append("")
    if summary:
        L.append(summary)
        L.append("")
    vl = video_lines(item.get("videos") or [])
    if vl:
        L.append("**观看入口**")
        L.append("")
        L.extend(vl)
        L.append("")

    # ── 来源与备注 ──────────────────────────────────────
    src_notes = []
    if quote_source:
        src_notes.append(f"- 文案来源：{quote_source}")
    if note:
        src_notes.append(f"- 备注：{note}")
    if verified is True:
        src_notes.append("- 链接核验：已通过人工或官方 API 验证")
    elif verified is False:
        src_notes.append("- 链接核验：**未经核验**，仅供参考")
    if src_notes:
        L.append("## 来源与备注")
        L.append("")
        L.extend(src_notes)
        L.append("")

    L.append("---")
    L.append("")
    L.append(f"*本文件由 `scripts/build-absolute-stars-docs.py` 从 "
             f"`src/data/absolute-stars.ts` 生成，请勿手工编辑。*")
    return "\n".join(L)


def load_extra() -> list[dict]:
    """读取 `_清单外期次.md` 里 YAML 代码块中的补充期次。

    这些是原 121 期清单漏掉、但素材中确有旁白的期次。
    数据以 YAML 形式写在 Markdown 的 ```yaml 块里，便于人工阅读与修改。
    """
    if not EXTRA_MD.exists():
        return []
    text = EXTRA_MD.read_text(encoding="utf-8")
    m = re.search(r"```yaml\n(.*?)\n```", text, re.S)
    if not m:
        return []
    try:
        import yaml  # type: ignore
        items = yaml.safe_load(m.group(1)) or []
        return items
    except ImportError:
        return _parse_yaml_subset(m.group(1))


def _parse_yaml_subset(block: str) -> list[dict]:
    """无 PyYAML 时的最小解析：支持本文件用到的字段与 `|-` 多行块。"""
    items: list[dict] = []
    cur: dict | None = None
    lines = block.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("- "):
            if cur:
                items.append(cur)
            cur = {}
            line = line[2:]
            if ":" in line:
                k, v = line.split(":", 1)
                cur[k.strip()] = _scalar(v.strip())
            i += 1
            continue
        if cur is not None and line.startswith("  "):
            body = line[2:]
            if body.startswith("- "):
                k, v = body[2:].split(":", 1) if ":" in body[2:] else ("", "")
                cur.setdefault("videos", []).append({k.strip(): _scalar(v.strip())})
                i += 1
                continue
            if ":" in body:
                k, v = body.split(":", 1)
                k, v = k.strip(), v.strip()
                if v in ("|-", "|"):
                    blk = []
                    i += 1
                    while i < len(lines) and (lines[i].startswith("      ") or not lines[i].strip()):
                        blk.append(lines[i][6:] if lines[i].startswith("      ") else "")
                        i += 1
                    cur[k] = "\n".join(blk).strip()
                    continue
                cur[k] = _scalar(v)
        i += 1
    if cur:
        items.append(cur)
    return items


def _scalar(v: str):
    if v in ("", "null", "~"):
        return None
    if v in ("true", "false"):
        return v == "true"
    return v.strip('"\'')


def main() -> int:
    data = load_data()
    extra = load_extra()
    SUPP_DIR.mkdir(parents=True, exist_ok=True)

    # 清掉旧文件（保留 _补充文案 目录与 _清单外期次.md 数据源）
    for old in OUT_DIR.glob("*.md"):
        if old.name != EXTRA_MD.name:
            old.unlink()

    index_rows = []
    supp_count = 0
    for i, item in enumerate(data, start=1):
        key = key_of(i, item)
        supp = supplement_for(key)
        if supp:
            supp_count += 1
        fname = f"{key}.md"
        text = render(i, item, supp, key)
        (OUT_DIR / fname).write_text(text, encoding="utf-8")
        index_rows.append({
            "file": fname, "title": item.get("title") or "",
            "subject": item.get("subject") or "",
            "aired": item.get("aired") or "待考",
            "has_full": bool(supp or item.get("quoteFull")),
            "has_any": bool(supp or item.get("quoteFull") or item.get("quote")),
            "has_supp": bool(supp),
            "extra": False,
        })

    # ── 清单外期次（原 121 期漏掉的）───────────────────────
    extra_rows = []
    for j, item in enumerate(extra, start=1):
        fname = f"X{j:02d}-{slugify(item.get('subject') or item.get('title') or '')}.md"
        text = render(len(data) + j, item, None, fname[:-3])
        (OUT_DIR / fname).write_text(text, encoding="utf-8")
        extra_rows.append({
            "file": fname, "title": item.get("title") or "",
            "subject": item.get("subject") or "",
            "aired": item.get("aired") or "待考",
            "has_any": bool(item.get("quoteFull") or item.get("quote")),
            "extra": True,
        })

    # ── 索引 ────────────────────────────────────────────
    idx = ["# 《天下足球·绝对巨星》文案档案", "",
           f"主清单 **{len(index_rows)} 期**（按 `src/data/absolute-stars.ts`），"
           f"另有 **{len(extra_rows)} 期**清单外期次，"
           f"合计 **{len(index_rows) + len(extra_rows)} 个文件**。", "",
           f"其中已有文案 **{sum(r['has_any'] for r in index_rows) + len(extra_rows)} 期**"
           f"（主清单 {sum(r['has_any'] for r in index_rows)} + "
           f"清单外 {len(extra_rows)}），"
           f"待补 **{sum(not r['has_any'] for r in index_rows)} 期**。", "",
           "## 主清单", "",
           "| # | 期名 | 主角 | 年份 | 文案 | 文件 |", "|---|---|---|---|---|---|"]
    for n, r in enumerate(index_rows, start=1):
        if r["has_supp"]:
            mark = "原文＋补录"
        elif r["has_full"]:
            mark = "原文"
        elif r["has_any"]:
            mark = "摘录"
        else:
            mark = "待收录"
        subj = r["subject"] or "—"
        idx.append(f"| {n} | {r['title']} | {subj} | {r['aired']} | {mark} | "
                   f"[{r['file']}]({r['file']}) |")
    idx += ["", "---", "", "## 清单外期次", "",
            f"以下 **{len(extra_rows)} 期**不在原 121 期清单内，但素材中确有旁白，"
            "属于同期《绝对巨星》或球星专题，一并收录。", "",
            "| 期名 | 主角 | 年份 | 文件 |", "|---|---|---|---|"]
    for r in extra_rows:
        idx.append(f"| {r['title']} | {r['subject'] or '—'} | {r['aired']} | "
                   f"[{r['file']}]({r['file']}) |")
    idx += ["", "清单外期次的原始数据写在 `_清单外期次.md`（YAML），"
            "可直接编辑后重跑生成脚本。", ""]

    idx += ["", "---", "",
            "**文案状态说明**（重要）：", "",
            "- `原文`：项目数据中已收录的文案，多为流传最广的段落。",
            "- `原文＋补录`：在已收录文案之外，又从公开来源补录了段落，文档中两者并列展示。",
            "- `摘录`：仅有一两句话的片段。",
            "- `待收录`：公开来源中未检索到该期旁白。", "",
            "**关于「完整旁白」**：节目实际时长 50–107 分钟，完整旁白通常数千字。"
            "本项目及全部公开文字来源提供的都是**精选段落**，没有任何一期拿到过"
            "逐字完整旁白。详见 `research/素材完整度核查.md`。"
            "唯一可靠途径是观看整期视频并转录（B 站/央视网有完整视频）。", ""]
    (OUT_DIR / "README.md").write_text("\n".join(idx), encoding="utf-8")

    total = len(index_rows) + len(extra_rows)
    print(f"生成 {total} 个文件 -> {OUT_DIR}")
    print(f"  主清单 {len(index_rows)} 期：已有文案 "
          f"{sum(r['has_any'] for r in index_rows)}"
          f"（其中补录 {supp_count}），待收录 "
          f"{sum(not r['has_any'] for r in index_rows)}")
    print(f"  清单外 {len(extra_rows)} 期：全部有文案")
    return 0


if __name__ == "__main__":
    sys.exit(main())
