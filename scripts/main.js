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

const helpButton = document.getElementById("helpButton");
const markdownShortcutsPanel = document.getElementById(
  "markdownShortcutsPanel"
);

const fontSizeSlider = document.getElementById("fontSizeSlider");
const fontSizeValueSpan = document.getElementById("fontSizeValue");
const resetFontSizeButton = document.getElementById("resetFontSize");

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

// Default Settings
const defaultSettings = {
  fontSize: 18,
  isWordCountVisible: true,
  hideControlBarOnHover: false,
};

// State Variables
let currentFontSize = defaultSettings.fontSize;
let isWordCountVisible = defaultSettings.isWordCountVisible;
let hideControlBarOnHover = defaultSettings.hideControlBarOnHover;

function updateCounts() {
  const text = writingArea.value;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;

  wordCountSpan.textContent = `Words: ${words}`;
  charCountSpan.textContent = `Characters: ${chars}`;
}

function applySettings() {
  // Font Size
  writingArea.style.fontSize = `${currentFontSize}px`;
  fontSizeValueSpan.textContent = `${currentFontSize}px`;
  fontSizeSlider.value = currentFontSize;

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
  localStorage.setItem("fontSize", currentFontSize);
  localStorage.setItem("isWordCountVisible", isWordCountVisible);
  localStorage.setItem("hideControlBarOnHover", hideControlBarOnHover);
}

// Loads settings from localStorage or sets default values if not found.
function loadSettings() {
  currentFontSize =
    parseInt(localStorage.getItem("fontSize")) || defaultSettings.fontSize;

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

function resetAllToDefault() {
  currentFontSize = defaultSettings.fontSize;
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
    // Initially hide the control bar if the setting is active
    controlBar.classList.add("control-bar-hidden");
    controlBar.classList.remove("control-bar-show");

    // Add event listeners for hover interactions
    controlBarHoverTrigger.addEventListener("mouseenter", showControlBar);
    controlBarHoverTrigger.addEventListener("mouseleave", hideControlBar);
    controlBar.addEventListener("mouseleave", hideControlBar); // Hide if mouse leaves bar directly
    controlBar.addEventListener("mouseenter", showControlBar); // stay visible if mouse is over it
  } else {
    // Ensure the control bar is always visible
    controlBar.classList.add("control-bar-show");
    controlBar.classList.remove("control-bar-hidden");
  }
  // Update the checkbox state in settings panel to match the loaded/current state
  hideControlBarToggle.checked = hideControlBarOnHover;
}

// Listen for input on the writing area to update counts and save content
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

accentColorPicker.addEventListener("input", (e) => {
  applyAccentColor(e.target.value);
});
resetAccentColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].accent;
  applyAccentColor(defaultColor);
  accentColorPicker.value = defaultColor;
});

bgColorPicker.addEventListener("input", (e) => {
  applyAppBgColor(e.target.value);
});
resetBgColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].bg;
  applyAppBgColor(defaultColor);
  bgColorPicker.value = defaultColor;
});

appTextColorPicker.addEventListener("input", (e) => {
  applyAppTextColor(e.target.value);
});
resetAppTextColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].text;
  applyAppTextColor(defaultColor);
  appTextColorPicker.value = defaultColor;
});

markdownViewTextColorPicker.addEventListener("input", (e) => {
  applyMarkdownViewTextColor(e.target.value);
});
resetMarkdownViewTextColorButton.addEventListener("click", () => {
  const defaultColor = defaultColors[getSystemTheme()].markdownViewText;
  applyMarkdownViewTextColor(defaultColor);
  markdownViewTextColorPicker.value = defaultColor;
});

resetAllColorsButton.addEventListener("click", resetAllToDefault);

wordCountToggleCheckbox.addEventListener("change", (e) => {
  isWordCountVisible = e.target.checked;
  applySettings();
  saveSettings();
});

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
  applySettings();
});
