---

name: statusline
description: Install or update the team's Claude Code status line (git-root folder and branch, model and effort, context usage against the auto-compact limit, prompt-cache countdown). Use when asked to set up, restore, or tweak the status line.
---

# Status line

The script lives in `.agents/scripts/statusline.sh` (mirrored at
`.claude/scripts/statusline.sh`). It is a user-level setting, so it is installed
in the user's `~/.claude/`, never in the repo's `.agents/settings.json`.

## What it shows

`<git-root>[/<subpath>]  <branch> ✱|✔ │ <model> · <effort> │ [ NN% ] <tokens> / <limit> │ cache <time> (<ttl>)`

- **Folder:** the git root name; the sub-path only when Claude was opened below
  the root. Outside git, the last two path components.
- **Branch:** `✱` yellow when there are changes, `✔` green when clean.
- **Effort:** from `effort.level`; omitted if the model has none.
- **Context:** `<tokens> / <limit>` in dim gray (input tokens). Limit = `CLAUDE_CODE_AUTO_COMPACT_WINDOW`
  (env, then project `.claude/settings.json`, then `~/.claude/settings.json`),
  else the model's window.
- **Cache:** countdown from `prompt_cache.expires_at` (`m` above 10 min, `m:ss`
  below; yellow ≤10 min, red ≤2 min) and the `ttl` in dim. Falls back to the
  transcript's last assistant message + 1h.
- Plain text only: emojis and icons are avoided because some terminals (Zed)
  don't render them. Not possible: the permission mode (not in the JSON), font
  size, hiding the built-in mode line.

## Install

1. Requires `jq`. Check `command -v jq`; if missing, tell the user.
2. Ask before touching user settings. Then:

   ```sh
   mkdir -p ~/.claude
   cp .agents/scripts/statusline.sh ~/.claude/statusline-command.sh
   jq '.statusLine = {type: "command", command: "bash ~/.claude/statusline-command.sh", refreshInterval: 5}' \
     ~/.claude/settings.json > /tmp/settings.json && mv /tmp/settings.json ~/.claude/settings.json
   ```

   (create `{}` first if `settings.json` doesn't exist). `refreshInterval: 5`
   keeps the cache countdown live; each refresh runs `git status`, so raise it
   in huge repos.
3. Test: `echo '{}' | bash ~/.claude/statusline-command.sh`.

## Changing it

Edit `.agents/scripts/statusline.sh` first (it is the source of truth), update
the description above, then re-copy to `~/.claude/statusline-command.sh`.
