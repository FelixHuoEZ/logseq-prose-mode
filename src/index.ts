/// <reference types="@logseq/libs" />

import "@logseq/libs";

const MODE_CLASS = "compose-view-root";
const BODY_CLASS = "compose-view-active";
const STYLE_KEY = "compose-view-style";
const TOOLBAR_KEY = "compose-view-toolbar";
const COMMAND_KEY = "toggle-prose-mode";

type PluginSettings = {
  shortcut: string;
  enabledByDefault: boolean;
  applyToRightSidebar: boolean;
  hideBullets: boolean;
  showBulletsOnHover: boolean;
  flattenIndentation: boolean;
  keepTypedListBullets: boolean;
  contentLeftPadding: number;
  contentRightPadding: number;
};

const defaults: PluginSettings = {
  shortcut: "mod+alt+p",
  enabledByDefault: false,
  applyToRightSidebar: true,
  hideBullets: true,
  showBulletsOnHover: true,
  flattenIndentation: true,
  keepTypedListBullets: true,
  contentLeftPadding: 48,
  contentRightPadding: 40,
};

const settingsSchema: SettingSchemaDesc[] = [
  {
    key: "general",
    type: "heading",
    title: "General",
    default: null,
    description: "",
  },
  {
    key: "shortcut",
    type: "string",
    title: "Shortcut",
    default: defaults.shortcut,
    description: "Keyboard shortcut for toggling prose mode.",
  },
  {
    key: "enabledByDefault",
    type: "boolean",
    title: "Enabled by default",
    default: defaults.enabledByDefault,
    description: "Enable prose mode automatically when Logseq starts.",
  },
  {
    key: "applyToRightSidebar",
    type: "boolean",
    title: "Apply to right sidebar",
    default: defaults.applyToRightSidebar,
    description: "Use prose mode in the right sidebar as well as the main page.",
  },
  {
    key: "appearance",
    type: "heading",
    title: "Appearance",
    default: null,
    description: "",
  },
  {
    key: "hideBullets",
    type: "boolean",
    title: "Hide bullets",
    default: defaults.hideBullets,
    description: "Hide normal block bullets in prose mode.",
  },
  {
    key: "showBulletsOnHover",
    type: "boolean",
    title: "Show bullets on hover",
    default: defaults.showBulletsOnHover,
    description: "Reveal hidden bullets when hovering a block control area.",
  },
  {
    key: "flattenIndentation",
    type: "boolean",
    title: "Flatten indentation",
    default: defaults.flattenIndentation,
    description: "Remove most nested indentation so blocks read more like a document.",
  },
  {
    key: "keepTypedListBullets",
    type: "boolean",
    title: "Keep typed list bullets",
    default: defaults.keepTypedListBullets,
    description: "Keep visible bullets or numbers for typed list items.",
  },
  {
    key: "contentLeftPadding",
    type: "number",
    title: "Content left padding",
    default: defaults.contentLeftPadding,
    description: "Left padding in pixels for page content while prose mode is active.",
  },
  {
    key: "contentRightPadding",
    type: "number",
    title: "Content right padding",
    default: defaults.contentRightPadding,
    description: "Right padding in pixels for page content while prose mode is active.",
  },
];

function getSettings(): PluginSettings {
  return {
    ...defaults,
    ...(logseq.settings ?? {}),
  };
}

