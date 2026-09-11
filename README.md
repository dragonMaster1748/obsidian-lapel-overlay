# Lapel Overlay

**Lapel Overlay** is a modified fork of Liam Cain's [Lapel](https://github.com/liamcain/obsidian-lapel) plugin for Obsidian.

The original Lapel plugin shows an `H1`–`H6` marker next to Markdown headings so heading levels are easy to identify while editing. This fork keeps that core idea while focusing on an **overlay-style heading indicator** that does not require a permanently dedicated gutter column.

## Original project

This project is based on:

- **Lapel** by Liam Cain: https://github.com/liamcain/obsidian-lapel
- Original license: MIT

Credit for the original Lapel implementation belongs to Liam Cain and the upstream contributors. The original MIT license is retained in this repository.

## Why this fork exists

Lapel's heading indicators normally live in the CodeMirror editor gutter. That makes heading levels very easy to recognize, but the gutter also reserves horizontal space throughout the editor—even on lines where no heading marker is displayed.

Lapel Overlay is intended to preserve the quick `H1`–`H6` visual reference while allowing the marker to appear as an overlay beside a heading rather than requiring a dedicated full-height column.

## Fork goals

- Preserve Lapel's heading-level detection and familiar `H1`–`H6` indicators.
- Add an overlay presentation that does not consume a permanent editor column.
- Keep heading indicators easy to see without modifying the Markdown file itself.
- Preserve useful Lapel behavior where practical, including changing a heading level from its marker.
- Remain compatible with Obsidian desktop and mobile, including Android.
- Avoid desktop-only Node.js or Electron dependencies for overlay functionality.

## Branches

### `main`

The customized **Lapel Overlay** version. Development specific to this fork is applied here.

### `dev`

The upstream-oriented branch. It is kept as the clean baseline for the original Lapel code so upstream changes from `liamcain/obsidian-lapel` can be brought into the fork and then incorporated into `main` deliberately.

In other words:

```text
liamcain/obsidian-lapel
        ↓
       dev
        ↓
       main  ← Lapel Overlay modifications
```

## Mobile / Android compatibility

Mobile compatibility is a design requirement for this fork. Changes should use Obsidian and CodeMirror APIs that work in Obsidian Mobile and should not introduce desktop-only Node.js or Electron APIs. Android behavior should be tested alongside desktop behavior when overlay positioning or editor interaction changes.

## Status

This fork is under development. The initial goal is to replace or supplement Lapel's space-consuming gutter presentation with a non-layout-consuming overlay while retaining the usefulness of the original heading markers.

## License

MIT. See [LICENSE](LICENSE).
