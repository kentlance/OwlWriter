export const defaultColors = {
  light: {
    accent: "#60a5fa",
    bg: "#ffffff",
    text: "#adc9ff",
    writingAreaBg: "#f9fafb",
    writingAreaText: "#1f2937",
    markdownViewText: "#1f2937",
  },
  dark: {
    accent: "#64b5f6",
    bg: "#1c1f3b",
    text: "#e0e0e0",
    writingAreaBg: "#282b49",
    writingAreaText: "#f0f0f0",
    markdownViewText: "#e0e0e0",
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

export function applyAllColors(
  accentPicker,
  appBgPicker,
  appTextPicker,
  writingAreaBgPicker,
  writingAreaTextPicker,
  markdownViewTextPicker
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

  // App Text Color (NEW section)
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
}

export function resetAllColors() {
  localStorage.removeItem("accentColor");
  localStorage.removeItem("appBgColor");
  localStorage.removeItem("appTextColor");
  localStorage.removeItem("writingAreaBgColor");
  localStorage.removeItem("writingAreaTextColor");
  localStorage.removeItem("markdownViewTextColor");
}
