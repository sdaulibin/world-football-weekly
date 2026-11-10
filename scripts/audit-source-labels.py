#!/usr/bin/env python3
"""
抽检素材文件中「期名标注 vs 正文内容」是否一致。

背景：已发现 `网易号_看一次哭一次_文案合集.txt` 的标注系统性错位一格。
其他素材可能有同类问题。此脚本对所有素材做一次关键词一致性检查，
把「标注的人名不在该段正文里」的段落标出来，供人工复核。

用法：
    python3 scripts/audit-source-labels.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "research" / "原始素材"

# 常见球星姓名片段，用于判定段落写的是谁
NAMES = [
    "贝克汉姆", "亨利", "巴拉克", "因扎吉", "卡卡", "皮尔洛", "劳尔", "巴蒂",
    "博格坎普", "里克尔梅", "卡尼吉亚", "罗纳尔多", "齐达内", "马拉多纳",
    "克洛泽", "梅西", "C罗", "吉格斯", "托蒂", "杰拉德", "马尔蒂尼",
    "内斯塔", "卡恩", "卡纳瓦罗", "欧文", "皮耶罗", "普约尔", "萨内蒂",
    "内德维德", "巴乔", "范尼", "舍甫琴科", "伊布", "德罗巴", "特里",
    "阿隆索", "兰帕德", "托雷斯", "维阿", "莱万", "莫德里奇", "克罗斯",
]


def names_in(text: str) -> list[str]:
    return [n for n in NAMES if n in text]


def audit_labelled_file(path: Path) -> list[str]:
    """对 `—— 《期名》` 形式的标注做一致性检查。

    注意：标注遵循「正文在前、标注紧跟其后」的排版，因此必须取
    **标注之前**的那段正文。早先版本用 re.split 取到了标注之后的段落，
    得到整体错位一格的假象（见 research/素材陷阱_期名标注错位.md）。
    """
    t = path.read_text(encoding="utf-8")
    issues = []
    marks = list(re.finditer(r"——\s*(?:\d{4}\s*年)?《([^》]+)》", t))
    for n, m in enumerate(marks):
        label = m.group(1)
        start = marks[n - 1].end() if n else 0
        body = t[start:m.start()]
        lab_names = names_in(label)
        body_names = names_in(body)
        if lab_names and body_names and not set(lab_names) & set(body_names):
            issues.append(
                f"  标注《{label}》（{lab_names}）但正文写的是 {body_names}")
    return issues


def main() -> int:
    total_issues = 0
    for f in sorted(SRC.glob("*.txt")):
        issues = audit_labelled_file(f)
        if issues:
            print(f"\n⚠ {f.name}")
            for i in issues:
                print(i)
            total_issues += len(issues)
        else:
            print(f"✓ {f.name} 未发现标注与正文明显矛盾")
    print()
    if total_issues:
        print(f"共 {total_issues} 处疑似错位标注，需人工复核后再使用。")
        print("参见 research/素材陷阱_期名标注错位.md")
    return 1 if total_issues else 0


if __name__ == "__main__":
    sys.exit(main())
