const writingArea = document.getElementById("writingArea");
const markdownOutput = document.getElementById("markdownOutput");
const statusBar = document.getElementById("statusBar");
const wordCountSpan = document.getElementById("wordCount");
const charCountSpan = document.getElementById("charCount");

const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const overlay = document.getElementById("overlay");

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

// Control Bar Visibility
const controlBar = document.getElementById("controlBar");
const hideControlBarToggle = document.getElementById("hideControlBarToggle");
const controlBarHoverTrigger = document.getElementById(
  "controlBarHoverTrigger"
);

// Default Settings
const defaultSettings = {
  fontSize: 18,
  writingAreaBgColor: "#282b49",
  writingAreaTextColor: "#f0f0f0",
  accentColor: "#64b5f6",
  appBgColor: "#1c1f3b",
  markdownViewTextColor: "#e0e0e0",
  isWordCountVisible: true,
  hideControlBarOnHover: false,
};

// State Variables
let currentFontSize = defaultSettings.fontSize;
let currentWritingAreaBgColor = defaultSettings.writingAreaBgColor;
let currentWritingAreaTextColor = defaultSettings.writingAreaTextColor;
let currentAccentColor = defaultSettings.accentColor;
let currentBgColor = defaultSettings.appBgColor;
let currentMarkdownViewTextColor = defaultSettings.markdownViewTextColor;
let isWordCountVisible = defaultSettings.isWordCountVisible;
let hideControlBarOnHover = defaultSettings.hideControlBarOnHover; // State for control bar hiding

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

  // Writing Area Colors
  document.documentElement.style.setProperty(
    "--writing-area-bg-color",
    currentWritingAreaBgColor
  );
  writingAreaBgColorPicker.value = currentWritingAreaBgColor;

  document.documentElement.style.setProperty(
    "--writing-area-text-color",
    currentWritingAreaTextColor
  );
  writingAreaTextColorPicker.value = currentWritingAreaTextColor;

  // App Colors
  document.documentElement.style.setProperty(
    "--accent-color",
    currentAccentColor
  );
  accentColorPicker.value = currentAccentColor;

  document.documentElement.style.setProperty("--app-bg-color", currentBgColor);
  bgColorPicker.value = currentBgColor;

  // Markdown View Text Color
  document.documentElement.style.setProperty(
    "--markdown-view-text-color",
    currentMarkdownViewTextColor
  );
  markdownViewTextColorPicker.value = currentMarkdownViewTextColor;

  // Word Count Visibility
  statusBar.style.display = isWordCountVisible ? "flex" : "none";
  wordCountToggleCheckbox.checked = isWordCountVisible;

  // Apply Control Bar hover behavior
  applyControlBarHoverBehavior();
}

function toggleSettingsPanel() {
  settingsPanel.classList.toggle("open");
  overlay.classList.toggle("hidden");
}

// Saves all current settings to localStorage.
function saveSettings() {
  localStorage.setItem("fontSize", currentFontSize);
  localStorage.setItem("writingAreaBgColor", currentWritingAreaBgColor);
  localStorage.setItem("writingAreaTextColor", currentWritingAreaTextColor);
  localStorage.setItem("accentColor", currentAccentColor);
  localStorage.setItem("appBgColor", currentBgColor);
  localStorage.setItem("markdownViewTextColor", currentMarkdownViewTextColor);
  localStorage.setItem("isWordCountVisible", isWordCountVisible);
  localStorage.setItem("hideControlBarOnHover", hideControlBarOnHover);
}

// Loads settings from localStorage or sets default values if not found.
function loadSettings() {
  currentFontSize =
    parseInt(localStorage.getItem("fontSize")) || defaultSettings.fontSize;
  currentWritingAreaBgColor =
    localStorage.getItem("writingAreaBgColor") ||
    defaultSettings.writingAreaBgColor;
  currentWritingAreaTextColor =
    localStorage.getItem("writingAreaTextColor") ||
    defaultSettings.writingAreaTextColor;
  currentAccentColor =
    localStorage.getItem("accentColor") || defaultSettings.accentColor;
  currentBgColor =
    localStorage.getItem("appBgColor") || defaultSettings.appBgColor;
  currentMarkdownViewTextColor =
    localStorage.getItem("markdownViewTextColor") ||
    defaultSettings.markdownViewTextColor;
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
  currentWritingAreaBgColor = defaultSettings.writingAreaBgColor;
  currentWritingAreaTextColor = defaultSettings.writingAreaTextColor;
  currentAccentColor = defaultSettings.accentColor;
  currentBgColor = defaultSettings.appBgColor;
  currentMarkdownViewTextColor = defaultSettings.markdownViewTextColor;
  isWordCountVisible = defaultSettings.isWordCountVisible;
  hideControlBarOnHover = defaultSettings.hideControlBarOnHover;

  applySettings();
  saveSettings();
}

function showControlBar() {
  // Only show if the setting is active
  if (hideControlBarOnHover) {
    controlBar.classList.add("control-bar-show");
    controlBar.classList.remove("control-bar-hidden");
  }
}

function hideControlBar() {
  // Only hide if the setting is active AND mouse is not currently over the control bar trigger
  // prevent bar from disappearing while user is interacting
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

    // Remove event listeners to disable hover behavior
    controlBarHoverTrigger.removeEventListener("mouseenter", showControlBar);
    controlBarHoverTrigger.removeEventListener("mouseleave", hideControlBar);
    controlBar.removeEventListener("mouseleave", hideControlBar);
    controlBar.removeEventListener("mouseenter", showControlBar);
  }
  // Update the checkbox state in settings panel to match the loaded/current state
  hideControlBarToggle.checked = hideControlBarOnHover;
}

// Listen for input on the writing area to update counts and save content
writingArea.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("savedContent", writingArea.value);
});

settingsButton.addEventListener("click", toggleSettingsPanel);
overlay.addEventListener("click", toggleSettingsPanel); // Close on overlay click

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
  currentWritingAreaBgColor = e.target.value;
  applySettings();
  saveSettings();
});
resetWritingAreaBgColorButton.addEventListener("click", () => {
  currentWritingAreaBgColor = defaultSettings.writingAreaBgColor;
  applySettings();
  saveSettings();
});

writingAreaTextColorPicker.addEventListener("input", (e) => {
  currentWritingAreaTextColor = e.target.value;
  applySettings();
  saveSettings();
});
resetWritingAreaTextColorButton.addEventListener("click", () => {
  currentWritingAreaTextColor = defaultSettings.writingAreaTextColor;
  applySettings();
  saveSettings();
});

accentColorPicker.addEventListener("input", (e) => {
  currentAccentColor = e.target.value;
  applySettings();
  saveSettings();
});
resetAccentColorButton.addEventListener("click", () => {
  currentAccentColor = defaultSettings.accentColor;
  applySettings();
  saveSettings();
});

bgColorPicker.addEventListener("input", (e) => {
  currentBgColor = e.target.value;
  applySettings();
  saveSettings();
});
resetBgColorButton.addEventListener("click", () => {
  currentBgColor = defaultSettings.appBgColor;
  applySettings();
  saveSettings();
});

markdownViewTextColorPicker.addEventListener("input", (e) => {
  currentMarkdownViewTextColor = e.target.value;
  applySettings();
  saveSettings();
});
resetMarkdownViewTextColorButton.addEventListener("click", () => {
  currentMarkdownViewTextColor = defaultSettings.markdownViewTextColor;
  applySettings();
  saveSettings();
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
  applySettings();
});
