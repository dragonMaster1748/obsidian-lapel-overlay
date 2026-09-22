# Commit Message Rules

This repo follows [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must match:

```
<type>(<scope>): <subject>
```

The scope is optional; the colon and space after the type (or scope) are required.

## Allowed types

This repo follows the [Angular commit type convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#type) that the Conventional Commits spec recommends. Use one of:

| Type       | Use for                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------- |
| `feat`     | A new user-visible feature or setting                                                    |
| `fix`      | A bug fix                                                                                |
| `perf`     | A change that improves performance without changing behavior                             |
| `refactor` | A code change that neither fixes a bug nor adds a feature                                |
| `style`    | Formatting / whitespace changes that do not affect meaning (Prettier, ESLint --fix)      |
| `test`     | Adding or correcting tests                                                               |
| `docs`     | Documentation only (`README.md`, `AGENTS.md`, `BUILD.md`, `CONTRIBUTING.md`, code docs)  |
| `build`    | Build system, bundler config, package manager, lockfile, dependencies (`esbuild.config.mjs`, `package.json` scripts/deps, `pnpm-lock.yaml`, `versions.json`) |
| `ci`       | GitHub Actions workflows under `.github/workflows/`                                      |
| `chore`    | Maintenance work that does not fit the categories above (e.g. release version bumps)     |

If a change touches multiple types, pick the one that best describes the *primary* purpose of the commit. If two types feel equally important, that is usually a sign the change should be split into two commits.

## Allowed scopes

Scopes are optional. The most common one in this repo's history is `release`, used for version-bump commits:

- `chore(release): 0.1.6` — version bump in `manifest.json` / `package.json` (and `versions.json` if `minAppVersion` changed)

Otherwise, prefer no scope unless adding one genuinely clarifies the change. Do not invent new scopes ad-hoc.

## Subject rules

- Use the imperative mood ("Add menu", not "Added menu" or "Adds menu").
- Capitalize the first word of the subject. (Existing history is mixed; prefer capitalized going forward to match the more recent commits.)
- No trailing period.
- Keep the subject under ~72 characters. If you need more detail, use the body.
- Reference PRs in the subject only when the change is "this PR's followup" (e.g. `fix: readd missing return statement after PR #29`). Otherwise let GitHub link the PR.

## Body (optional)

Use a body when the *what* in the subject does not explain the *why*, or when the change has multiple notable points.

- Separate the body from the subject with a blank line.
- Wrap at ~72 characters.
- Bullet lists are fine; the existing history uses `*` bullets (see `fix: Improve heading menu click behavior`).

## Release commits

Cut releases with a dedicated commit:

```
chore(release): 0.1.6
```

The version number must match the new `version` in `manifest.json` and `package.json`. Do not combine a release bump with feature or fix changes — release commits should touch only version metadata (and `versions.json` when the minimum Obsidian version changes).

## Examples

Good:

- `feat: Add setting to display before or after line numbers`
- `fix: Hide gutter inside table cell editor`
- `perf: update and redraw the markers if necessary`
- `build: Switch from npm to pnpm`
- `ci: Cache pnpm store between runs`
- `docs: Document the release process`
- `chore(release): 0.1.5`

Avoid:

- `tmp`, `Qf`, `Cleanup` — not descriptive (these exist in sibling repos but should not be repeated here)
- `Update README` — be specific: `docs: Document gutter position setting`
- Mixing a release bump with a code change in one commit

## Scope and token discipline

- Make the smallest change that fulfills the user's request. Read only relevant files and existing project guidance.
- Keep GitHub as the source of truth. Commit requested project changes to the relevant repository and branch; do not substitute ZIPs, parallel copies, or uncommitted local work for repository changes.
- Preserve existing behavior and release conventions unless the request requires changes. Follow the commit and release rules above.
- Avoid unrelated refactors, cleanup, dependency changes, scaffolding, and extra documentation. Mention worthwhile unrelated ideas briefly without implementing them.
- Avoid repeated investigation and checks that establish the same fact. Stop when the requested work is complete.

## Focused validation

- Validate only what is useful for the requested change, using existing targeted checks and workflows where applicable.
- Add or update tests when behavior needs regression coverage, an existing test must change, or the user requests tests.
- Avoid installing large toolchains, creating alternate environments, or reproducing CI locally solely for routine confirmation.
- For documentation-only changes, inspect the final text; do not trigger an application build solely to validate documentation.
- Report what was checked and any relevant check that could not run. Do not claim a build passed unless it did.

## Completion

Inspect relevant files, make the requested change, run the minimum useful check, report the result, and stop.

## MCP request metadata failures

If a tool returns `Invalid MCP request metadata`:

- Do not assume that GitHub, the repository, or another external service denied access. Treat the error first as a possible conversation/session-level MCP integration failure.
- Make at most one small, read-only retry when it can distinguish a transient failure from a session-wide MCP failure. If the same error occurs again, stop tool use immediately.
- Do not install or reconnect plugins, switch to browser automation, reconstruct repository files manually, or attempt multiple alternative access paths as workarounds.
- Do not consume the rest of the session investigating or retrying this error. Report the blocker and preserve the user's remaining token allowance.
- Do not resume MCP work in the affected conversation unless the user explicitly requests another attempt. Recommend using a new conversation or waiting for a publicly documented fix.
- Handle explicit authentication, permission, rate-limit, context-limit, and quota errors according to their actual messages; do not classify those distinct errors as MCP metadata failures.
