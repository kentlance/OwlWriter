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

// Import defaultSettings from settings.js
import { defaultSettings } from "./settings.js";

import { initPresetsDropdown } from "./presets.js";
import {
  setupButtonOrder,
  initializeSortableUI,
  resetButtonOrderToDefault,
} from "./buttonOrder.js";

export const writingArea = document.getElementById("writingArea");
export const markdownOutput = document.getElementById("markdownOutput");

const statusBar = document.getElementById("statusBar");
const wordCountSpan = document.getElementById("wordCount");
const charCountSpan = document.getElementById("charCount");

const settingsButton = document.getElementById("settingsButton");
export const settingsPanel = document.getElementById("settingsPanel");
const overlay = document.getElementById("overlay");
const closeSettingsButton = document.getElementById("closeSettingsButton");

const helpButton = document.getElementById("helpButton");
const markdownShortcutsPanel = document.getElementById(
  "markdownShortcutsPanel"
);
const closeMarkdownShortcutsButton = document.getElementById(
  "closeMarkdownShortcutsButton"
);

// Control Bar, and Copy Message
const copyMessage = document.getElementById("copyMessage"); // Used by showCopyMessage
const controlBar = document.getElementById("controlBar");
const hideControlBarToggle = document.getElementById("hideControlBarToggle");
const controlBarHoverTrigger = document.getElementById(
  "controlBarHoverTrigger"
);

