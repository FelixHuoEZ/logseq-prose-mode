# logseq-prose-mode

Focused document-style writing mode for Logseq.

## Author

- FelixHuoEZ
- Codex

## Preview

![Prose Mode preview](./assets/prose-mode-preview.svg)

Concept illustration of the writing-focused layout with bullets and indentation visually reduced.

## Features

- Toggle prose mode from the toolbar or command palette
- Hide normal block bullets while keeping them available on hover
- Flatten nested indentation to reduce the outliner feel
- Remove thread lines and tighten page layout for writing
- Optional support for applying the mode to the right sidebar too

## Settings

- `Shortcut`: keyboard shortcut for toggling prose mode
- `Enabled by default`: enable the mode on startup
- `Apply to right sidebar`: include right sidebar content in the styling scope
- `Hide bullets`: hide normal bullets in prose mode
- `Show bullets on hover`: temporarily reveal hidden bullets on hover
- `Flatten indentation`: remove most nested indentation
- `Keep typed list bullets`: keep visible bullets/numbers for typed lists
- `Content left padding`: page padding in prose mode
- `Content right padding`: page padding in prose mode

## Install

### From Marketplace

Search for `Prose Mode` in the Logseq plugin marketplace after the plugin is approved.

### Manual

1. Download the latest release zip from GitHub.
2. Unzip it into a local folder.
3. In Logseq, use `Plugins` -> `Load unpacked plugin` and select that folder.

## Development

```bash
npm install
npm run build
```

Then load the plugin in Logseq from this folder.

## License

MIT. See [LICENSE](./LICENSE).
