#!/usr/bin/env bash
set -euo pipefail

# ? network the compose service expects to already exist.
docker network create development-net || echo "Network 'development-net' already exists, skipping creation."

# ? Inject the default oh-my-zsh config if the host has none yet
if [ ! -f ~/.zshrc ]; then
  cat > ~/.zshrc <<'EOF'
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="jnrowe"
plugins=(git vscode zsh-autosuggestions zsh-syntax-highlighting zsh-navigation-tools bun branch)
source $ZSH/oh-my-zsh.sh
zstyle ':omz:update' mode auto
ENABLE_CORRECTION="false"
EOF
fi

touch ~/.zsh_history
mkdir -p ~/.oh-my-zsh/custom
mkdir -p ~/.claude
