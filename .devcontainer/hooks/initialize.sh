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

# ? Local override for this machine only, not versioned. Compose needs the file to exist, so create a default one.
if [ ! -f .devcontainer/docker-compose.local.yml ]; then
  printf '# ? Local override for this machine only (not versioned): changes how the devcontainer behaves here.\n# ? Main use: publish ports to the host. Zed does not forward ports like VS Code, so add them here, bound to 127.0.0.1.\nservices:\n  app: {}\n' > .devcontainer/docker-compose.local.yml
fi
