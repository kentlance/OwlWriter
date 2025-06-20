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

const fontSizeSlider = document.getElementById("fontSizeSlider");
const fontSizeValueSpan = document.getElementById("fontSizeValue");
const resetFontSizeButton = document.getElementById("resetFontSize");

const writingAreaTextAlignRadios = document.querySelectorAll(
  'input[name="writingAreaTextAlign"]'
);
const resetWritingAreaTextAlignButton = document.getElementById(
  "resetWritingAreaTextAlign"
);

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
  fontSize: 18,
  writingAreaTextAlign: "left",
  markdownViewFontSize: 16,
  markdownViewTextAlign: "left",
  isWordCountVisible: true,
  hideControlBarOnHover: false,
};

let currentDocumentPanelWidth = defaultSettings.documentPanelWidth;
let currentFontSize = defaultSettings.fontSize;
let writingAreaTextAlign = defaultSettings.writingAreaTextAlign;
let currentMarkdownViewFontSize = defaultSettings.markdownViewFontSize;
let markdownViewTextAlign = defaultSettings.markdownViewTextAlign;
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
  // Document Panel Width
  documentPanel.style.maxWidth = `${currentDocumentPanelWidth}px`;
  documentPanelWidthValueSpan.textContent = `${currentDocumentPanelWidth}px`;
  documentPanelWidthSlider.value = currentDocumentPanelWidth;

  // Writing Area Font Size
  writingArea.style.fontSize = `${currentFontSize}px`;
  fontSizeValueSpan.textContent = `${currentFontSize}px`;
  fontSizeSlider.value = currentFontSize;

  // Writing Area Text Align
  writingArea.style.textAlign = writingAreaTextAlign;
  writingAreaTextAlignRadios.forEach((radio) => {
    radio.checked = radio.value === writingAreaTextAlign;
  });

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
  localStorage.setItem("fontSize", currentFontSize);
  localStorage.setItem("writingAreaTextAlign", writingAreaTextAlign);
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

  currentFontSize =
    parseInt(localStorage.getItem("fontSize")) || defaultSettings.fontSize;

  writingAreaTextAlign =
    localStorage.getItem("writingAreaTextAlign") ||
    defaultSettings.writingAreaTextAlign;

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
  currentFontSize = defaultSettings.fontSize;
  writingAreaTextAlign = defaultSettings.writingAreaTextAlign;
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

// Writing Area Text Align
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
