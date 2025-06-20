import {
  defaultColors,
  getSystemTheme,
  applyAccentColor,
  applyAppBgColor,
  applyAppTextColor,
  applyWritingAreaBgColor,
  applyWritingAreaTextColor,
  applyMarkdownViewTextColor,
  applyAllColors,
  resetAllColors,
} from "./colors.js";

const writingArea = document.getElementById("writingArea");
const markdownOutput = document.getElementById("markdownOutput");
const statusBar = document.getElementById("statusBar");
const wordCountSpan = document.getElementById("wordCount");
const charCountSpan = document.getElementById("charCount");

const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const overlay = document.getElementById("overlay");
const closeSettingsButton = document.getElementById("closeSettingsButton");

const helpButton = document.getElementById("helpButton");
const markdownShortcutsPanel = document.getElementById(
  "markdownShortcutsPanel"
);

// Document Panel Width elements
const documentPanel = document.getElementById("documentPanel");
const documentPanelWidthSlider = document.getElementById(
  "documentPanelWidthSlider"
);
const documentPanelWidthValueSpan = document.getElementById(
  "documentPanelWidthValue"
);
const resetDocumentPanelWidthButton = document.getElementById(
  "resetDocumentPanelWidth"
);

// Writing Area Font Family elements
const writingAreaFontFamilySelect = document.getElementById(
  "writingAreaFontFamilySelect"
);
const resetWritingAreaFontFamilyButton = document.getElementById(
  "resetWritingAreaFontFamily"
);

const fontSizeSlider = document.getElementById("fontSizeSlider");
const fontSizeValueSpan = document.getElementById("fontSizeValue");
const resetFontSizeButton = document.getElementById("resetFontSize");

const writingAreaTextAlignRadios = document.querySelectorAll(
  'input[name="writingAreaTextAlign"]'
);
const resetWritingAreaTextAlignButton = document.getElementById(
  "resetWritingAreaTextAlign"
);

// Writing Area letter-spacing elements
const letterSpacingSlider = document.getElementById("letterSpacingSlider");
const letterSpacingValueSpan = document.getElementById("letterSpacingValue");
const resetLetterSpacingButton = document.getElementById("resetLetterSpacing");

// Writing Area line-height elements
const lineHeightSlider = document.getElementById("lineHeightSlider");
const lineHeightValueSpan = document.getElementById("lineHeightValue");
const resetLineHeightButton = document.getElementById("resetLineHeight");

// Writing Area word-spacing elements
const wordSpacingSlider = document.getElementById("wordSpacingSlider");
const wordSpacingValueSpan = document.getElementById("wordSpacingValue");
const resetWordSpacingButton = document.getElementById("resetWordSpacing");

const writingAreaBgColorPicker = document.getElementById(
  "writingAreaBgColorPicker"
);
const resetWritingAreaBgColorButton = document.getElementById(
  "resetWritingAreaBgColor"
);

const writingAreaTextColorPicker = document.getElementById(
  "writingAreaTextColorPicker"
);
const resetWritingAreaTextColorButton = document.getElementById(
  "resetWritingAreaTextColor"
);

const markdownViewFontSizeSlider = document.getElementById(
  "markdownViewFontSizeSlider"
);
const markdownViewFontSizeValueSpan = document.getElementById(
  "markdownViewFontSizeValue"
);
const resetMarkdownViewFontSizeButton = document.getElementById(
  "resetMarkdownViewFontSize"
);

const markdownViewTextAlignRadios = document.querySelectorAll(
  'input[name="markdownViewTextAlign"]'
);
const resetMarkdownViewTextAlignButton = document.getElementById(
  "resetMarkdownViewTextAlign"
);

const accentColorPicker = document.getElementById("accentColorPicker");
const resetAccentColorButton = document.getElementById("resetAccentColor");

const bgColorPicker = document.getElementById("bgColorPicker");
const resetBgColorButton = document.getElementById("resetBgColor");

const appTextColorPicker = document.getElementById("appTextColorPicker");
const resetAppTextColorButton = document.getElementById("resetAppTextColor");

const markdownViewTextColorPicker = document.getElementById(
  "markdownViewTextColorPicker"
);
const resetMarkdownViewTextColorButton = document.getElementById(
  "resetMarkdownViewTextColor"
);

