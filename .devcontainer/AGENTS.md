# AGENTS.md

Guide to the dev container setup in this folder. Read it before changing anything in `.devcontainer/`.

## What it is

The Dev Container used to develop this project: a Docker image, a Docker Compose service, lifecycle hooks, and optional Dev Container features. Any Dev Containers-compatible IDE (VS Code, JetBrains, etc.) can open it.

## Files

```
.devcontainer/
├── devcontainer.json        # entry point: wires everything, port names, features, IDE extensions
├── docker-compose.yml       # service definition: build, env, volumes, network
├── dockerfile               # base image and image-level setup
├── hooks/                   # lifecycle scripts (host and container)
│   ├── initialize.sh        # runs on the HOST, before the container is built
│   ├── post-create.sh       # runs INSIDE the container, once after creation
│   └── post-attach.sh       # runs INSIDE the container, on every attach
└── features/                # local Dev Container features (own installer)
    └── <name>/
        ├── devcontainer-feature.json
        └── install.sh
```

## Where each thing goes

### `features/`: large tools with their own installer

Use a feature for applications or extensive configuration that has its own installer and configuration: Bun, Phase CLI, Trivy, the Android SDK, ffmpeg.

- Each feature is a folder with `devcontainer-feature.json` (id, version, options) and `install.sh`.
- Options are passed from `devcontainer.json` and exposed to `install.sh` as environment variables (e.g. `VERSION`, `USERNAME`).
- Pin versions in the feature's default and in `devcontainer.json`. Keep the version in sync with CI when a feature mirrors it (e.g. Phase CLI).
- Prefer a feature over a `dockerfile` `RUN` block whenever the install has options or its own logic.
- Group tools that share one purpose into one feature. `github-actions-local` installs `act`, `actionlint` and ShellCheck, which lint and run the GitHub Actions workflows locally. Its versions are pinned in `install.sh`, not as options, because each release needs its own checksums.
- A feature can depend on another one with `dependsOn` in `devcontainer-feature.json`. `install-android-sdk` uses it to install Java 17 automatically. The version in `dependsOn` is a fixed value: it cannot read an option of the feature. Declaring a different Java version in `devcontainer.json` to override it is not tested yet.

### `dockerfile`: image-level setup only

Keep in the `dockerfile` only:

- the base image and its tag;
- image-level configuration (users and groups, `USER`, `WORKDIR`, `EXPOSE`, `CMD`);
- small, simple installs that do not need options or their own configuration.

Anything bigger belongs in a feature.

### `hooks/`: environment preparation, on the host and in the container

Hooks handle general configuration, both outside the container (host) and inside it:

| Hook             | Runs where | When                                     | Typical use                                                                                            |
| ---------------- | ---------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `initialize.sh`  | host       | before the container is built or started | create the Docker network, seed host files (`~/.zshrc`, history), create host folders that get mounted |
| `post-create.sh` | container  | once, after the container is created     | set git hooks path, install project dependencies (`bun i`)                                             |
| `post-attach.sh` | container  | every time an IDE attaches               | refresh tooling that should stay current (oh-my-zsh upgrade)                                           |

Hooks must be idempotent: they can run many times on the same machine.

### `docker-compose.yml`: envs, volumes and network only

The compose file defines only:

- `environment` (env vars for the service);
- `volumes` (mounts from the host and between containers);
- `networks` (the external network shared with other projects).

Two service settings are exceptions and stay here on purpose:

- **`build`** (pointing to `dockerfile`): the compose service builds the image from this folder, so the build reference belongs with the service.
- **`privileged: true`**: gives the container access to host system resources, such as USB devices (`/dev/bus/usb`) for `adb`, and it is needed by the Android SDK tooling.

Do not add other service settings here without a reason.

### `docker-compose.local.yml`: local override per developer

`devcontainer.json` loads it after `docker-compose.yml`. It is in `.gitignore`, and `hooks/initialize.sh` creates an empty one if missing. It changes the devcontainer's behavior on this machine only. Its main use is publishing ports to the host, bound to `127.0.0.1`, because Zed does not forward ports like VS Code.