//Control Bar Opacity elements
const controlBarButtonOpacitySlider = document.getElementById(
  "controlBarButtonOpacitySlider"
);
const controlBarButtonOpacityValueSpan = document.getElementById(
  "controlBarButtonOpacityValue"
);
const resetControlBarButtonOpacityButton = document.getElementById(
  "resetControlBarButtonOpacity"
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

// Writing Area
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

// writing area placeholder
const writingAreaPlaceholderInput = document.getElementById(
  "writingAreaPlaceholderInput"
);
const resetWritingAreaPlaceholderButton = document.getElementById(
  "resetWritingAreaPlaceholderButton"
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

const fullScreenToggleButton = document.getElementById(
  "fullScreenToggleButton"
);

// Markdown Popup Toggle
export const markdownPopupToggle = document.getElementById(
  "markdownPopupToggle"
);

let appSettings = {};

// Export appSettings and updateSetting for use in other modules
export { appSettings };

export function updateSetting(key, value) {
  appSettings[key] = value;
  saveSettings(); // Save all settings after any change

  if (key === "showMarkdownPopup") {
    document.dispatchEvent(new Event("selectionchange"));
  }
  applySettings();
}

// Helper function to map font family keys to CSS font stacks
const fontFamilyMap = {
  "system-sans":
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  inter:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  monospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  roboto:
    'Roboto, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  merriweather:
    'Merriweather, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  raleway:
    'Raleway, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  nunito:
    'Nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  quicksand:
    'Quicksand, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  outfit:
    'Outfit, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  "libre-baskerville":
    '"Libre Baskerville", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  amethysta:
    'Amethysta, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
};

export function updateCounts() {
  const text = writingArea.value;
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const chars = text.length;

  wordCountSpan.textContent = `Words: ${words}`;
  charCountSpan.textContent = `Characters: ${chars}`;
}

export function showCopyMessage(message = "Content Copied!") {
  copyMessage.classList.remove("opacity-100", "translate-y-0");
  copyMessage.classList.add("opacity-0", "translate-y-full");

  copyMessage.textContent = message;

  void copyMessage.offsetWidth; // Force reflow

  copyMessage.classList.add("opacity-100", "translate-y-0");
  copyMessage.classList.remove("opacity-0", "translate-y-full");

  setTimeout(() => {
    copyMessage.classList.remove("opacity-100", "translate-y-0");
    copyMessage.classList.add("opacity-0", "translate-y-full");
  }, 2000); // Message visible for 2 seconds
}

export function applySettings() {
  // Document Panel Width
  documentPanel.style.maxWidth = `${appSettings.documentPanelWidth}px`;
  documentPanelWidthValueSpan.textContent = `${appSettings.documentPanelWidth}px`;
  documentPanelWidthSlider.value = appSettings.documentPanelWidth;

  // Writing Area Font Family
  document.documentElement.style.setProperty(
    "--writing-area-font-family",
    fontFamilyMap[appSettings.writingAreaFontFamily]
  );
  writingAreaFontFamilySelect.value = appSettings.writingAreaFontFamily;

  // Writing Area Font Size
  writingArea.style.fontSize = `${appSettings.fontSize}px`;
  fontSizeValueSpan.textContent = `${appSettings.fontSize}px`;
  fontSizeSlider.value = appSettings.fontSize;

  // Writing Area Text Align
  writingArea.style.textAlign = appSettings.writingAreaTextAlign;
  writingAreaTextAlignRadios.forEach((radio) => {
    radio.checked = radio.value === appSettings.writingAreaTextAlign;
  });

  // Writing Area letter-spacing
  document.documentElement.style.setProperty(
    "--writing-area-letter-spacing",
    `${appSettings.letterSpacing}em`
  );
  letterSpacingSlider.value = appSettings.letterSpacing;
  letterSpacingValueSpan.textContent = `${appSettings.letterSpacing}em`;

  // Writing Area line-height
  document.documentElement.style.setProperty(
    "--writing-area-line-height",
    appSettings.lineHeight
  );
  lineHeightSlider.value = appSettings.lineHeight;
  lineHeightValueSpan.textContent = appSettings.lineHeight;

  // Writing Area word-spacing
  document.documentElement.style.setProperty(
    "--writing-area-word-spacing",
    `${appSettings.wordSpacing}px`
  );
  wordSpacingSlider.value = appSettings.wordSpacing;
  wordSpacingValueSpan.textContent = `${appSettings.wordSpacing}px`;

  // Writing Area Placeholder
  writingArea.placeholder = appSettings.writingAreaPlaceholder;
  if (writingAreaPlaceholderInput) {
    writingAreaPlaceholderInput.value = appSettings.writingAreaPlaceholder;
  }

  // Markdown View Font Size
  markdownOutput.style.fontSize = `${appSettings.markdownViewFontSize}px`;
  markdownViewFontSizeValueSpan.textContent = `${appSettings.markdownViewFontSize}px`;
  markdownViewFontSizeSlider.value = appSettings.markdownViewFontSize;

  // Markdown View Text Align
  markdownOutput.style.textAlign = appSettings.markdownViewTextAlign;
  markdownViewTextAlignRadios.forEach((radio) => {
    radio.checked = radio.value === appSettings.markdownViewTextAlign;
  });

  // Word Count Visibility
  statusBar.style.display = appSettings.isWordCountVisible ? "flex" : "none";
  wordCountToggleCheckbox.checked = appSettings.isWordCountVisible;

  // Apply Control Bar hover behavior
  applyControlBarHoverBehavior();

  // Control Bar Button Opacity
  document.documentElement.style.setProperty(
    "--control-bar-button-opacity",
    appSettings.controlBarButtonOpacity
  );
  controlBarButtonOpacitySlider.value = appSettings.controlBarButtonOpacity;
  controlBarButtonOpacityValueSpan.textContent = `${Math.round(
    appSettings.controlBarButtonOpacity * 100
  )}%`;

  // Markdown Popup Toggle state
  if (markdownPopupToggle) {
    // Check if the element exists
    markdownPopupToggle.checked = appSettings.showMarkdownPopup;
  }

  applyAllColors(
    accentColorPicker,
    bgColorPicker,
    appTextColorPicker,
    writingAreaBgColorPicker,
    writingAreaTextColorPicker,
    markdownViewTextColorPicker
  );
}

// Function to save all settings to localStorage
export function saveSettings() {
  localStorage.setItem("appSettings", JSON.stringify(appSettings));
}

// Function to load all settings from localStorage
export function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem("appSettings")) || {};
  Object.assign(appSettings, defaultSettings, savedSettings);

  // For boolean values stored as strings, convert them if necessary
  if (typeof appSettings.isWordCountVisible === "string") {
    appSettings.isWordCountVisible = appSettings.isWordCountVisible === "true";
  }
  if (typeof appSettings.hideControlBarOnHover === "string") {
    appSettings.hideControlBarOnHover =
      appSettings.hideControlBarOnHover === "true";
  }
  if (typeof appSettings.showMarkdownPopup === "string") {
    appSettings.showMarkdownPopup = appSettings.showMarkdownPopup === "true";
  }
}

// Internal Functions

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

function resetAllToDefault() {
  // Reset appSettings to default values
  Object.assign(appSettings, defaultSettings);

  // Reset colors specifically
  resetAllColors();

  // Other specific resets
  resetButtonOrderToDefault();

  applySettings(); // Apply all changes to the UI
  saveSettings(); // Save the default settings to localStorage
}

function showControlBar() {
  if (appSettings.hideControlBarOnHover) {
    // Use appSettings
    controlBar.classList.add("control-bar-show");
    controlBar.classList.remove("control-bar-hidden");
  }
}

