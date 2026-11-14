#!/usr/bin/env bash
# Claude Code status line: folder | branch | model + effort | context usage | cache countdown.
# Every field is optional; missing data is simply omitted.
input=$(cat)
command -v jq >/dev/null 2>&1 || { printf 'statusline: jq missing'; exit 0; }

IFS='|' read -r cwd proj model effort tokens size tpath cache_exp cache_ttl < <(
  printf '%s' "$input" | jq -r '[
    (.workspace.current_dir // .cwd // ""),
    (.workspace.project_dir // ""),
    (.model.display_name // ""),
    (.effort.level // ""),
    (.context_window.total_input_tokens // "" | tostring),
    (.context_window.context_window_size // "" | tostring),
    (.transcript_path // ""),
    (.prompt_cache.expires_at // "" | tostring),
    (.prompt_cache.ttl // "")
  ] | join("|")' 2>/dev/null
)
[ -z "$cwd" ] && cwd=$PWD

# One muted color per group, groups separated by │.
B=$'\e[1m' D=$'\e[2m' Z=$'\e[0m'
G1=$'\e[38;5;179m'  # folder: tan
G2=$'\e[38;5;133m'  # branch and git mark: mauve
G3=$'\e[38;5;68m'   # model and effort: blue
G4=$'\e[38;5;71m'   # context: green
G5=$'\e[38;5;172m'  # cache: clay
R=$'\e[38;5;167m'   # expired cache: muted red
SEP=" ${D}│${Z} "

# Folder + branch
# Folder: git root name, plus the sub-path when Claude was opened below the root
root=$(git --no-optional-locks -C "$cwd" rev-parse --show-toplevel 2>/dev/null)
if [ -n "$root" ]; then
  disp=${root##*/}; rel=${cwd#"$root"}; [ -n "$rel" ] && disp+="$rel"
else
  disp=${cwd/#$HOME/\~}
  IFS=/ read -ra parts <<<"$disp"; n=${#parts[@]}
  [ "$n" -gt 2 ] && disp="${parts[n-2]}/${parts[n-1]}"
fi
out="${B}${G1}${disp}${Z}"
if st=$(git --no-optional-locks -C "$cwd" status --porcelain=v1 -b 2>/dev/null); then
  head=${st%%$'\n'*}; head=${head#\#\# }
  branch=${head%%...*}; branch=${branch%% \[*}
  branch=${branch#No commits yet on }
  [[ "$head" == "HEAD (no branch)"* ]] && branch=$(git --no-optional-locks -C "$cwd" rev-parse --short HEAD 2>/dev/null)
  mark="✔"; [[ "$st" == *$'\n'* ]] && mark="✱"
  out+="${SEP}${G2}${branch} ${mark}${Z}"
fi

# Model + effort
if [ -n "$model" ]; then
  out+="${SEP}${G3}${model}${Z}"
  [ -n "$effort" ] && out+=" ${G3}· ${effort}${Z}"
fi

# Context: tokens / limit; limit = auto-compact window, else model window
limit=${CLAUDE_CODE_AUTO_COMPACT_WINDOW:-}
if ! [[ "$limit" =~ ^[0-9]+$ ]]; then
  for f in "$proj/.claude/settings.json" "$cwd/.claude/settings.json" "$HOME/.claude/settings.json"; do
    [ -r "$f" ] || continue
    v=$(jq -r '.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW // empty' "$f" 2>/dev/null)
    [[ "$v" =~ ^[0-9]+$ ]] && { limit=$v; break; }
  done
fi
[[ "$limit" =~ ^[0-9]+$ ]] || limit=$size
fmt() { # 81039 -> 81k, 1000000 -> 1M
  local n=$1
  if [ "$n" -ge 1000000 ]; then
    local t=$((n / 100000)); if [ $((t % 10)) -eq 0 ]; then printf '%dM' $((t / 10)); else printf '%d.%dM' $((t / 10)) $((t % 10)); fi
  elif [ "$n" -ge 1000 ]; then printf '%dk' $((n / 1000)); else printf '%d' "$n"; fi
}
if [[ "$tokens" =~ ^[0-9]+$ && "$limit" =~ ^[0-9]+$ && "$limit" -gt 0 ]]; then
  out+="${SEP}${G4}$(fmt "$tokens") / $(fmt "$limit")${Z}"
fi

# Prompt cache countdown: expires_at from the input, else last assistant message + 1h
printf -v now '%(%s)T' -1
exp=""
if [[ "$cache_exp" =~ ^[0-9]+$ ]]; then
  exp=$cache_exp
elif [ -n "$tpath" ] && [ -r "$tpath" ]; then
  ts=$(tail -n 60 "$tpath" 2>/dev/null | jq -Rr 'fromjson? | select(.type=="assistant") | .timestamp // empty' 2>/dev/null | tail -n 1)
  if [ -n "$ts" ]; then
    epoch=$(jq -nr --arg t "$ts" '$t | sub("\\.[0-9]+";"") | fromdateiso8601' 2>/dev/null)
    [[ "$epoch" =~ ^[0-9]+$ ]] && exp=$((epoch + 3600))
  fi
fi
if [ -n "$exp" ]; then
  left=$((exp - now))
  if [ "$left" -gt 0 ]; then
    if [ "$left" -ge 600 ]; then t="$((left / 60))m"; else printf -v t '%d:%02d' $((left / 60)) $((left % 60)); fi
    out+="${SEP}${G5}cache ${t}${Z}${cache_ttl:+ ${G5}(${cache_ttl})${Z}}"
  else
    out+="${SEP}${R}cache expired${Z}"
  fi
fi

printf '%s' "$out"