const resetAllColorsButton = document.getElementById("resetAllColors");

const wordCountToggleCheckbox = document.getElementById(
  "wordCountToggleCheckbox"
);

const controlBar = document.getElementById("controlBar");
const hideControlBarToggle = document.getElementById("hideControlBarToggle");
const controlBarHoverTrigger = document.getElementById(
  "controlBarHoverTrigger"
);

const defaultSettings = {
  documentPanelWidth: 896,
  writingAreaFontFamily: "serif",
  fontSize: 18,
  writingAreaTextAlign: "left",
  letterSpacing: 0,
  lineHeight: 1.5,
  wordSpacing: 0,
  markdownViewFontSize: 16,
  markdownViewTextAlign: "left",
  isWordCountVisible: true,
  hideControlBarOnHover: false,
};

// State Variables
let currentDocumentPanelWidth = defaultSettings.documentPanelWidth;
let writingAreaFontFamily = defaultSettings.writingAreaFontFamily;
let currentFontSize = defaultSettings.fontSize;
let writingAreaTextAlign = defaultSettings.writingAreaTextAlign;
let currentLetterSpacing = defaultSettings.letterSpacing;
let currentLineHeight = defaultSettings.lineHeight;
let currentWordSpacing = defaultSettings.wordSpacing;
let currentMarkdownViewFontSize = defaultSettings.markdownViewFontSize;
let markdownViewTextAlign = defaultSettings.markdownViewTextAlign;
let isWordCountVisible = defaultSettings.isWordCountVisible;
let hideControlBarOnHover = defaultSettings.hideControlBarOnHover;

