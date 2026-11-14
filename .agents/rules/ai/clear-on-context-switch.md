# Clear the context when the subject changes

Every reply re-reads the whole conversation. Prompt-cache entries expire after a
period without use: 5 minutes on an API key, a cloud provider or usage credits,
and 1 hour for the main conversation on a Claude subscription within plan usage.
You usually cannot tell which applies, so treat ~5 minutes as the safe
assumption. A long task or a user who stepped away makes the cache go stale, and
a stale cache turns `/compact` into a full, expensive rewrite of the context,
while `/clear` costs almost nothing. Files loaded for one feature are rarely
useful for the next one, so carrying them over only costs tokens. See
[token economy](../../../docs/token-economy.md) for the TTL table.

## Rule

Before starting a request, decide whether it belongs to the context already
loaded (same feature, bug, area or files).

- **Same subject** — continue normally.
- **Completely different subject** (another feature, bug, app or package, with
  no files or decisions in common) — **stop before doing any work** and tell
  the user to run `/clear` first. Do not start the new task in the polluted
  context. Include a short handoff the user can paste after clearing (goal,
  files that matter, decisions already made) when the old task is unfinished.
  Only continue in the same session if the user explicitly says so.
- **A task just finished** (committed, PR opened, question answered) and the
  context is large — suggest `/clear` before the next one.
- **About to run `/commit`, `/open-pr` or `/release` with a large context**
  (above ~100k tokens) — suggest `/clear` first, with a two-line handoff (what
  changed and why, branch, target). Measured on 71 such flows of a real project:
  78-84% of their cost was re-reading the context that already existed (median
  164k-219k tokens), and the same flows at ~60k tokens would have cost about 62%
  less. These flows need the user's approval in the main conversation, so a
  subagent cannot replace this. See [token economy](../../../docs/token-economy.md).
- **Same task, context getting large, user is active** — suggest `/compact`
  early (around 150k tokens) instead of waiting for the automatic one.
- **User was away longer than the cache lifetime, or the task ran for a long
  time** — prefer `/clear` plus a handoff over `/compact`. If the user says they
  are on a subscription (1-hour main-conversation cache), a gap of a few minutes
  is still warm and `/compact` is fine.

You cannot run `/clear` or `/compact` yourself: ask the user to type them.

## Opting out

Saving tokens is the user's choice. If they say they don't want these
reminders (e.g. "don't ask me to clear", "I don't care about token usage",
"keep going in this session"), stop applying this rule for the rest of the
session: no `/clear` or `/compact` suggestions, and start new subjects in the
current context without asking. Don't mention it again, and don't carry the
opt-out into another session unless they repeat it. If they ask to turn the
reminders back on, apply the rule again.
