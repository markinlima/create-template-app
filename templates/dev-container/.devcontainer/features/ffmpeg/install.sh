#!/usr/bin/env bash
set -euo pipefail

apt-get update -y
apt-get install -y --no-install-recommends ffmpeg