// Helper function to map font family keys to CSS font stacks
const fontFamilyMap = {
  "system-sans":
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  inter:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  monospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

function updateCounts() {
  const text = writingArea.value;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;

  wordCountSpan.textContent = `Words: ${words}`;
  charCountSpan.textContent = `Characters: ${chars}`;
}

function applySettings() {
  // Document Panel Width
  documentPanel.style.maxWidth = `${currentDocumentPanelWidth}px`;
  documentPanelWidthValueSpan.textContent = `${currentDocumentPanelWidth}px`;
  documentPanelWidthSlider.value = currentDocumentPanelWidth;

  // Writing Area Font Family
  document.documentElement.style.setProperty(
    "--writing-area-font-family",
    fontFamilyMap[writingAreaFontFamily]
  );
  writingAreaFontFamilySelect.value = writingAreaFontFamily;

  // Writing Area Font Size
  writingArea.style.fontSize = `${currentFontSize}px`;
  fontSizeValueSpan.textContent = `${currentFontSize}px`;
  fontSizeSlider.value = currentFontSize;

  // Writing Area Text Align
  writingArea.style.textAlign = writingAreaTextAlign;
  writingAreaTextAlignRadios.forEach((radio) => {
    radio.checked = radio.value === writingAreaTextAlign;
  });

  // Writing Area letter-spacing
  document.documentElement.style.setProperty(
    "--writing-area-letter-spacing",
    `${currentLetterSpacing}em`
  );
  letterSpacingSlider.value = currentLetterSpacing;
  letterSpacingValueSpan.textContent = `${currentLetterSpacing}em`;

  // Writing Area line-height
  document.documentElement.style.setProperty(
    "--writing-area-line-height",
    currentLineHeight
  );
  lineHeightSlider.value = currentLineHeight;
  lineHeightValueSpan.textContent = currentLineHeight;

  // Writing Area word-spacing
  document.documentElement.style.setProperty(
    "--writing-area-word-spacing",
    `${currentWordSpacing}px`
  );
  wordSpacingSlider.value = currentWordSpacing;
  wordSpacingValueSpan.textContent = `${currentWordSpacing}px`;

  // Markdown View Font Size
  markdownOutput.style.fontSize = `${currentMarkdownViewFontSize}px`;
  markdownViewFontSizeValueSpan.textContent = `${currentMarkdownViewFontSize}px`;
  markdownViewFontSizeSlider.value = currentMarkdownViewFontSize;

  // Markdown View Text Align
  markdownOutput.style.textAlign = markdownViewTextAlign;
  markdownViewTextAlignRadios.forEach((radio) => {
    radio.checked = radio.value === markdownViewTextAlign;
  });

  // Word Count Visibility
  statusBar.style.display = isWordCountVisible ? "flex" : "none";
  wordCountToggleCheckbox.checked = isWordCountVisible;

  // Apply Control Bar hover behavior
  applyControlBarHoverBehavior();

  applyAllColors(
    accentColorPicker,
    bgColorPicker,
    appTextColorPicker,
    writingAreaBgColorPicker,
    writingAreaTextColorPicker,
    markdownViewTextColorPicker
  );
}

function togglePanel(panel) {
  panel.classList.toggle("open");
  overlay.classList.toggle("hidden");

  // Ensure only one panel is open at a time
  if (panel.id === "settingsPanel") {
    markdownShortcutsPanel.classList.remove("open");
  } else if (panel.id === "markdownShortcutsPanel") {
    settingsPanel.classList.remove("open");
  }
}

// Saves all current settings to localStorage
function saveSettings() {
  localStorage.setItem("documentPanelWidth", currentDocumentPanelWidth);
  localStorage.setItem("writingAreaFontFamily", writingAreaFontFamily);
  localStorage.setItem("fontSize", currentFontSize);
  localStorage.setItem("writingAreaTextAlign", writingAreaTextAlign);
  localStorage.setItem("letterSpacing", currentLetterSpacing);
  localStorage.setItem("lineHeight", currentLineHeight);
  localStorage.setItem("wordSpacing", currentWordSpacing);
  localStorage.setItem("markdownViewFontSize", currentMarkdownViewFontSize);
  localStorage.setItem("markdownViewTextAlign", markdownViewTextAlign);
  localStorage.setItem("isWordCountVisible", isWordCountVisible);
  localStorage.setItem("hideControlBarOnHover", hideControlBarOnHover);
}

// Loads settings from localStorage or sets default values if not found
function loadSettings() {
  currentDocumentPanelWidth =
    parseInt(localStorage.getItem("documentPanelWidth")) ||
    defaultSettings.documentPanelWidth;

  writingAreaFontFamily =
    localStorage.getItem("writingAreaFontFamily") ||
    defaultSettings.writingAreaFontFamily;

  currentFontSize =
    parseInt(localStorage.getItem("fontSize")) || defaultSettings.fontSize;

  writingAreaTextAlign =
    localStorage.getItem("writingAreaTextAlign") ||
    defaultSettings.writingAreaTextAlign;

  // Load letter-spacing
  currentLetterSpacing =
    parseFloat(localStorage.getItem("letterSpacing")) ||
    defaultSettings.letterSpacing;

  // Load line-height
  currentLineHeight =
    parseFloat(localStorage.getItem("lineHeight")) ||
    defaultSettings.lineHeight;

  // Load word-spacing
  currentWordSpacing =
    parseFloat(localStorage.getItem("wordSpacing")) ||
    defaultSettings.wordSpacing;

  currentMarkdownViewFontSize =
    parseInt(localStorage.getItem("markdownViewFontSize")) ||
    defaultSettings.markdownViewFontSize;

  markdownViewTextAlign =
    localStorage.getItem("markdownViewTextAlign") ||
    defaultSettings.markdownViewTextAlign;

  const storedIsWordCountVisible = localStorage.getItem("isWordCountVisible");
  if (storedIsWordCountVisible === "true") {
    isWordCountVisible = true;
  } else if (storedIsWordCountVisible === "false") {
    isWordCountVisible = false;
  } else {
    isWordCountVisible = defaultSettings.isWordCountVisible;
  }
  const storedHideControlBarOnHover = localStorage.getItem(
    "hideControlBarOnHover"
  );
  if (storedHideControlBarOnHover === "true") {
    hideControlBarOnHover = true;
  } else if (storedHideControlBarOnHover === "false") {
    hideControlBarOnHover = false;
  } else {
    hideControlBarOnHover = defaultSettings.hideControlBarOnHover;
  }
}

// Resets all settings to default
function resetAllToDefault() {
  currentDocumentPanelWidth = defaultSettings.documentPanelWidth;
  writingAreaFontFamily = defaultSettings.writingAreaFontFamily;
  currentFontSize = defaultSettings.fontSize;
  writingAreaTextAlign = defaultSettings.writingAreaTextAlign;
  currentLetterSpacing = defaultSettings.letterSpacing;
  currentLineHeight = defaultSettings.lineHeight;
  currentWordSpacing = defaultSettings.wordSpacing;
  currentMarkdownViewFontSize = defaultSettings.markdownViewFontSize;
  markdownViewTextAlign = defaultSettings.markdownViewTextAlign;
  isWordCountVisible = defaultSettings.isWordCountVisible;
  hideControlBarOnHover = defaultSettings.hideControlBarOnHover;
  resetAllColors();
  applySettings();
  saveSettings();
}

function showControlBar() {
  if (hideControlBarOnHover) {
    controlBar.classList.add("control-bar-show");
    controlBar.classList.remove("control-bar-hidden");
  }
}

function hideControlBar() {
  if (
    hideControlBarOnHover &&
    !controlBar.matches(":hover") &&
    !controlBarHoverTrigger.matches(":hover")
  ) {
    controlBar.classList.add("control-bar-hidden");
    controlBar.classList.remove("control-bar-show");
  }
}

function applyControlBarHoverBehavior() {
  controlBarHoverTrigger.removeEventListener("mouseenter", showControlBar);
  controlBarHoverTrigger.removeEventListener("mouseleave", hideControlBar);
  controlBar.removeEventListener("mouseleave", hideControlBar);
  controlBar.removeEventListener("mouseenter", showControlBar);

  if (hideControlBarOnHover) {
    controlBar.classList.add("control-bar-hidden");
    controlBar.classList.remove("control-bar-show");

    controlBarHoverTrigger.addEventListener("mouseenter", showControlBar);
    controlBarHoverTrigger.addEventListener("mouseleave", hideControlBar);
    controlBar.addEventListener("mouseleave", hideControlBar);
    controlBar.addEventListener("mouseenter", showControlBar);
  } else {
    controlBar.classList.add("control-bar-show");
    controlBar.classList.remove("control-bar-hidden");
  }
  hideControlBarToggle.checked = hideControlBarOnHover;
}

writingArea.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("savedContent", writingArea.value);
});

