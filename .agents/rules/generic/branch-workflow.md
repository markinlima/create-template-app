# Trunk-based branch workflow

This describes the branching strategy/process used on projects that follow
it — separate from [branches.md](./branches.md), which covers how an
individual branch is *named*. This rule covers how branches *flow* into
each other.

## Trunk branches

Three possible trunk branches, in flow order:

- **`dev`** — the main, most unstable trunk. Receives pull requests from
  every developer. No automatic deploy. Exists purely as the shared
  reference point so all devs converge their changes in one place.
- **`staging`** — optional, not every project has it. A more stable
  snapshot of `dev`: builds an RC image and auto-deploys it to a
  development/staging environment. Exists so QA can catch a leftover
  artifact or a bad UI/code decision before it reaches production.
- **`main`** — the final trunk. Only code that's been fully tested (both
  automated tests and QA) lands here. Every merge into `main` is normally a
  new, versioned release, ready for automatic production deploy.

`staging` is optional per project — **check whether it exists
(`git branch -a` / `git ls-remote --heads`) before assuming a repo uses the
full `dev -> staging -> main` flow.** If there's no `staging` branch, the
flow is `dev -> main`.

## The flow

```
<feature/bugfix/refactor/etc branch> -> dev -> staging -> main
```

This flow must never be broken — the only allowed exception is a `hotfix`
branch (see the `hotfix` type in [branches.md](./branches.md)).

Every set of commits that represents one feature, bugfix, refactor, etc gets
its own branch (named per [branches.md](./branches.md)) and a pull request
targeting `dev`. Don't target `staging` or `main` directly with that kind of
work — they're only ever reached by a PR/merge that already went through
`dev` (and `staging`, when it exists).

## Rules

- **Never push directly to `main`, `staging`, or `dev`.** Every change to a
  trunk branch happens through a pull request, never a direct push. This
  repo can't use GitHub's branch protection rules to enforce that
  server-side (it requires GitHub Pro on a private repo), so
  `.githooks/pre-push` enforces it locally instead — run
  `git config core.hooksPath .githooks` once per clone (the devcontainer
  does this automatically via `postCreateCommand`). It's not a substitute
  for actually following this rule: `git push --no-verify` bypasses it like
  any other git hook.
- Pull requests can be rejected by automated checks or human reviewers —
  don't treat a PR as a formality; make sure it can plausibly pass review
  (tests, lint, nothing suspicious) before opening it.
- A feature/bugfix/refactor branch is created off `dev` and its PR targets
  `dev`. Promotion from `dev` to `staging` to `main` is a separate step in
  the process, not something a feature branch's PR does directly.
- A `hotfix` branch is the only case allowed to skip part of this flow.

## Don'ts

- Don't `git push` (including `--force`) to `main`, `staging`, or `dev`
  directly under any circumstance — always go through a PR.
- Don't open a PR from a feature/bugfix/refactor branch straight to
  `staging` or `main` — target `dev`.
- Don't assume `staging` exists without checking; a repo without it uses
  `dev -> main`.
- Don't invent a hotfix flow beyond "it's the one exception allowed to
  bypass part of the normal flow" unless the user specifies one for this
  project.
