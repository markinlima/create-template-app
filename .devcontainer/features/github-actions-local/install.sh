#!/usr/bin/env bash
set -euo pipefail

# ? Versions are pinned here, not as options, because each release needs its own checksums.
# ? To update: change the version and the checksums together (from the release's checksums file).
ACT_VERSION="0.2.89"
ACTIONLINT_VERSION="1.7.12"
ARCH="$(dpkg --print-architecture)"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# ? act: https://github.com/nektos/act/releases (checksums.txt of v0.2.89)
case "${ARCH}" in
  amd64)
    act_asset="act_Linux_x86_64.tar.gz"
    act_sha256="0191d6f1f3b716b5c55820032605d05fc3c1cdbf581ebeff655019e5dd1524c0"
    actionlint_sha256="8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8"
    ;;
  arm64)
    act_asset="act_Linux_arm64.tar.gz"
    act_sha256="daa8679ba9615a74d2d0cec321dc593f21948a2a11bb65862b063d8b930f4bcb"
    actionlint_sha256="325e971b6ba9bfa504672e29be93c24981eeb1c07576d730e9f7c8805afff0c6"
    ;;
  *)
    echo "Unsupported architecture: ${ARCH}" >&2
    exit 1
    ;;
esac

# ? act
curl -fsSL -o "$tmp/$act_asset" "https://github.com/nektos/act/releases/download/v${ACT_VERSION}/${act_asset}"
echo "${act_sha256}  $tmp/$act_asset" | sha256sum --check --strict
tar -xzf "$tmp/$act_asset" -C "$tmp" act
install -m 0755 "$tmp/act" /usr/local/bin/act

# ? actionlint: https://github.com/rhysd/actionlint/releases (checksums of v1.7.12)
actionlint_asset="actionlint_${ACTIONLINT_VERSION}_linux_${ARCH}.tar.gz"
curl -fsSL -o "$tmp/$actionlint_asset" "https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/${actionlint_asset}"
echo "${actionlint_sha256}  $tmp/$actionlint_asset" | sha256sum --check --strict
tar -xzf "$tmp/$actionlint_asset" -C "$tmp" actionlint
install -m 0755 "$tmp/actionlint" /usr/local/bin/actionlint

# ? ShellCheck: actionlint uses it to check the run: scripts. APT verifies the package signatures.
apt-get update -y
apt-get install -y --no-install-recommends shellcheck
