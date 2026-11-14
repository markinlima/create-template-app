#!/usr/bin/env python3
"""Summarize Claude Code token usage from local transcripts (~/.claude/projects).

Usage: python3 -I docs/token-economy-usage.py [days=7] [project-substring]

Costs are shown in *input-equivalent units* using relative prices (cache read
0.1x, cache write 1.25x, output 5x, input 1x). They are not dollars; use them
to compare periods and find what dominates, not to bill.
"""
import collections as C
import glob
import json
import os
import sys
from datetime import datetime, timedelta, timezone

days = int(sys.argv[1]) if len(sys.argv) > 1 else 7
only = sys.argv[2] if len(sys.argv) > 2 else ""
cut = datetime.now(timezone.utc) - timedelta(days=days)
W = dict(inp=1.0, cr=0.1, cw=1.25, out=5.0)

seen = set()
by_model = C.defaultdict(C.Counter)
buckets = C.defaultdict(C.Counter)
sessions = C.defaultdict(C.Counter)
sub = C.Counter()
tool_chars = C.Counter()
tool_calls = C.Counter()
BUCKETS = [(100_000, "<100k"), (250_000, "100-250k"), (500_000, "250-500k"), (10**9, ">500k")]


def units(c):
    return sum(c[k] * W[k] for k in W)


paths = glob.glob(os.path.expanduser("~/.claude/projects/*/**/*.jsonl"), recursive=True)
for f in paths:
    if only and only not in f:
        continue
    if os.path.getmtime(f) < cut.timestamp():
        continue
    is_sub = "/subagents/" in f
    names = {}
    for line in open(f, errors="ignore"):
        try:
            d = json.loads(line)
            t = datetime.fromisoformat(d["timestamp"].replace("Z", "+00:00"))
        except (ValueError, KeyError, TypeError):
            continue
        if t < cut:
            continue
        m = d.get("message") or {}
        if d.get("type") == "assistant":
            for b in m.get("content") or []:
                if isinstance(b, dict) and b.get("type") == "tool_use":
                    names[b["id"]] = b["name"]
                    tool_calls[b["name"]] += 1
            u = m.get("usage")
            k = (m.get("id"), d.get("requestId"))
            if not u or k in seen:
                continue
            seen.add(k)
            c = C.Counter(
                inp=u.get("input_tokens", 0),
                out=u.get("output_tokens", 0),
                cr=u.get("cache_read_input_tokens", 0),
                cw=u.get("cache_creation_input_tokens", 0),
                n=1,
            )
            ctx = c["inp"] + c["cr"] + c["cw"]
            by_model[m.get("model", "?")].update(c)
            sessions[os.path.basename(f)[:8] + " " + f.split("/projects/")[1].split("/")[0][-28:]].update(c)
            bk = next(name for lim, name in BUCKETS if ctx < lim)
            buckets[bk].update(c)
            buckets[bk]["ctx"] += ctx
            if is_sub:
                sub.update(c)
        elif d.get("type") == "user" and isinstance(m.get("content"), list):
            for b in m["content"]:
                if isinstance(b, dict) and b.get("type") == "tool_result":
                    x = b.get("content")
                    n = len(x) if isinstance(x, str) else sum(len(y.get("text", "")) for y in x if isinstance(y, dict))
                    tool_chars[names.get(b.get("tool_use_id"), "?")] += n

total = C.Counter()
for c in by_model.values():
    total.update(c)
tu = units(total) or 1
print(f"== last {days} day(s){' · ' + only if only else ''}: {total['n']} replies")
print("\n-- cost split (input-equivalent units)")
for k, label in (("cr", "cache read"), ("cw", "cache write"), ("out", "output"), ("inp", "fresh input")):
    print(f"  {label:12} {100 * total[k] * W[k] / tu:5.1f}%  ({total[k]:,} tokens)")
print("\n-- by model")
for mo, c in sorted(by_model.items(), key=lambda x: -units(x[1])):
    print(f"  {mo:24} {c['n']:6} replies  {100 * units(c) / tu:5.1f}% of cost")
print("\n-- by context size per reply (where the cost is)")
for _, name in BUCKETS:
    c = buckets[name]
    if c["n"]:
        print(f"  {name:9} {c['n']:6} replies  {100 * units(c) / tu:5.1f}% of cost  avg ctx {c['ctx'] // c['n']:,}")
print(f"\n-- subagents: {sub['n']} replies ({100 * sub['n'] / max(1, total['n']):.1f}%), {100 * units(sub) / tu:.1f}% of cost")
print("\n-- biggest sessions")
for s, c in sorted(sessions.items(), key=lambda x: -units(x[1]))[:6]:
    print(f"  {s:38} {c['n']:6} replies  {100 * units(c) / tu:5.1f}%")
print("\n-- tool results returned to the context (chars)")
for t, n in tool_chars.most_common(6):
    print(f"  {t[:40]:40} {tool_calls[t]:5} calls  {n:>10,} chars")
