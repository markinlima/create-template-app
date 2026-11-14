# Token economy

How to spend fewer tokens with Claude Code in this template and in the projects
copied from it: how the cost works, how inline work and subagents behave, when
to use which, and what we measured.

Every claim carries one of three labels, so you can tell what to trust:

- **Official**: stated in the Claude Code or Claude API documentation (checked
  on 2026-11-11 against Claude Code 2.1.322; pages in [Sources](#sources)).
- **Measured**: from our own logs and benchmarks. They come from one developer,
  mostly one large monorepo, on 2026-11-01 to 2026-11-10. Re-measure before
  trusting the numbers on a different workflow.
- **Model**: computed from measured inputs. Not a measurement.

## 1. How the cost works

### 1.1 Mechanics (official)

- Claude Code sends the **whole context with every request**: system prompt and
  tool definitions, project context (`CLAUDE.md`, auto memory, rules), and every
  earlier message and tool result. The model remembers nothing between requests.
- Prompt caching lets the API reuse the part of the request that did not change.
  The match is on the **prefix**: a change anywhere in it recomputes everything
  after it. There is no per-file cache.
- Each model has its own cache. Changing the model, or on most models the effort
  level, recomputes the whole request. Other invalidators: adding or removing a
  tool definition, compaction, and upgrading Claude Code.
- A cache entry expires after a period of inactivity, and every hit resets the
  timer. The lifetime (TTL) depends on who is asking:

| Request bucket                                            | Claude subscription, within plan usage | API key, cloud provider or usage credits |
| --------------------------------------------------------- | -------------------------------------- | ---------------------------------------- |
| Main conversation                                         | 1 hour                                 | 5 minutes                                |
| Everything else (subagents, forks, workflows, compaction) | 5 minutes                              | 5 minutes                                |

Settings: `promptCacheTtl` (main conversation) and `subagentPromptCacheTtl`
(everything else), or the `CLAUDE_CODE_PROMPT_CACHE_TTL` and
`CLAUDE_CODE_SUBAGENT_PROMPT_CACHE_TTL` variables; each takes `5m` or `1h`.

- A cache write costs more than plain input and a cache read costs much less
  (see 1.2), so a long session is cheap per reply but never free: **every token
  that enters the context is re-read on every later reply.**

### 1.2 Price multipliers (official, Claude API reference)

Relative to the model's input price. Taken from the Claude API reference for
the current models (cached 2026-11-03); confirm on the live pricing page before
turning them into money.

| Item                                        | Multiplier                                                             |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| Cache write, 5-minute TTL                   | 1.25x                                                                  |
| Cache write, 1-hour TTL                     | 2x                                                                     |
| Cache read                                  | 0.1x in general; 0.05x on Sonnet 5.5 and Opus 5.5; 0.025x on Fable 5.2 |
| Output (Sonnet, Opus, Haiku 5.5, Fable 5.2) | 5x                                                                     |

The cache-read multiplier for Haiku 5.5 was not confirmed in the pricing pages
we read. Our "units" below use read 0.1x, write 1.25x and output 5x, so on
Sonnet 5.5 and Opus 5.5 they **overstate** the read share of the bill. Check
the current prices before turning units into money.

### 1.3 Where the tokens go (measured)

Measured over 8 days (2,629 replies, all projects), in input-equivalent units:

| Part                                              | Share of cost |
| ------------------------------------------------- | ------------- |
| Cache reads (the conversation re-read each reply) | ~78%          |
| Cache writes                                      | ~11%          |
| Output (what the model writes)                    | ~10%          |

The conversation size is what matters. In the heaviest project, 76% of the cost
came from replies made with more than 250k tokens of context, and 36% from
replies above 500k. The biggest session had 1,211 replies; the average context
there was ~330k. Tool results were small (about 2.5M characters of `Bash`
output, 58 `Read` calls in a week): what hurts is that every token that enters
the context is re-read on every later reply.

**Consequence:** tools that only shorten what the model _writes_ attack ~10% of
the cost. The lever is keeping the context small.

## 2. How inline work, a subagent and a fork behave

Three ways to do a piece of work. All facts are **official** unless marked.

| Aspect                        | Inline (main conversation)                      | Subagent (fresh)                                                                                                                      | Fork                                                               |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Context it starts with        | The whole conversation so far; it keeps growing | Empty window plus the delegation prompt. It does not see the history, the skills already invoked or the files already read            | The whole conversation so far, exactly as the main session has it  |
| System prompt                 | Claude Code's                                   | The agent's own prompt plus environment details, not Claude Code's                                                                    | Same as the main session                                           |
| Project instructions          | `CLAUDE.md`, auto memory, rules                 | The `CLAUDE.md` hierarchy and a git status snapshot (skipped by Explore and Plan); no auto memory, no output style                    | Same as the main session                                           |
| Skills                        | Loaded on demand                                | Only those listed in its `skills` field are injected                                                                                  | Same as the main session                                           |
| Tools                         | All                                             | Inherited, narrowed by `tools` and `disallowedTools`; a background subagent gets a smaller set                                        | The main session's exact tool pool                                 |
| Model                         | The session model                               | Per-call `model` alias, then the definition's `model`, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the main model                         | Same as the main session                                           |
| Prompt cache                  | The main conversation's cache                   | Its own cache. Its first request does not read the parent's; the parent's cache is unaffected                                         | Its first request reads the parent's cache                         |
| Cache TTL                     | See 1.1                                         | 5 minutes by default, even on a subscription                                                                                          | 5 minutes by default (bucket "everything else")                    |
| What reaches the main context | Everything, every tool result                   | Only the final report                                                                                                                 | Only the final result                                              |
| Asking the user               | Yes                                             | No `AskUserQuestion`; permission prompts still reach you                                                                              | Steerable from the fork panel (open its transcript, send messages) |
| Steering                      | Interrupt or `/rewind` at any step              | Runs until it finishes or hits `maxTurns`; can be resumed                                                                             | Runs in the background; you can stop it or message it              |
| Nesting                       | n/a                                             | Can spawn subagents up to three layers deep (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`)                                                  | Cannot spawn forks                                                 |
| Persistence                   | The session transcript                          | A transcript per invocation, kept `cleanupPeriodDays` (30 by default). A `memory` field gives a persistent directory; default is none | Not stated in the docs we read                                     |

Facts that follow from the table:

- **Context is per invocation, not per agent name.** Each call creates a new
  instance. To continue one, resume it with `SendMessage`: it keeps its full
  history and its first request can read the cache the original run warmed.
  The built-in Explore and Plan agents are one-shot and cannot be resumed.
- A subagent is **not** memory. It writes nothing to `.agents/memory/` or to the
  assistant's memory on its own. Only the `memory` frontmatter field creates a
  persistent directory (`user`, `project` or `local` scope).
- **Foreground** subagents block the main conversation; **background** ones run
  alongside it. With nothing configured, a subagent Claude spawns starts in the
  background, and while fork mode is on (default from 2.1.302, and in an
  interactive terminal from 2.1.232) Claude cannot wait for one in an
  interactive session.
- Each subagent request counts toward the same usage limits as the main
  conversation. Many subagents returning long reports can flood the main
  context.
- Frontmatter also takes `maxTurns`, `isolation: worktree`, `skills`, `hooks`,
  `permissionMode`, `effort`, `autoCompactWindow` and `mcpServers`. Unknown
  fields are ignored silently, so a typo changes nothing and reports nothing.
- To run every subagent on one model, set `CLAUDE_CODE_SUBAGENT_MODEL` together
  with `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1`; on its own it is only a default.
  Before 2.1.251 the variable came first in the order and overrode everything.
- The built-in **Explore** agent runs on the `opus` alias on a Claude
  subscription, a Console account or a gateway, and on the main model on cloud
  providers. A user or project agent named `Explore` overrides it. Our `explorer`
  has a different name, so Claude can still choose the built-in one.

### 2.1 What a subagent costs

- **Startup, once per call (measured):** its first request writes its own prefix
  to the cache, ~17-18k tokens in all five runs on 2026-11-10 (an earlier
  measurement over 7 subagents gave ~51k and was not reproduced). By the
  official startup list, that prefix is made of the agent's prompt, the tool
  definitions, the `CLAUDE.md` hierarchy, the git snapshot and any preloaded
  skills; the split between them was not measured. The following requests read
  it from cache.
- **Its whole run (measured):** about 50k to 120k input-equivalent units.
- **What it saves (model):** the tokens it keeps out of the main context, which
  would be re-read on every later reply:

  `saved = R x (1.25 + 0.1 x N) + K x 0.1 x C` units

  `R` is the output in tokens that would have entered the main context, `N` the
  replies that follow, `K` the replies of work kept out of the main conversation
  and `C` the size of the main context. The first term alone gives ~13k tokens of
  `R` at N = 50 (25k at N = 20, 7k at N = 100). The second term dominates when
  `C` is large: at `C` = 164k each avoided reply is worth ~16k units. The factors
  assume reads at 0.1x; with cheaper reads (1.2) both sides of the comparison
  shrink, so recompute before trusting the break-even.
- **A fork instead of a fresh subagent (model, from the official cache rules):**
  a fork skips the ~18k startup because it reads the parent's cache, but every
  one of its requests re-reads the whole main context. With a small `C` and a
  task that needs the background, a fork is cheaper than briefing a fresh
  subagent. With a large `C` and a short brief, a fresh subagent is cheaper per
  turn. Not measured here.

## 3. When to use which

### 3.1 Official guidance

Use the **main conversation** when the task needs frequent back-and-forth,
several phases share a lot of context, the change is quick and targeted, or
latency matters. Use a **subagent** when the work produces verbose output you
will not need again, when you want to enforce tool restrictions, or when it is
self-contained and can return a summary. Route simple subagent work to Haiku.

### 3.2 Decision table

There are two reasons to delegate and only the first is about tokens:
(1) **bulky input, small conclusion**; (2) **behavior of its own**: an
independent context, a fixed procedure, restricted tools or another model. For
the second, the value is quality and isolation, and the run costs tokens.

| Situation                                                                     | Choice                                                           | Saves tokens?                                                                                 |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| A known file, one grep, a few lines, a quick targeted change                  | Inline                                                           | No: the startup costs more than the work                                                      |
| Lint, type-check, tests, with output filtered in the same command             | Inline                                                           | No: measured median output of 381 characters; a 3 s lint as a subagent cost ~50k units        |
| A slow command (build, full suite, migration)                                 | Background command with a timeout, same session                  | Yes: no extra prefix, no extra context                                                        |
| Planning a feature                                                            | Inline; hard or risky work: built-in `Plan` with `model: "opus"` | n/a: planning needs the conversation's context                                                |
| Commit, PR, release                                                           | Inline                                                           | No: they need your approval and run outward-facing commands; shrink `C` with `/clear` instead |
| Many file reads or a log that cannot be filtered, only the conclusion matters | Subagent on haiku or sonnet                                      | Yes, when `R` is above the break-even (~13k tokens at small `C`)                              |
| Several replies of side work while the main context is huge (150k+)           | Subagent                                                         | Yes, but `/clear` first is usually cheaper                                                    |
| Side task that needs most of the conversation as background, small `C`        | Fork                                                             | Often: no startup, shared cache                                                               |
| Independent review by a context that did not write the code                   | Subagent (reviewer)                                              | No: it is worth it for quality                                                                |
| Independent investigations that do not depend on each other                   | Several subagents in one message                                 | Time yes, tokens no: each pays its own prefix                                                 |
| Implementation you want to steer step by step                                 | Inline                                                           | n/a: a subagent cannot be steered mid-run                                                     |
| Agent teams or dynamic workflows                                              | Only when the task really fans out                               | No: agent teams use ~7x the tokens of a standard session in plan mode (official)              |

### 3.3 Briefing a subagent

- Give it the goal, which `AGENTS.md` and rules to read, what is already ruled
  out and what "done" looks like. It knows only what the prompt says.
- Ask for a summary: conclusions and `path:line` references, never file dumps.
- Subagents cannot ask you questions: they return open decisions and you ask.
- Group related checks into one call: the prefix is paid per call, and the later
  requests in a call read it from cache.

## 4. Plan for this template

1. **Keep `C` small.** `/clear` on a change of subject; `/compact` around 150k
   when you are active; window 300k (section 5); idle compaction stays on.
2. **Default to inline.** Delegate only when 3.2 says so. Reviewers and the
   doc-updater run once per PR or commit, over the full diff.
3. **Pick the model per call.** Haiku for mechanical reading, Sonnet for
   judgment, Opus for hard planning or risky diffs (`model` parameter).
4. **Harden the agents.** Allowlist `tools` without `Agent`; set `maxTurns`;
   keep descriptions short (Claude Code warns above 15,000 tokens of
   descriptions in total). Decide whether to shadow or deny the built-in Explore.
5. **Measure.** `/usage` shows the prompt-cache line (main conversation only)
   and the subagent share of your plan usage; `docs/token-economy-usage.py` gives
   the baseline in section 11.
6. **Open items, not verified yet:** the cost of a fork versus a fresh subagent
   on a large context; whether a 1-hour subagent TTL ever pays; the exact
   compaction buffer for custom windows (section 5).

## 5. Auto-compact window: 300k

`.agents/settings.json` sets `CLAUDE_CODE_AUTO_COMPACT_WINDOW=300000`.

**Official:**

- The window is how full the context may get before Claude Code compacts. It
  accepts 100k to 1M and is capped at the model's context window.
- Without a setting, models with a native 1M window compact at about 967k tokens.
- Precedence: the environment variable beats `/autocompact`, `--autocompact` and
  the `autoCompactWindow` setting. `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` can only
  lower the trigger, and also applies to subagents. A subagent can set its own
  `autoCompactWindow` in its frontmatter (2.1.296+), but that field is ignored
  while the environment variable is set.
- Idle compaction is on by default from 200k tokens (`CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS`,
  2.1.290+).

**Measured:** with the 1M window the automatic compaction in our logs fired at
967,599 tokens, so ~33k are held back. **Not documented:** that the same buffer
applies to a custom window, so "fires at ~267k" for 300k is an extrapolation.
The prefix (system prompt, tools, memory files, skills, rules; ~37k in this
template, ~65k in the heaviest project) also lives inside the window. Room for
conversation is roughly `window - 33k - prefix`.

**Model:** we replayed the real sessions of the heaviest project (50 segments,
8,565 replies) with different windows. Growth per reply and a ~90k
post-compaction context were taken from the data; the compaction call was
modeled as one read of the context plus ~5k output plus rewriting the new
prefix.

| Window       | Fires at | Cache-read cost vs now | Compactions | Conversation room (heavy project / template) |
| ------------ | -------- | ---------------------- | ----------- | -------------------------------------------- |
| 1M (default) | 967k     | 100%                   | 0           | -                                            |
| **300k**     | **267k** | **53%**                | **53**      | **202k / 230k**                              |
| 250k         | 217k     | 48%                    | 80          | 152k / 180k                                  |
| 225k         | 192k     | 46%                    | 108         | 127k / 155k                                  |
| 200k         | 167k     | 45%                    | 145         | 102k / 130k                                  |

The curve is flat between 200k and 250k (3 points of cost) while compactions
nearly halve, and every compaction loses detail. The window was 250k and was
raised to 300k by choice: ~200-230k of room per cycle and about a third fewer
compactions (53 vs 80), at about 5 points more cost in the model. Since cache
reads are ~78-80% of the cost, this is roughly **-40% of the total**: a model,
not a measurement, and it assumes the same working style. Tune it per project:
window = prefix + 33k + the conversation room you want.

Project `env` values apply after the folder is trusted; for a personal value put
it in `.claude/settings.local.json` instead.

## 6. `/clear` vs `/compact`

- The **prefix** is everything sent before the conversation: system prompt, tool
  definitions (including MCP), skills, `AGENTS.md`/rules, memory; about 45-70k
  tokens here (measured). It is identical every reply, so it is normally a hit.
- **`/clear`** drops the conversation. The next reply is prefix plus your
  message, usually read from cache (rewritten only if the cache expired).
- **`/compact`** sends a separate summarization request that repeats the system
  prompt, tools and the history. While the cache is warm that request reads the
  prefix from cache (official); after a gap longer than the TTL the whole history
  is reprocessed uncached, which is the expensive case. Afterwards the prefix is
  rewritten once (~62k tokens in our logs). The summarization call does not
  appear in the transcripts, so its exact cost is not measured.
- **How long the cache stays warm** depends on the TTL in 1.1: ~5 minutes on an
  API key, cloud provider or usage credits, and 1 hour for the main conversation
  on a subscription within plan usage.
- **Rule of thumb:** a different subject, a finished task, a long task or an
  absence -> `/clear` (+ a short handoff). Same task, context ~150k, you are
  active -> `/compact` early. The `clear-on-context-switch` rule makes the agent
  enforce this. The agent cannot run either command; you type them.

## 7. Subagents in this repo

Files live in `.agents/agents/` (mirrored to `.claude/agents/`); the rules are in
[subagents](../.agents/rules/ai/subagents.md). All six list `tools` without
`Agent`, so they do not spawn subagents, and all set `maxTurns`.

| Agent               | Default model | Why (judgment, not benchmarked)                                                                    |
| ------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `explorer`          | haiku         | search and summarize (code, `node_modules`, web); raise to sonnet for deep cross-module tracing    |
| `doc-updater`       | haiku         | mostly mechanical; applies local doc edits following `documentation.md`                            |
| `browser-tester`    | sonnet        | reads traces and diagnoses causes; haiku is enough for a plain smoke check (pass `model: "haiku"`) |
| `code-reviewer`     | sonnet        | a missed bug costs more than the tokens; opus for large or risky diffs                             |
| `security-reviewer` | sonnet        | opus when auth, authorization, crypto or data isolation changed                                    |
| `refactor-cleaner`  | sonnet        | wrong "unused" claims waste more than they save; report only                                       |

**Removed as subagents (2026-11-10).**

- `linting-test` became the `lint-and-test` rule. Measured in local transcripts:
  1,835 lint, test, build and docker runs in 30 days had a median output of 381
  characters (10 above 5k). One run of a 3 s lint cost ~50k input-equivalent
  units, almost all startup (17.9k tokens written to cache on the first
  request). Checks run inline with filtered output instead.
- `runner`: on a real CI log of 375k characters (~95k tokens) it cost
  ~79k units (36k cache write at 1.25x, 137k cache read at 0.1x, 4k output at 5x)
  and returned ~1.5k tokens, so the full log never entered the main context. A
  filtered `grep` inline would have put ~7k tokens there, about 44k units at
  N = 50: cheaper. Its report also did not state the run's outcome, because it
  grepped the log instead of asking GitHub; use
  `gh run view <id> --json conclusion,jobs` for that.
- `planner`: planning needs the conversation's context, which a subagent lacks.
  It is now the `plan-before-implementing` rule; only hard or risky work goes to
  the built-in `Plan` agent with `model: "opus"`.
- `tdd-guide` was deliberately **not** made a subagent: TDD happens while
  editing, and a subagent's work cannot be steered. It is the `tdd` rule.

**Measured runs, a real project commit `14a49b048`, same day:**

| Agent                   | Cost (units)                              | Kept out of the main context              | Result                                                                                                                                                                                                                                                                                                                                         |
| ----------------------- | ----------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doc-updater`           | ~121k (51k write, 182k read, 7.7k output) | ~17k tokens                               | two stale docs, one unsupported example and a code bug; about even with reading inline                                                                                                                                                                                                                                                         |
| `code-reviewer` (blind) | ~53k (17k startup)                        | ~7.5k tokens                              | found the seeded bug (a stray `:` left in a Tailwind class) and a behavior regression; one of its two main findings (no reduced-motion handling) was wrong, a global rule exists in the app's global stylesheet; about even with reading inline (~47k at N = 50)                                                                               |
| `explorer`              | ~69k (17k startup)                        | ~3k tokens                                | correct answer to a medium question; inline would have cost ~19k, so it was not worth it                                                                                                                                                                                                                                                       |
| `browser-tester`        | ~60k (27k startup, 20 tool calls)         | ~4.5k tokens of text, plus one screenshot | on a tiny local fixture with 4 planted problems it found all 4 (console error, 404 image, button without a name, low contrast) and one extra (image without `alt`); the startup is ~10k larger than the other agents, probably the browser tool schemas. Tokens alone do not justify it on a page this small; a real app page was not measured |

The reviewers are kept for a different reason than tokens: an independent
context. Units ignore that subagents on haiku or sonnet can be cheaper per
token in dollars than the main model; that was not measured.

**Commit, PR and release flows** (transcripts of a real project, 71 runs: 37 `/commit`,
24 `/open-pr`, 10 `/release`; a run is the replies from the skill call to the
next user prompt or skill, so it is a heuristic):

- They are short (median 4-5 replies) but start in a large context (median 164k,
  182k and 219k tokens), and **78-84% of their cost is re-reading that context**.
  Median cost: ~139k units for `/commit`, ~77k for `/open-pr`, ~135k for
  `/release`.
- The diff reached the main context in 31 of 37 commits (median ~5k characters),
  7 of them above 20k characters (max 164k, ~41k tokens); PR and release flows
  almost never had a diff in context (0 of 34 above 20k). The skill body adds
  ~2k tokens that stay in the context, ~6.7k units per run.
- All 71 runs cost 17.0M units, 3.8% of everything in that project (443.5M). Modeled
  alternatives: the same flows at ~60k tokens of context, 6.5M; a hybrid where a
  read-only subagent reads the diff and proposes the commits while the main
  conversation approves and runs them, 10.5M, better in only 30 of 71 runs (13
  of 20 above 250k). Both are models, not measurements.
- Conclusion: no subagent for commit, PR or release. They need your approval and
  run outward-facing commands in the main conversation. Run them with a small
  context (`clear-on-context-switch`), and for a huge diff read
  `git diff --stat` and go one workspace at a time.

## 8. Tools we evaluated (measured)

| Tool                | What it does                                                 | What we measured                                                                                                                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Answer concisely." | Prompt line shortening replies                               | -7% to -14% output tokens (Sonnet), -9% (Opus); total cost change within noise. Quality unchanged. **Adopted** (free).                                                                                                                                                                             |
| Caveman             | Skill that makes replies telegraphic                         | Same as above on Sonnet (-10% to -12%); no gain on Opus; total cost within noise. Independent reports put output savings at 15-25%, and output is a small share of the bill. Not adopted.                                                                                                          |
| token-savior        | MCP server for structural code lookups                       | On 10 symbol-lookup tasks in a 4k-file monorepo it was 2-7% **more** expensive: its 15 tool definitions add ~14k tokens to the prefix and plain `grep` already answers cheaply. Same accuracy. Not adopted.                                                                                        |
| pxpipe              | Local proxy that renders bulky context as images             | Pilot at ~330k context (Sonnet): -34% input tokens by its own log, but exact-text recall dropped (2 of 4 questions on exact lines vs 4 of 4 without it). Cost could not be measured reliably in that pilot. It sits in the credential path and is lossy. Not adopted; **not tested at 400k/600k**. |
| rtk                 | CLI proxy that compresses `Bash` output (tests, git, builds) | **Not tested**: the installer was blocked in the session. The best candidate for noisy test/build logs.                                                                                                                                                                                            |

Benchmark details: HumanEval (20 problems) x Sonnet 5.5 / Opus 5.5 x medium /
high x 3 prompt variants = 240 calls, 239 correct; repository navigation: 10
real "where is X defined and who uses it" questions x 2 models x 3 arms = 60
runs, accuracy equal across arms. Both are small samples: differences of about
5% are noise.

## 9. Official levers we do not use yet

Listed on the Claude Code costs page; none was measured here.

- **A `PreToolUse` hook that trims `Bash` output** (for example the last 100
  lines of a test run). It does natively what `rtk` does through a proxy.
- **Code intelligence plugins** (language servers): symbol navigation instead of
  text search, fewer file reads in typed languages.
- **Move workflow detail from `CLAUDE.md` into skills**: skills load only when
  invoked. Keep `CLAUDE.md` under 200 lines.
- **Effort level**: Sonnet 5.5, Opus 5.5, Haiku 5.5 and Fable 5.2 default to
  `medium`. Thinking cannot be turned off on those models; lower the effort for
  simple tasks instead.
- **MCP tool definitions are deferred by default**, so only names enter the
  context until a tool is used. Prefer a CLI (`gh`, `aws`) to an MCP server when
  one exists, and disable unused servers.
- **`/usage` recommendations**: on a subscription plan it attributes usage to
  skills, subagents and MCP servers and suggests changes.

## 10. What is in this repo

| File                                           | Purpose                                                       |
| ---------------------------------------------- | ------------------------------------------------------------- |
| `.agents/settings.json`                        | auto-compact window 300k                                      |
| `.agents/rules/ai/concise-answers.md`          | "Answer concisely."                                           |
| `.agents/rules/ai/clear-on-context-switch.md`  | ask for `/clear` on a new subject                             |
| `.agents/rules/ai/plan-before-implementing.md` | plan, get approval, then implement                            |
| `.agents/rules/ai/subagents.md`                | when and how to delegate, model overrides                     |
| `.agents/rules/global/tdd.md`                  | test first (replaces `tdd-guide`)                             |
| `.agents/rules/ai/lint-and-test.md`            | run lint and tests inline, filtered (replaces `linting-test`) |
| `.agents/agents/*.md`                          | the six subagents                                             |
| `docs/token-economy-usage.py`                  | usage report for re-measuring                                 |

To adopt this in another project copy `.agents/` (and this doc if wanted) and
adjust the commands in `lint-and-test` and the `browser-tester` MCP names.

## 11. Re-evaluating

Behavior changes once subagents and `/clear` habits are in use, so the tool
verdicts above are valid for the _old_ usage. After two or three weeks run:

```bash
python3 -I docs/token-economy-usage.py 7 <project>
```

and compare with the baseline (heaviest project, 8 days, 2,209 replies): cache
read 80.5% / write 9.5% / output 10.0%; replies above 250k context = 76% of
cost; subagents 3.3% of replies and 1.4% of cost; `Bash` 2.5M characters
returned.

- Context above 250k still dominates -> revisit the auto-compact limit and
  habits; test **pxpipe** properly at 400k/600k (direct API calls, not
  `--resume`).
- `Bash` output share grows (tests, builds, containers) -> try the `PreToolUse`
  hook from section 9, then **rtk**.
- `Read`/search volume grows -> try a code intelligence plugin, then
  **token-savior** again.
- Output becomes a bigger share -> caveman or stricter reply rules.

## 12. Ideas not implemented

- `dependency-auditor` (haiku): outdated/vulnerable packages summary.
- `migration-reviewer` (sonnet): review database migrations for locks/data loss.
- `pr-describer` (haiku): draft PR text from the diff (approval stays with the
  user; see the `commit` skill).

## Sources

Official, checked on 2026-11-11:

- Claude Code docs: [subagents](https://code.claude.com/docs/en/sub-agents.md),
  [prompt caching](https://code.claude.com/docs/en/prompt-caching.md),
  [costs](https://code.claude.com/docs/en/costs.md),
  [model configuration](https://code.claude.com/docs/en/model-config.md),
  [environment variables](https://code.claude.com/docs/en/env-vars.md)
- Claude API docs: [prompt caching and pricing](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

Other:

- [feature-dev agents (Anthropic)](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev/agents)
- [everything-claude-code agents](https://github.com/WorldFlowAI/everything-claude-code/tree/main/agents)
- [Caveman](https://www.implicator.ai/caveman-claude-code-skill-cuts-output-20-your-bill-barely-notices-2/),
  [token-savior](https://pypi.org/project/token-savior),
  [pxpipe](https://github.com/teamchong/pxpipe),
  [rtk](https://github.com/rtk-ai/rtk)