function safePx(value: number, fallback: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function getScopeTargets(): HTMLElement[] {
  const main = parent.document.getElementById("main-container");
  const app = parent.document.getElementById("app-container");
  const { applyToRightSidebar } = getSettings();

  if (applyToRightSidebar && app) {
    return [app];
  }

  if (main) {
    return [main];
  }

  return app ? [app] : [];
}

function clearModeClasses(): void {
  const main = parent.document.getElementById("main-container");
  const app = parent.document.getElementById("app-container");

  main?.classList.remove(MODE_CLASS);
  app?.classList.remove(MODE_CLASS);
  parent.document.body.classList.remove(BODY_CLASS);
}

function isEnabled(): boolean {
  return parent.document.body.classList.contains(BODY_CLASS);
}

function setEnabled(enabled: boolean): void {
  clearModeClasses();

  if (!enabled) {
    return;
  }

  for (const target of getScopeTargets()) {
    target.classList.add(MODE_CLASS);
  }

  parent.document.body.classList.add(BODY_CLASS);
}

function toggle(): void {
  setEnabled(!isEnabled());
}

function buildStyles(): string {
  const settings = getSettings();
  const leftPadding = safePx(settings.contentLeftPadding, defaults.contentLeftPadding);
  const rightPadding = safePx(settings.contentRightPadding, defaults.contentRightPadding);

  const hideBullets = settings.hideBullets
    ? `
    .${MODE_CLASS} .bullet-container:not(.typed-list) {
      opacity: 0 !important;
      transform: scale(0.6);
      transition: opacity 120ms ease, transform 120ms ease;
      pointer-events: none;
    }
    `
    : "";

  const showBulletsOnHover = settings.hideBullets && settings.showBulletsOnHover
    ? `
    .${MODE_CLASS} .block-control-wrap:hover .bullet-container:not(.typed-list) {
      opacity: 0.38 !important;
      transform: scale(0.88);
    }
    `
    : "";

  const flattenIndentation = settings.flattenIndentation
    ? `
    .${MODE_CLASS} {
      --compose-view-gutter: 18px;
      --compose-view-column: min(82ch, 100%);
    }

    .${MODE_CLASS} .page-blocks-inner {
      max-width: var(--compose-view-column);
      margin-inline: auto;
    }

    .${MODE_CLASS} .ls-block > .block-main-container {
      margin-left: 0 !important;
      padding-left: 0 !important;
    }

    .${MODE_CLASS} .ls-block > .block-main-container > .block-control-wrap {
      width: calc(var(--compose-view-gutter) + 12px) !important;
      min-width: calc(var(--compose-view-gutter) + 12px) !important;
      justify-content: center;
    }

    .${MODE_CLASS} .ls-block > .block-main-container > .block-content-wrapper,
    .${MODE_CLASS} .ls-block > .block-main-container > .editor-wrapper {
      margin-left: 0 !important;
    }

    .${MODE_CLASS} .ls-block > .block-children-container,
    .${MODE_CLASS} .block-children-container {
      margin-left: 0 !important;
      padding-left: 0 !important;
    }

    .${MODE_CLASS} .block-children {
      padding-left: 0 !important;
    }

    .${MODE_CLASS} .ls-block.is-order-list .block-children-container {
      margin-left: 0.65rem !important;
    }
    `
    : "";

  const keepTypedListBullets = settings.keepTypedListBullets
    ? `
    .${MODE_CLASS} .bullet-container.typed-list,
    .${MODE_CLASS} .ls-block.is-order-list > .block-main-container .bullet-container {
      opacity: 1 !important;
      transform: none !important;
      pointer-events: auto;
    }

    .${MODE_CLASS} .ls-block.is-order-list > .block-main-container > .block-control-wrap {
      width: auto !important;
      min-width: 1.4rem !important;
    }
    `
    : "";

  return `
  .cv-toggle {
    display: flex;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    border-radius: 999px;
    color: var(--ls-header-button-background);
    transition: background-color 140ms ease, transform 140ms ease;
  }

  .cv-toggle:hover {
    background: var(--ls-tertiary-background-color);
    transform: translateY(-1px);
  }

  .cv-toggle svg {
    width: 20px;
    height: 20px;
  }

  .cv-toggle [data-ink="frame"] {
    fill: currentColor;
    opacity: 0.14;
  }

  .cv-toggle [data-ink="stroke"] {
    stroke: currentColor;
  }

  .cv-toggle [data-ink="accent"] {
    fill: #D97706;
  }

  body.${BODY_CLASS} .cv-toggle {
    background: var(--ls-secondary-background-color);
    box-shadow: inset 0 0 0 1px var(--ls-border-color);
  }

  body.${BODY_CLASS} .cv-toggle [data-ink="accent"] {
    fill: var(--ls-link-ref-text-color, currentColor);
  }

  .${MODE_CLASS} .block-children-left-border,
  .${MODE_CLASS} .block-children {
    border-left-color: transparent !important;
  }

  .${MODE_CLASS} .block-children-left-border {
    display: none !important;
  }

  .${MODE_CLASS} .ls-block:hover > .block-main-container > .block-content-wrapper,
  .${MODE_CLASS} .ls-block:hover > .block-main-container > .editor-wrapper {
    background-color: var(--ls-tertiary-background-color) !important;
    border-radius: 6px;
  }

  ${hideBullets}
  ${showBulletsOnHover}
  ${flattenIndentation}
  ${keepTypedListBullets}

  .${MODE_CLASS} .embed-page {
    padding-left: 0 !important;
    border-left: none !important;
  }

  .${MODE_CLASS} .embed-page > .embed-header {
    padding-left: 0.75rem;
  }

  .${MODE_CLASS} #main-content-container {
    padding-left: ${leftPadding}px !important;
    padding-right: ${rightPadding}px !important;
  }

  .${MODE_CLASS} #main-content-container[data-is-margin-less-pages="true"] {
    padding-left: ${leftPadding}px !important;
    padding-right: ${rightPadding}px !important;
  }

  .${MODE_CLASS} .block-content,
  .${MODE_CLASS} .block-editor {
    margin-bottom: 0.4em !important;
    line-height: 1.7;
  }

  .${MODE_CLASS} div.items-center::before,
  .${MODE_CLASS} div.items-center::after,
  .${MODE_CLASS} .ls-block::before,
  .${MODE_CLASS} .ls-block::after,
  .${MODE_CLASS} .block-content-wrapper::before {
    display: none !important;
  }

  .${MODE_CLASS} .katex-editor,
  .${MODE_CLASS} .block-ref,
  .${MODE_CLASS} .embed-block {
    max-width: 100%;
  }
  `;
}

function applyStyles(): void {
  logseq.provideStyle({
    key: STYLE_KEY,
    style: buildStyles(),
  });
}

function toolbarTemplate(): string {
  return `
  <a class="cv-toggle" data-on-click="toggle" title="Toggle Prose Mode">
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect data-ink="frame" x="11" y="9" width="42" height="46" rx="12"/>
      <path data-ink="stroke" d="M22 21H41" stroke-width="3.5" stroke-linecap="round"/>
      <path data-ink="stroke" d="M22 31H38" stroke-width="3.5" stroke-linecap="round"/>
      <path data-ink="stroke" d="M22 41H36" stroke-width="3.5" stroke-linecap="round"/>
      <path data-ink="accent" d="M44 18C47.3137 18 50 20.6863 50 24V30C50 33.3137 47.3137 36 44 36H42V48H38V22H44ZM42 22V32H44C45.1046 32 46 31.1046 46 30V24C46 22.8954 45.1046 22 44 22H42Z"/>
    </svg>
  </a>
  `;
}

function registerCommands(): void {
  const settings = getSettings();

  logseq.App.registerUIItem("toolbar", {
    key: TOOLBAR_KEY,
    template: toolbarTemplate(),
  });

  logseq.App.registerCommandPalette(
    {
      key: COMMAND_KEY,
      label: "Toggle Prose Mode",
      ...(settings.shortcut
        ? {
            keybinding: {
              binding: settings.shortcut,
            },
          }
        : {}),
    },
    toggle,
  );
}

async function main(): Promise<void> {
  logseq.useSettingsSchema(settingsSchema);

  logseq.provideModel({
    toggle,
  });

  applyStyles();
  registerCommands();

  logseq.onSettingsChanged((_newSettings, oldSettings) => {
    applyStyles();

    if (
      oldSettings.applyToRightSidebar !== getSettings().applyToRightSidebar &&
      isEnabled()
    ) {
      setEnabled(true);
    }
  });

  if (getSettings().enabledByDefault) {
    setEnabled(true);
  }
}

logseq.ready(main).catch(console.error);