function hideControlBar() {
  if (
    appSettings.hideControlBarOnHover &&
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

  if (appSettings.hideControlBarOnHover) {
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
  hideControlBarToggle.checked = appSettings.hideControlBarOnHover; // Use appSettings
}

// Fullscreen functions
function enterFullScreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    // Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    // IE/Edge
    document.documentElement.msRequestFullscreen();
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    // Chrome, Safari and Opera
    document.webkitExitFullScreen();
  } else if (document.msExitFullscreen) {
    // IE/Edge
    document.msExitFullscreen();
  }
}

function updateFullScreenIcon() {
  const iconSvg = fullScreenToggleButton.querySelector("svg");
  if (!iconSvg) return;

  const expandPath =
    "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15";
  const compressPath =
    "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25";

  // Check if currently in fullscreen
  if (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  ) {
    // Currently in fullscreen, show compress icon
    iconSvg.querySelector("path").setAttribute("d", compressPath);
    document.body.classList.add("fullscreen-active"); // Apply a class to body for potential styling adjustments in fullscreen
    isFullScreen = true;
  } else {
    // Not in fullscreen, show expand icon
    iconSvg.querySelector("path").setAttribute("d", expandPath);
    document.body.classList.remove("fullscreen-active"); // Remove the class
    isFullScreen = false;
  }
}

// Event Listeners
writingArea.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("savedContent", writingArea.value);
});

// Panel Toggles
settingsButton.addEventListener("click", () => {
  togglePanel(settingsPanel); // toggle the panel's visibility
  if (settingsPanel.classList.contains("open")) {
    initializeSortableUI();
  }
});

helpButton.addEventListener("click", () => togglePanel(markdownShortcutsPanel));

// Overlay click closes all panels
overlay.addEventListener("click", () => {
  settingsPanel.classList.remove("open");
  markdownShortcutsPanel.classList.remove("open");
  overlay.classList.add("hidden");
});

// Close buttons for panels
closeSettingsButton.addEventListener("click", () => {
  settingsPanel.classList.remove("open");
  overlay.classList.add("hidden");
});
closeMarkdownShortcutsButton.addEventListener("click", () => {
  markdownShortcutsPanel.classList.remove("open");
  overlay.classList.add("hidden");
});

// Document Panel Width controls
documentPanelWidthSlider.addEventListener("input", (e) => {
  updateSetting("documentPanelWidth", parseInt(e.target.value));
});
resetDocumentPanelWidthButton.addEventListener("click", () => {
  updateSetting("documentPanelWidth", defaultSettings.documentPanelWidth);
});

// Writing Area Font Family controls
writingAreaFontFamilySelect.addEventListener("change", (e) => {
  updateSetting("writingAreaFontFamily", e.target.value);
});
resetWritingAreaFontFamilyButton.addEventListener("click", () => {
  updateSetting("writingAreaFontFamily", defaultSettings.writingAreaFontFamily);
});

// Font Size controls
fontSizeSlider.addEventListener("input", (e) => {
  updateSetting("fontSize", parseInt(e.target.value));
});
resetFontSizeButton.addEventListener("click", () => {
  updateSetting("fontSize", defaultSettings.fontSize);
});

// Writing Area Text Align controls
writingAreaTextAlignRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    updateSetting("writingAreaTextAlign", e.target.value);
  });
});
resetWritingAreaTextAlignButton.addEventListener("click", () => {
  updateSetting("writingAreaTextAlign", defaultSettings.writingAreaTextAlign);
});

// Letter Spacing controls
letterSpacingSlider.addEventListener("input", (e) => {
  updateSetting("letterSpacing", parseFloat(e.target.value));
});
resetLetterSpacingButton.addEventListener("click", () => {
  updateSetting("letterSpacing", defaultSettings.letterSpacing);
});

// Line Height controls
lineHeightSlider.addEventListener("input", (e) => {
  updateSetting("lineHeight", parseFloat(e.target.value));
});
resetLineHeightButton.addEventListener("click", () => {
  updateSetting("lineHeight", defaultSettings.lineHeight);
});

// Word Spacing controls
wordSpacingSlider.addEventListener("input", (e) => {
  updateSetting("wordSpacing", parseFloat(e.target.value));
});
resetWordSpacingButton.addEventListener("click", () => {
  updateSetting("wordSpacing", defaultSettings.wordSpacing);
});

// Writing Area Background Color controls
writingAreaBgColorPicker.addEventListener("input", (e) => {
  updateSetting("writingAreaBgColor", e.target.value);
  applyWritingAreaBgColor(e.target.value);
});
resetWritingAreaBgColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].writingAreaBg;
  updateSetting("writingAreaBgColor", defaultColor);
  applyWritingAreaBgColor(defaultColor);
  writingAreaBgColorPicker.value = defaultColor;
});

