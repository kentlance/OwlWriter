export const defaultColors = {
  light: {
    accent: "#2196f3",
    bg: "#f3f4f6",
    writingAreaBg: "#ffffff",
    writingAreaText: "#1f2937",
    markdownViewText: "#1f2937",
  },
  dark: {
    accent: "#60a5fa",
    bg: "#1f2937",
    writingAreaBg: "#374151",
    writingAreaText: "#e5e7eb",
    markdownViewText: "#e5e7eb",
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

export function applyBgColor(color) {
  applyCssVar("--bg-color", color);
  localStorage.setItem("customBgColor", color);
}

export function applyWritingAreaBgColor(color) {
  applyCssVar("--writing-area-bg-color", color);
  localStorage.setItem("customWritingAreaBgColor", color);
}

export function applyWritingAreaTextColor(color) {
  applyCssVar("--writing-area-text-color", color);
  localStorage.setItem("customWritingAreaTextColor", color);
}

export function applyMarkdownViewTextColor(color) {
  applyCssVar("--markdown-view-text-color", color);
  localStorage.setItem("customMarkdownViewTextColor", color);
}

export function applyAllColors(
  accentPicker,
  bgPicker,
  writingAreaBgPicker,
  writingAreaTextPicker,
  markdownViewTextPicker
) {
  const currentTheme = getSystemTheme();
  const themeDefaults = defaultColors[currentTheme];

  let accentColor = localStorage.getItem("accentColor") || themeDefaults.accent;
  applyCssVar("--accent-color", accentColor);
  if (accentPicker) accentPicker.value = accentColor;

  let bgColor = localStorage.getItem("customBgColor") || themeDefaults.bg;
  applyCssVar("--bg-color", bgColor);
  if (bgPicker) bgPicker.value = bgColor;

  let writingAreaBgColor =
    localStorage.getItem("customWritingAreaBgColor") ||
    themeDefaults.writingAreaBg;
  applyCssVar("--writing-area-bg-color", writingAreaBgColor);
  if (writingAreaBgPicker) writingAreaBgPicker.value = writingAreaBgColor;

  let writingAreaTextColor =
    localStorage.getItem("customWritingAreaTextColor") ||
    themeDefaults.writingAreaText;
  applyCssVar("--writing-area-text-color", writingAreaTextColor);
  if (writingAreaTextPicker) writingAreaTextPicker.value = writingAreaTextColor;

  let markdownViewTextColor =
    localStorage.getItem("customMarkdownViewTextColor") ||
    themeDefaults.markdownViewText;
  applyCssVar("--markdown-view-text-color", markdownViewTextColor);
  if (markdownViewTextPicker)
    markdownViewTextPicker.value = markdownViewTextColor;
}

export function resetAllColors() {
  localStorage.removeItem("accentColor");
  localStorage.removeItem("customBgColor");
  localStorage.removeItem("customWritingAreaBgColor");
  localStorage.removeItem("customWritingAreaTextColor");
  localStorage.removeItem("customMarkdownViewTextColor");
}
