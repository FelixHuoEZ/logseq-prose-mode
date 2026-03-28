# logseq-prose-mode

Document-style writing mode for Logseq.

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

## Development

```bash
npm install
npm run build
```

Then load the plugin in Logseq from this folder.
