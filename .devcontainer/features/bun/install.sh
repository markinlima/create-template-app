#!/usr/bin/env bash
set -euo pipefail

TARGET_USER="${USERNAME}"
TARGET_HOME="$(getent passwd "${TARGET_USER}" | cut -d: -f6)"

su -l "${TARGET_USER}" -c "curl -fsSL https://bun.com/install | bash -s 'bun-v${VERSION}'"

ln -sf "${TARGET_HOME}/.bun/bin/bun" /usr/local/bin/bun
ln -sf "${TARGET_HOME}/.bun/bin/bunx" /usr/local/bin/bunx
