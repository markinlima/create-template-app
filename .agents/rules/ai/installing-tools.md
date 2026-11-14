# Installing tools

Whether you may install things depends on where you are running.

## Detecting the dev container

You are inside the dev container **only if the `IS_DEVCONTAINER`
environment variable exists and is `true`** (set by the dev container's
compose file). Check it explicitly (e.g. `echo "$IS_DEVCONTAINER"`). If it
is unset or has any other value — including when the container was started
before the variable was added and hasn't been rebuilt — treat the
environment as **outside** the dev container.

## Inside the dev container

Installing is allowed **without asking for explicit permission** whenever
the task needs it: system packages and CLIs (e.g. Chromium to test the web
app, ffmpeg), project dependencies (`bun install`), generators' own
dependencies, browsers for E2E, etc. Install only what the task requires.

Installing a tool is not a license to make design decisions: choosing a new
library to add to a project's `package.json` is still a feature/technical
decision that follows the repo's conventions (see [plan-before-implementing](./plan-before-implementing.md)).

## Outside the dev container

Do not install anything. First look for an alternative that is already
available (a tool already on the machine, another way to do the check). If
there is none, **stop and tell the user what is missing and why**, and let
them decide how to proceed.
