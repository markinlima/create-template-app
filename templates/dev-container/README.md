# Dev container template

Copy `.devcontainer/` and `.githooks/` to the **root of the target project** (they are dot-folders, so copy them explicitly).

## What it does

- Compose service `app` built from `.devcontainer/dockerfile` (Debian trixie devcontainer base), with the project mounted at `/home/vscode/app`.
- Host config synced into the container: `~/.claude` (Claude Code), `~/.zshrc`, `~/.oh-my-zsh/custom` and `~/.zsh_history`. If the host has no `~/.zshrc`, `initialize.sh` writes a default oh-my-zsh one.
- Docker socket and USB bus mounted (docker-outside-of-docker, adb).
- Features: common-utils (zsh), docker-outside-of-docker, node 24, bun, trivy, phase and Claude Code. The local ones are in `.devcontainer/features/`.
- Hooks (`.devcontainer/hooks/`): `initialize.sh` (host, before build: creates the `development-net` docker network and the files to mount), `post-create.sh` (sets `core.hooksPath` to `.githooks`, runs `bun i`), `post-attach.sh` (upgrades oh-my-zsh).
- `.githooks/pre-push` blocks direct pushes to `main`, `staging` and `dev`.

## After copying

- Rename the service/workspace (`app`, `/home/vscode/app`) if you want, in `devcontainer.json` and `docker-compose.yml`.
- Set `PHASE_HOST` in `docker-compose.yml` (search for `FIXME`), or remove the `phase` feature if the project doesn't use it.
- Mobile projects: uncomment `java`, `install-android-sdk` (and `eas-cli` in `post-create.sh`). `ffmpeg` is also commented out.
- Bump `containerVersion` in `devcontainer.json` every time the `dockerfile` or `docker-compose.yml` changes, so VS Code asks to rebuild.
- Edit the forwarded ports to the services the project has.
