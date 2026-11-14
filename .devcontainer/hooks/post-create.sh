#!/usr/bin/env bash
set -euo pipefail



# ? Enables .githooks/pre-push, which blocks direct pushes to main/staging/dev
git config core.hooksPath .githooks

# ? Install project dependencies
bun i
# bun add --global eas-cli # ? mobile only