- Default: no port is published. Containers talk to each other on the `development-net` network by service name.
- Publish only what you need now. A host port can be used by one container at a time.
- Publish a service's port in the file of the project that defines that service. A port of a service defined elsewhere cannot be published here.
- `forwardPorts` in `devcontainer.json` is for IDE labels and forwarding. Its key format is `service:port` (e.g. `backend:3333`). The `-L` style (`3333:backend:3333`) is SSH syntax and is not valid there.
- Zed publishes `forwardPorts` as Docker ports on `0.0.0.0` until [PR #63899](https://github.com/zed-industries/zed/pull/63899) is merged. Until then, publish in this file instead of relying on `forwardPorts` for host access.

**Why not in `devcontainer.json`?** The compose file is easier to read and document on its own, and it defines the services the same way outside the Dev Containers tooling. Some IDEs and tools do not fully follow the Dev Containers standard, so keeping these definitions in compose improves compatibility. `devcontainer.json` keeps the parts that only Dev Containers understands.

### `devcontainer.json`: wiring, port names, features and IDE settings

`devcontainer.json` holds:

- the link to compose (`dockerComposeFile`, `service`) and `workspaceFolder`;
- the hooks (`initializeCommand`, `postCreateCommand`, `postAttachCommand`);
- `features` (the external ones from `ghcr.io` and the local ones from `./features/`);
- `containerEnv` (e.g. `containerVersion`, see below);
- `customizations.vscode.extensions` (VS Code) and `customizations.zed.extensions` (Zed). Keep both lists in sync when adding an editor extension;
- **the port names**: `forwardPorts` and `portsAttributes` give a label and an auto-forward behavior to each port used by the apps.

Port keys follow the pattern `<compose-service>:<port>` for ports inside another service's container (e.g. `web:5173`, `postgres:5432`), or `<port>` for the app container itself (e.g. `3333`). Each port must have a `label` so it is readable in the IDE's port panel.

## Building and running

- **Always build and start the container with the devcontainer CLI** (`devcontainer up --workspace-folder .`), not with an IDE's own build button. The build must be the same in every IDE (VS Code, Zed, JetBrains, etc.).
- **If `devcontainer` is not installed, stop and ask the user to install it** (`npm install -g @devcontainers/cli`). Do not fall back to an IDE build.
- Use `--remove-existing-container` to recreate the container after changing `dockerfile`, compose files or features.

## Rules when changing this folder

- **Bump `containerVersion`** in `devcontainer.json` (`containerEnv`) every time `dockerfile`, `docker-compose.yml` or `features` change, so IDEs detect the drift and offer a rebuild.
- **Never put secrets here.** Use placeholders marked `FIXME` (e.g. `PHASE_HOST`) and let each developer provide real values from their host.
- **Keep `initialize.sh` and compose in sync**: the network name used in compose (`development-net`) must match the one created by the hook.
- **Keep hooks and features portable**: no host-specific paths, and use `set -euo pipefail` as the existing scripts do.
- **Comments in `devcontainer.json`** use `// ?` for notes. Optional blocks (e.g. mobile-only features) stay commented out with the same marker, so they can be enabled by uncommenting.
- **Scripts run in bash.** Keep the shebang `#!/usr/bin/env bash`.

## Checklist for a new feature

1. Create `features/<name>/` with `devcontainer-feature.json` and `install.sh`.
2. Declare the options in the JSON and read them in `install.sh` (`VERSION`, or the option name in uppercase).
3. Reference it in `devcontainer.json` under `features` with the pinned version.
4. If it needs a port, add it to `forwardPorts` and `portsAttributes` with a label.
5. If it needs a mount or env var, add it to `docker-compose.yml`, not to `devcontainer.json`.
6. Bump `containerVersion`.
7. Validate the JSON files and rebuild the container to test.
