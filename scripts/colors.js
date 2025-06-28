export const defaultColors = {
  light: {
    accent: "#60a5fa",
    bg: "#ffffff",
    text: "#395a9d",
    writingAreaBg: "#f9fafb",
    writingAreaText: "#1f2937",
    markdownViewText: "#1f2937",
    controlBarButtonBg: "#e0e0e0",
    controlBarButtonIcon: "#395a9d",
  },
  dark: {
    accent: "#3174aa",
    bg: "#1c1f3b",
    text: "#a0bffd",
    writingAreaBg: "#282b49",
    writingAreaText: "#f0f0f0",
    markdownViewText: "#e0e0e0",
    controlBarButtonBg: "#4a4a4a",
    controlBarButtonIcon: "#f0f0f0",
  },
};

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyCssVar(varName, value) {
  document.documentElement.style.setProperty(varName, value);
}

export function applyAccentColor(color) {
  applyCssVar("--accent-color", color);
  localStorage.setItem("accentColor", color);
}

export function applyAppBgColor(color) {
  applyCssVar("--app-bg-color", color);
  localStorage.setItem("appBgColor", color);
}

export function applyAppTextColor(color) {
  applyCssVar("--app-text-color", color);
  localStorage.setItem("appTextColor", color);
}

export function applyWritingAreaBgColor(color) {
  applyCssVar("--writing-area-bg-color", color);
  localStorage.setItem("writingAreaBgColor", color);
}

export function applyWritingAreaTextColor(color) {
  applyCssVar("--writing-area-text-color", color);
  localStorage.setItem("writingAreaTextColor", color);
}

export function applyMarkdownViewTextColor(color) {
  applyCssVar("--markdown-view-text-color", color);
  localStorage.setItem("markdownViewTextColor", color);
}

export function applyControlBarButtonBgColor(color) {
  applyCssVar("--control-bar-button-bg-color", color);
  localStorage.setItem("controlBarButtonBgColor", color);
}

export function applyControlBarButtonIconColor(color) {
  applyCssVar("--control-bar-button-icon-color", color);
  localStorage.setItem("controlBarButtonIconColor", color);
}

export function applyAllColors(
  accentPicker,
  appBgPicker,
  appTextPicker,
  writingAreaBgPicker,
  writingAreaTextPicker,
  markdownViewTextPicker,
  controlBarButtonBgPicker,
  controlBarButtonIconPicker
) {
  const currentTheme = getSystemTheme();
  const themeDefaults = defaultColors[currentTheme];

  // Accent Color
  let accentColor = localStorage.getItem("accentColor") || themeDefaults.accent;
  applyCssVar("--accent-color", accentColor);
  if (accentPicker) accentPicker.value = accentColor;

  // App Background Color
  let appBgColor = localStorage.getItem("appBgColor") || themeDefaults.bg;
  applyCssVar("--app-bg-color", appBgColor);
  if (appBgPicker) appBgPicker.value = appBgColor;

  // App Text Color
  let appTextColor = localStorage.getItem("appTextColor") || themeDefaults.text;
  applyCssVar("--app-text-color", appTextColor);
  if (appTextPicker) appTextPicker.value = appTextColor;

  // Writing Area Background Color
  let writingAreaBgColor =
    localStorage.getItem("writingAreaBgColor") || themeDefaults.writingAreaBg;
  applyCssVar("--writing-area-bg-color", writingAreaBgColor);
  if (writingAreaBgPicker) writingAreaBgPicker.value = writingAreaBgColor;

  // Writing Area Text Color
  let writingAreaTextColor =
    localStorage.getItem("writingAreaTextColor") ||
    themeDefaults.writingAreaText;
  applyCssVar("--writing-area-text-color", writingAreaTextColor);
  if (writingAreaTextPicker) writingAreaTextPicker.value = writingAreaTextColor;

  // Markdown View Text Color
  let markdownViewTextColor =
    localStorage.getItem("markdownViewTextColor") ||
    themeDefaults.markdownViewText;
  applyCssVar("--markdown-view-text-color", markdownViewTextColor);
  if (markdownViewTextPicker)
    markdownViewTextPicker.value = markdownViewTextColor;

  // Control Bar Buttons
  let controlBarButtonBgColor =
    localStorage.getItem("controlBarButtonBgColor") ||
    themeDefaults.controlBarButtonBg;
  applyCssVar("--control-bar-button-bg-color", controlBarButtonBgColor);
  if (controlBarButtonBgPicker)
    controlBarButtonBgPicker.value = controlBarButtonBgColor;

  // Control Bar Button Icon Color
  let controlBarButtonIconColor =
    localStorage.getItem("controlBarButtonIconColor") ||
    themeDefaults.controlBarButtonIcon;
  applyCssVar("--control-bar-button-icon-color", controlBarButtonIconColor);
  if (controlBarButtonIconPicker)
    controlBarButtonIconPicker.value = controlBarButtonIconColor;
}

export function resetAllColors() {
  localStorage.removeItem("accentColor");
  localStorage.removeItem("appBgColor");
  localStorage.removeItem("appTextColor");
  localStorage.removeItem("writingAreaBgColor");
  localStorage.removeItem("writingAreaTextColor");
  localStorage.removeItem("markdownViewTextColor");
  localStorage.removeItem("controlBarButtonBgColor");
  localStorage.removeItem("controlBarButtonIconColor");
}
