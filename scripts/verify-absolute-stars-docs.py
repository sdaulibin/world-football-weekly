#!/usr/bin/env python3
"""
校验《绝对巨星》文案档案的一致性，并核对补充文案的来源标注。

用法：
    python3 scripts/verify-absolute-stars-docs.py

检查项：
    1. 文件数与绝对巨星条目数一致，编号连续
    2. 每份文档结构完整（标题 / 解说文案 / 页脚），无残留占位符
    3. README 索引与实际文件一一对应
    4. _补充文案 下的文件都能对应到一个期次（没有孤儿）
    5. _补充文案 每份都带来源标注
    6. 补充文案内容与已有 quoteFull 不重复（避免重复收录）
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "文案" / "绝对巨星"
SUPP = DOCS / "_补充文案"

failures: list[str] = []
warnings: list[str] = []


DATA_FILES = {"README.md", "_清单外期次.md"}


def doc_files() -> list[Path]:
    """主清单文档 + 清单外文档；不含索引与数据源文件。"""
    return sorted(f for f in DOCS.glob("*.md") if f.name not in DATA_FILES)


def check_doc_structure() -> tuple[int, int]:
    files = doc_files()
    for f in files:
        t = f.read_text(encoding="utf-8")
        name = f.name
        if not t.startswith("# "):
            failures.append(f"{name}: 缺少一级标题")
        if "## 解说文案" not in t:
            failures.append(f"{name}: 缺少「解说文案」小节")
        if "生成，请勿手工编辑" not in t:
            failures.append(f"{name}: 缺少生成页脚")
        if re.search(r"\{\{|\}\}", t):
            failures.append(f"{name}: 残留模板占位符")
    main_ids = [f.name[:3] for f in files if not f.name.startswith("X")]
    expect = [f"{i:03d}" for i in range(1, len(main_ids) + 1)]
    if main_ids != expect:
        failures.append(f"主清单文件编号不连续：{main_ids[:5]}... 共 {len(main_ids)}")
    x_ids = [f.name[:3] for f in files if f.name.startswith("X")]
    if x_ids != [f"X{i:02d}" for i in range(1, len(x_ids) + 1)]:
        failures.append(f"清单外文件编号不连续：{x_ids}")
    # 「尚未收录」以加粗整句出现时才是真的没有文案；
    # 有文案的期在说明行里也会出现该词，不能只做子串判断。
    return len(files), sum(
        1 for f in files
        if "**该期解说文案尚未收录。**" not in f.read_text(encoding="utf-8"))


def doc_has_copy(path: Path) -> bool:
    return "**该期解说文案尚未收录。**" not in path.read_text(encoding="utf-8")


def check_index(total: int, with_copy: int) -> None:
    idx = DOCS / "README.md"
    if not idx.exists():
        failures.append("缺少 README.md 索引")
        return
    t = idx.read_text(encoding="utf-8")
    linked = re.findall(r"\]\(((?:\d{3}|X\d{2})-[^)]+\.md)\)", t)
    if len(linked) != total:
        failures.append(f"README 链接 {len(linked)} 条，实际文件 {total} 个")
    missing = [l for l in linked if not (DOCS / l).exists()]
    if missing:
        failures.append(f"README 指向不存在的文件：{missing[:3]}")


def check_supplements() -> int:
    if not SUPP.exists():
        return 0
    files = sorted(SUPP.glob("*.md"))
    doc_keys = {f.name[:-3] for f in doc_files()}
    for f in files:
        key = f.name[:-3]
        if key not in doc_keys:
            failures.append(f"_补充文案/{f.name}: 没有对应的期次文件（孤儿）")
        t = f.read_text(encoding="utf-8").strip()
        if not t:
            failures.append(f"_补充文案/{f.name}: 内容为空")
            continue
        if "来源" not in t:
            warnings.append(f"_补充文案/{f.name}: 未标注来源")
        body = re.sub(r"^>.*$", "", t, flags=re.M).strip()
        if len(body) < 20:
            warnings.append(f"_补充文案/{f.name}: 正文过短（{len(body)} 字）")
    return len(files)


def check_duplication() -> None:
    """补充文案不应与文档中原本就有的 quoteFull 重复。

    文档渲染时已把补充正文写进去了，所以直接搜全文必然命中；
    这里只取「非补充来源」的段落，即文档里已有的原始文案。
    """
    for f in sorted(SUPP.glob("*.md")):
        key = f.name[:-3]
        doc = DOCS / f"{key}.md"
        if not doc.exists():
            continue
        body = re.sub(r"^>.*$", "", f.read_text(encoding="utf-8"),
                      flags=re.M).strip()
        if not body:
            continue
        t = doc.read_text(encoding="utf-8")
        m = re.search(r"## 解说文案\n\n(.*?)\n## ", t, re.S)
        if not m:
            continue
        # 去掉引用说明行与补充正文本身，剩下的才是文档原有文案
        section = m.group(1)
        section = re.sub(r"^>.*$", "", section, flags=re.M)
        for para in [p for p in body.split("\n") if len(p.strip()) >= 20]:
            section = section.replace(para.strip(), "")
        existing = re.sub(r"\s+", "", section)
        if not existing:
            continue
        norm = re.sub(r"\s+", "", body)
        if norm and (norm in existing):
            warnings.append(f"{f.name}: 补录内容与文档已有文案重复")


def main() -> int:
    total, with_copy = check_doc_structure()
    check_index(total, with_copy)
    supp_count = check_supplements()
    check_duplication()

    print(f"文档：{total} 期，其中已有文案 {with_copy} 期")
    print(f"补充文案：{supp_count} 份")
    for w in warnings:
        print(f"WARN: {w}")
    for f in failures:
        print(f"ERROR: {f}")
    if failures:
        print(f"\n✗ {len(failures)} 个错误")
        return 1
    print("\n✓ 全部通过" + (f"（{len(warnings)} 条提示）" if warnings else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