// Writing Area Text Color controls
writingAreaTextColorPicker.addEventListener("input", (e) => {
  updateSetting("writingAreaTextColor", e.target.value);
  applyWritingAreaTextColor(e.target.value);
});
resetWritingAreaTextColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].writingAreaText;
  updateSetting("writingAreaTextColor", defaultColor);
  applyWritingAreaTextColor(defaultColor);
  writingAreaTextColorPicker.value = defaultColor;
});

// Writing Area Placeholder
writingAreaPlaceholderInput.addEventListener("input", (e) => {
  updateSetting("writingAreaPlaceholder", e.target.value);
});

resetWritingAreaPlaceholderButton.addEventListener("click", () => {
  updateSetting(
    "writingAreaPlaceholder",
    defaultSettings.writingAreaPlaceholder
  );
});

// Markdown View Font Size controls
markdownViewFontSizeSlider.addEventListener("input", (e) => {
  updateSetting("markdownViewFontSize", parseInt(e.target.value));
});
resetMarkdownViewFontSizeButton.addEventListener("click", () => {
  updateSetting("markdownViewFontSize", defaultSettings.markdownViewFontSize);
});

markdownViewTextAlignRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    updateSetting("markdownViewTextAlign", e.target.value);
  });
});
resetMarkdownViewTextAlignButton.addEventListener("click", () => {
  updateSetting("markdownViewTextAlign", defaultSettings.markdownViewTextAlign);
});

accentColorPicker.addEventListener("input", (e) => {
  updateSetting("accentColor", e.target.value);
  applyAccentColor(e.target.value);
});
resetAccentColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].accent;
  updateSetting("accentColor", defaultColor);
  applyAccentColor(defaultColor);
  accentColorPicker.value = defaultColor;
});

bgColorPicker.addEventListener("input", (e) => {
  updateSetting("appBgColor", e.target.value);
  applyAppBgColor(e.target.value);
});
resetBgColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].bg;
  updateSetting("appBgColor", defaultColor);
  applyAppBgColor(defaultColor);
  bgColorPicker.value = defaultColor;
});

appTextColorPicker.addEventListener("input", (e) => {
  updateSetting("appTextColor", e.target.value);
  applyAppTextColor(e.target.value);
});
resetAppTextColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].text;
  updateSetting("appTextColor", defaultColor);
  applyAppTextColor(defaultColor);
  appTextColorPicker.value = defaultColor;
});

markdownViewTextColorPicker.addEventListener("input", (e) => {
  updateSetting("markdownViewTextColor", e.target.value);
  applyMarkdownViewTextColor(e.target.value);
});
resetMarkdownViewTextColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].markdownViewText;
  updateSetting("markdownViewTextColor", defaultColor);
  applyMarkdownViewTextColor(defaultColor);
  markdownViewTextColorPicker.value = defaultColor;
});

// Global Reset
resetAllColorsButton.addEventListener("click", resetAllToDefault);

// Word Count Toggle
wordCountToggleCheckbox.addEventListener("change", (e) => {
  updateSetting("isWordCountVisible", e.target.checked);
});

// Control Bar Toggle
hideControlBarToggle.addEventListener("change", () => {
  updateSetting("hideControlBarOnHover", hideControlBarToggle.checked);
});

// Control Bar Button Opacity controls
controlBarButtonOpacitySlider.addEventListener("input", (e) => {
  updateSetting("controlBarButtonOpacity", parseFloat(e.target.value));
});

resetControlBarButtonOpacityButton.addEventListener("click", () => {
  updateSetting(
    "controlBarButtonOpacity",
    defaultSettings.controlBarButtonOpacity
  );
});

// Markdown Popup Toggle Event Listener
if (markdownPopupToggle) {
  markdownPopupToggle.addEventListener("change", (event) => {
    updateSetting("showMarkdownPopup", event.target.checked);
  });
}

// Fullscreen Event Listener
fullScreenToggleButton.addEventListener("click", () => {
  if (document.fullscreenElement) {
    exitFullScreen();
  } else {
    enterFullScreen();
  }
});

// Listen for fullscreen changes (user presses Esc)
document.addEventListener("fullscreenchange", updateFullScreenIcon);
document.addEventListener("mozfullscreenchange", updateFullScreenIcon);
document.addEventListener("webkitfullscreenchange", updateFullScreenIcon);
document.addEventListener("msfullscreenchange", updateFullScreenIcon);

// Initial Setup on Load
document.addEventListener("DOMContentLoaded", () => {
  // Load saved content
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
  applySettings();
  initPresetsDropdown();
  setupButtonOrder();
  updateFullScreenIcon();
});
