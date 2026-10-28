# Git commit messages

Every git commit in this repo follows [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).
The commit message is **always written in English**, regardless of the
language the conversation is in.

This file only defines what a commit message must look like. How and when
commits actually get made — staging strategy, splitting unrelated changes
apart, running the commit, reporting back — is a workflow concern, covered
by the `commit` skill instead.

## Type and scope

Conventional Commits type (required, one of):

| type       | when to use                                                        |
|------------|---------------------------------------------------------------------|
| `feat`     | a new feature for the user/consumer of the code                    |
| `fix`      | a bug fix                                                           |
| `docs`     | documentation only                                                  |
| `style`    | formatting, whitespace, semicolons — no code behavior change        |
| `refactor` | code change that neither fixes a bug nor adds a feature             |
| `perf`     | a code change that improves performance                             |
| `test`     | adding or correcting tests                                          |
| `build`    | build system or external dependencies (npm, terraform providers…)   |
| `ci`       | CI configuration/scripts                                            |
| `chore`    | maintenance work that doesn't fit any type above                    |
| `revert`   | reverts a previous commit                                           |

Scope (optional): a short noun in parentheses naming the affected area,
e.g. `feat(auth)`, `fix(dokploy)`, `chore(docker)`. Infer it from the
directory/module touched. Omit it if the change is broad or cross-cutting.

Breaking change: append `!` right after the type/scope (e.g. `feat(api)!:`)
**and** add a `BREAKING CHANGE:` footer explaining what breaks, whenever the
change breaks backward compatibility.

## Message structure

Structure, always in English:

```
<type>[optional scope][!]: <short imperative title>

<1-3 sentence description of why this change was made>

- <short, direct bullet for change 1>
- <short, direct bullet for change 2>
- <short, direct bullet for change N>

[optional footer(s)]
```

Rules for each part:

- **Title**: imperative mood ("add", not "added"/"adds"), lowercase after
  the colon, no trailing period, ideally under ~70 characters. This line
  alone must stand as a valid Conventional Commits summary.
- **Description**: a short paragraph explaining the *why*/context — not a
  restatement of the title. Skip it only for truly trivial one-line changes.
- **Change list**: one bullet per distinct change, each short and direct
  (start with a verb: "add", "remove", "rename", "fix"...). This is what
  makes the commit skimmable — don't write full sentences with sub-clauses.
- **Footer(s)** (optional): `BREAKING CHANGE: <description>`,
  `Refs: <issue/ticket>`, `Closes: #123`, etc. Only include what applies —
  don't invent footers or issue references that weren't established in the
  conversation or code.
- Append any attribution footer required by the current session's
  conventions (e.g. a `Co-Authored-By:` line), if instructed elsewhere in
  your context.

## Example

```
feat(phase): add generate_secret module for dynamic credentials

Introduces a reusable Terraform module so downstream stacks can request
random secrets from Phase instead of hardcoding them.

- add main.tf with the phase_secret resource
- add variables.tf for the per-key generate/hex/length options
- register the module in the root providers configuration
```

## Don'ts

- Don't write the title/body/footers in Portuguese or any language other
  than English, even if the conversation is in Portuguese.
- Don't invent a `BREAKING CHANGE:` footer or issue references that weren't
  established in the conversation or code.
