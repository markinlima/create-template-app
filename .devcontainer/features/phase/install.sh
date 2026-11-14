#!/usr/bin/env bash
set -euo pipefail

curl -fsSL https://pkg.phase.dev/install.sh | sh -s -- --version "${VERSION}"