settingsButton.addEventListener("click", () => togglePanel(settingsPanel));
helpButton.addEventListener("click", () => togglePanel(markdownShortcutsPanel));
overlay.addEventListener("click", () => {
  settingsPanel.classList.remove("open");
  markdownShortcutsPanel.classList.remove("open");
  overlay.classList.add("hidden");
});

closeSettingsButton.addEventListener("click", () => {
  settingsPanel.classList.remove("open");
  overlay.classList.add("hidden");
});

documentPanelWidthSlider.addEventListener("input", (e) => {
  currentDocumentPanelWidth = parseInt(e.target.value);
  applySettings();
  saveSettings();
});
resetDocumentPanelWidthButton.addEventListener("click", () => {
  currentDocumentPanelWidth = defaultSettings.documentPanelWidth;
  applySettings();
  saveSettings();
});

writingAreaFontFamilySelect.addEventListener("change", (e) => {
  writingAreaFontFamily = e.target.value;
  applySettings();
  saveSettings();
});
resetWritingAreaFontFamilyButton.addEventListener("click", () => {
  writingAreaFontFamily = defaultSettings.writingAreaFontFamily;
  applySettings();
  saveSettings();
});

fontSizeSlider.addEventListener("input", (e) => {
  currentFontSize = parseInt(e.target.value);
  applySettings();
  saveSettings();
});
resetFontSizeButton.addEventListener("click", () => {
  currentFontSize = defaultSettings.fontSize;
  applySettings();
  saveSettings();
});

writingAreaTextAlignRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    writingAreaTextAlign = e.target.value;
    applySettings();
    saveSettings();
  });
});
resetWritingAreaTextAlignButton.addEventListener("click", () => {
  writingAreaTextAlign = defaultSettings.writingAreaTextAlign;
  applySettings();
  saveSettings();
});

