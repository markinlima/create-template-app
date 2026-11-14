# Plan before implementing

Every feature or refactor that is not trivial is planned first and executed
only after the user approves the plan. This saves tokens (no throwaway
implementation) and avoids discovering a rejected approach after it is built.

## Rule

1. **Plan inline.** Read the area's `AGENTS.md`, the relevant rules and
   `.agents/memory/*`, and the code the change touches. Do not edit code yet.
   Planning stays in the main conversation because it needs the context of what
   the user asked and decided; a subagent only knows what a briefing says. Plan
   mode is fine for this.
2. **Present** the plan together with the _open decisions_ and the alternatives.
   Never settle a business rule or a debatable design choice on your own;
   routine choices that follow an existing convention need no question.
3. **Wait for approval.** Adjust the plan if the user redirects.
4. **Execute** the approved plan. If reality forces a deviation, stop and ask.

Skip planning for trivial work: a typo, a copy change, a one-line fix, a
config tweak, adding one test.

## What the plan contains

- **Goal** and **size** (small, medium, large), and how to run it: inline,
  sequential subagents, or parallel worktrees (only for independent pieces).
- **Current state**: the relevant flow, with `path` references, and what can be
  reused.
- **Options** with trade-offs and a recommendation.
- **Open decisions**: numbered questions for the user, each with a default.
- **Steps**, in order, grouped into phases that can be verified on their own.
- **Tests** to write first (see [tdd](../global/tdd.md)), and the level of each.
- **Risks and rollback**: migrations, contracts, anything hard to undo.
- **Out of scope**: what was left out on purpose.

## Hard or risky work: plan with a stronger model

Planning is the one step where a stronger model pays for itself. When the work:

- spans three or more workspaces or layers;
- changes a database schema, migrations, authentication or authorization;
- changes a public API contract or a shared package used by several apps;
- is an architectural choice with long-lived consequences;
- or the user says it is hard or risky,

delegate the planning to the built-in `Plan` agent with `model: "opus"` and a
briefing that carries the user's request and decisions so far. Present its plan
and open decisions yourself (it cannot ask the user). Never plan with `haiku`.
Everything else is planned inline, because a subagent costs more than it saves
here (see [subagents](./subagents.md)).
