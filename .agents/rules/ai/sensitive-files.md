# Sensitive files and values

How to behave around secrets: environment files, tokens, passwords, API keys,
private keys and any value that gives access to something.

## Never, without the user's explicit permission, every time

Each of these needs the user to say yes **for that specific action**. A yes
earlier in the session, or for another file or token, does not carry over; ask
again each time.

- **Read or open an environment file**: `.env`, `.env.local`,
  `.env.production`, any `.env.*` that is not a template. This includes `cat`,
  `grep`, `head`, the Read tool, editors and any script that prints it.
- **Search for or read a token or credential**, in code, config, the
  environment or the machine: `grep -r token`, `env` / `printenv`,
  `gh auth token`, `~/.npmrc`, `~/.ssh`, `~/.aws`, `~/.config/gh`,
  `.git-credentials`, keychains, CI secrets, a `docker inspect` that shows
  envs. This holds for any tool that needs one (the Git/GitHub API, a registry,
  Phase, Sentry, a database, a cloud provider).
- **Print, copy or send a secret value** anywhere: replies, logs, commit
  messages, PR descriptions, docs, memory files, external tools (Plane, Notion,
  Slack) and web searches or fetches.

## When the code needs a secret

- Reference it by its **variable name** (`process.env.GITHUB_TOKEN`, validated
  by the env schema), never by value. Never hardcode one, not even a fake that
  looks real; use an obviously fake placeholder marked `FIXME`.
- Add the name, with an empty or fake value, to `.env.example`, and document
  what it is for. Safe to read: `.env.example`, `.env.test` (made for tests,
  committed on purpose).
- If a run needs the real value, **ask the user to set it** in their own
  environment and run the command that needs it. Do not look it up yourself.
- Prefer a flow where the secret is never visible to you: the process reads it
  from the environment on its own.

## Keep sensitive files out of git

Before creating, adding or staging any file that holds or may hold sensitive
content (`.env*` other than the templates, keys `*.pem` / `*.key`,
`credentials*.json`, service-account files, local settings with tokens):

1. Run `git check-ignore -v <path>`. If it is **not** ignored, add a pattern to
   the right `.gitignore` **before** creating or staging the file, and tell the
   user.
2. Stage files by path, never `git add -A` or `git add .`, and check
   `git status` so no sensitive file is in the set (see [commits](../git/commits.md)).
3. If a sensitive file is **already tracked**, stop and tell the user. Removing
   it from history and rotating the secret is their decision.

Templates such as `.env.example` and `.env.test` are meant to be committed:
make sure they hold no real value.

## If a secret shows up anyway

If a secret appears in output you did not ask for (a log, a diff, a file you
had to open): do not repeat or copy it, tell the user where it appeared, and say
that it should be rotated if it left their machine (a commit, a PR, an external
tool).
