#!/usr/bin/env bash
set -euo pipefail

TRIVY_VERSION="${VERSION}"

curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh |
  bash -s -- -b /usr/local/bin "v${TRIVY_VERSION}"