letterSpacingSlider.addEventListener("input", (e) => {
  currentLetterSpacing = parseFloat(e.target.value);
  applySettings();
  saveSettings();
});
resetLetterSpacingButton.addEventListener("click", () => {
  currentLetterSpacing = defaultSettings.letterSpacing;
  applySettings();
  saveSettings();
});

lineHeightSlider.addEventListener("input", (e) => {
  currentLineHeight = parseFloat(e.target.value);
  applySettings();
  saveSettings();
});
resetLineHeightButton.addEventListener("click", () => {
  currentLineHeight = defaultSettings.lineHeight;
  applySettings();
  saveSettings();
});

wordSpacingSlider.addEventListener("input", (e) => {
  currentWordSpacing = parseFloat(e.target.value);
  applySettings();
  saveSettings();
});
resetWordSpacingButton.addEventListener("click", () => {
  currentWordSpacing = defaultSettings.wordSpacing;
  applySettings();
  saveSettings();
});

writingAreaBgColorPicker.addEventListener("input", (e) => {
  applyWritingAreaBgColor(e.target.value);
});
resetWritingAreaBgColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].writingAreaBg;
  applyWritingAreaBgColor(defaultColor);
  writingAreaBgColorPicker.value = defaultColor;
});

writingAreaTextColorPicker.addEventListener("input", (e) => {
  applyWritingAreaTextColor(e.target.value);
});
resetWritingAreaTextColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].writingAreaText;
  applyWritingAreaTextColor(defaultColor);
  writingAreaTextColorPicker.value = defaultColor;
});

markdownViewFontSizeSlider.addEventListener("input", (e) => {
  currentMarkdownViewFontSize = parseInt(e.target.value);
  applySettings();
  saveSettings();
});
resetMarkdownViewFontSizeButton.addEventListener("click", () => {
  currentMarkdownViewFontSize = defaultSettings.markdownViewFontSize;
  applySettings();
  saveSettings();
});

markdownViewTextAlignRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    markdownViewTextAlign = e.target.value;
    applySettings();
    saveSettings();
  });
});
resetMarkdownViewTextAlignButton.addEventListener("click", () => {
  markdownViewTextAlign = defaultSettings.markdownViewTextAlign;
  applySettings();
  saveSettings();
});

accentColorPicker.addEventListener("input", (e) => {
  applyAccentColor(e.target.value);
});
resetAccentColorButton.addEventListener("click", () => {
  applyAccentColor(defaultColors[getSystemTheme()].accent);
});

bgColorPicker.addEventListener("input", (e) => {
  applyAppBgColor(e.target.value);
});
resetBgColorButton.addEventListener("click", () => {
  applyAppBgColor(defaultColors[getSystemTheme()].bg);
});

appTextColorPicker.addEventListener("input", (e) => {
  applyAppTextColor(e.target.value);
});
resetAppTextColorButton.addEventListener("click", () => {
  applyAppTextColor(defaultColors[getSystemTheme()].text);
});

markdownViewTextColorPicker.addEventListener("input", (e) => {
  applyMarkdownViewTextColor(e.target.value);
});
resetMarkdownViewTextColorButton.addEventListener("click", () => {
  applyMarkdownViewTextColor(defaultColors[getSystemTheme()].markdownViewText);
});

// Global Reset
resetAllColorsButton.addEventListener("click", resetAllToDefault);

// Word Count Toggle
wordCountToggleCheckbox.addEventListener("change", (e) => {
  isWordCountVisible = e.target.checked;
  applySettings();
  saveSettings();
});

// Control Bar Toggle
hideControlBarToggle.addEventListener("change", () => {
  hideControlBarOnHover = hideControlBarToggle.checked;
  localStorage.setItem("hideControlBarOnHover", hideControlBarOnHover);
  applyControlBarHoverBehavior();
});

// Initial Setup on Load
document.addEventListener("DOMContentLoaded", () => {
  const savedContent = localStorage.getItem("savedContent");
  if (savedContent) {
    writingArea.value = savedContent;
  }
  updateCounts();

  loadSettings();
  applyAllColors(
    accentColorPicker,
    bgColorPicker,
    appTextColorPicker,
    writingAreaBgColorPicker,
    writingAreaTextColorPicker,
    markdownViewTextColorPicker
  );
  applySettings(); // Apply all settings loaded from localStorage or defaults
});
