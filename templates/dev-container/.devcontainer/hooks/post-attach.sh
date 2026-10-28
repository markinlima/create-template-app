#!/usr/bin/env bash
set -euo pipefail

# ? Keep oh-my-zsh (synced from the host's ~/.zshrc) up to date, so plugins defined in .zshrc are refreshed every time the user attaches
"${ZSH:-$HOME/.oh-my-zsh}/tools/upgrade.sh"
