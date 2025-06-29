import {
  defaultColors,
  getSystemTheme,
  applyAllColors,
  resetAllColors,
} from "./colors.js";

import {
  loadPages,
  createNewPage,
  deletePage,
  renamePage,
  openPage,
  updateCurrentPageContent,
  getCurrentPageContent,
  getCurrentPageId,
  getAllPages,
  resetPages,
} from "./pages.js";

// Import defaultSettings from settings.js
import { defaultSettings } from "./settings.js";

import {
  initPresetsDropdown,
  presetSelect,
  getCurrentPresetName,
} from "./presets.js";

import {
  setupButtonOrder,
  initializeSortableUI,
  resetButtonOrderToDefault,
} from "./buttonOrder.js";

import { setupExportImportFeatures } from "./exportImportTheme.js";

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

// Pages Panel Elements
const pagesButton = document.getElementById("pagesButton");
const pagesPanel = document.getElementById("pagesPanel");
const closePagesButton = document.getElementById("closePagesButton");
const pageSearchInput = document.getElementById("pageSearchInput");
const createNewPageButton = document.getElementById("createNewPageButton");
const pagesList = document.getElementById("pagesList");

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

// Control Bar Color elements
const controlBarButtonBgColorPicker = document.getElementById(
  "controlBarButtonBgColorPicker"
);
const resetControlBarButtonBgColorButton = document.getElementById(
  "resetControlBarButtonBgColorButton"
);
const controlBarButtonIconColorPicker = document.getElementById(
  "controlBarButtonIconColorPicker"
);
const resetControlBarButtonIconColorButton = document.getElementById(
  "resetControlBarButtonIconColorButton"
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

const useRandomPlaceholderToggle = document.getElementById(
  "useRandomPlaceholderToggle"
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
  "system-sans": "ui-sans-serif, system-ui, sans-serif",
  inter: "Inter, ui-sans-serif, sans-serif",
  serif: "ui-serif, Georgia, Cambria, serif",
  monospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  roboto: "Roboto, ui-sans-serif, sans-serif",
  merriweather: "Merriweather, ui-serif, serif",
  raleway: "Raleway, ui-sans-serif, sans-serif",
  nunito: "Nunito, ui-sans-serif, sans-serif",
  quicksand: "Quicksand, ui-sans-serif, sans-serif",
  outfit: "Outfit, ui-sans-serif, sans-serif",
  "libre-baskerville": '"Libre Baskerville", ui-serif, serif',
  amethysta: "Amethysta, ui-serif, serif",
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
  if (writingAreaPlaceholderInput) {
    if (appSettings.useRandomPlaceholder) {
      writingAreaPlaceholderInput.value = ""; // Clear the specific text input
      writingAreaPlaceholderInput.disabled = true; // Disable it
    } else {
      writingAreaPlaceholderInput.value = appSettings.writingAreaPlaceholder;
      writingAreaPlaceholderInput.disabled = false;
    }
  }
  // Set the writing area's actual placeholder text from appSettings
  writingArea.placeholder = appSettings.writingAreaPlaceholder;

  // Use Random Placeholder Toggle state
  if (useRandomPlaceholderToggle) {
    useRandomPlaceholderToggle.checked = appSettings.useRandomPlaceholder;
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
    markdownViewTextColorPicker,
    controlBarButtonBgColorPicker,
    controlBarButtonIconColorPicker
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
  const booleanKeys = [
    "isWordCountVisible",
    "hideControlBarOnHover",
    "showMarkdownPopup",
    "useRandomPlaceholder",
  ];
  booleanKeys.forEach((key) => {
    if (typeof appSettings[key] === "string") {
      appSettings[key] = appSettings[key] === "true";
    }
  });
}

// Internal Functions

function togglePanel(panel) {
  // Toggle overlay visibility
  overlay.classList.toggle("hidden");

  // Close all panels first, then open the target panel
  // Ensure only one panel is open at a time
  settingsPanel.classList.remove("open");
  markdownShortcutsPanel.classList.remove("open");
  pagesPanel.classList.remove("open");

  // Open the clicked panel
  panel.classList.toggle("open");
}

function resetAllToDefault() {
  // Reset appSettings to default values
  Object.assign(appSettings, defaultSettings);

  // Reset colors specifically
  resetAllColors();

  // Other specific resets
  resetButtonOrderToDefault();

  // After resetting, apply all settings and colors to the UI
  applySettings();
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
let isFullScreen = false;
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
    document.webkitExitFullscreen();
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
  updateCurrentPageContent(writingArea.value);
});

// Panel Toggles
settingsButton.addEventListener("click", () => {
  togglePanel(settingsPanel); // toggle the panel's visibility
  if (settingsPanel.classList.contains("open")) {
    initializeSortableUI();
  }
});

// Pages Panel Toggles
if (pagesButton) {
  pagesButton.addEventListener("click", () => {
    togglePanel(pagesPanel);
    if (pagesPanel.classList.contains("open")) {
      renderPagesList(); // Refresh the list when the panel opens
    }
  });
}

closePagesButton.addEventListener("click", () => {
  pagesPanel.classList.remove("open");
  overlay.classList.add("hidden");
});

createNewPageButton.addEventListener("click", () => {
  const pageName = prompt("Enter new page name:");
  if (pageName) {
    createNewPage(pageName);
    renderPagesList(); // Refresh the list
    loadCurrentPageContent(); // Load content of the newly created page
    updateCounts(); // Update counts for the new page
  }
});

pageSearchInput.addEventListener("input", (e) => {
  renderPagesList(e.target.value); // Filter list based on search
});

// Page Management UI Rendering Functions
function renderPagesList(searchTerm = "") {
  const pages = getAllPages();
  const currentPageId = getCurrentPageId();
  pagesList.innerHTML = ""; // Clear existing list

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredPages.length === 0 && searchTerm) {
    pagesList.innerHTML =
      '<li class="text-gray-500 dark:text-gray-400">No matching pages found.</li>';
    return;
  } else if (filteredPages.length === 0 && !searchTerm) {
    pagesList.innerHTML =
      '<li class="text-gray-500 dark:text-gray-400">No pages yet. Create one!</li>';
    return;
  }

  filteredPages.forEach((page) => {
    const listItem = document.createElement("li");
    listItem.className = `flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors duration-200 ${
      page.id === currentPageId
        ? "bg-blue-500 text-white dark:bg-blue-700"
        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
    }`;
    listItem.dataset.pageId = page.id; // Store page ID for easy access

    listItem.innerHTML = `
            <span class="grow truncate mr-2">${page.name}</span>
            <div class="flex space-x-2">
                <button class="rename-page-btn text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-100" title="Rename">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              
                </button>
                <button class="delete-page-btn text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-100" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
                </button>
            </div>
        `;
    pagesList.appendChild(listItem);
  });
}

// page list actions (open, rename, delete)
pagesList.addEventListener("click", (e) => {
  const listItem = e.target.closest("li[data-page-id]");
  if (!listItem) return;

  const pageId = listItem.dataset.pageId;

  if (e.target.closest(".rename-page-btn")) {
    const currentName = listItem.querySelector("span").textContent;
    const newName = prompt("Rename page:", currentName);
    if (newName && newName.trim() !== "" && newName !== currentName) {
      renamePage(pageId, newName.trim());
      renderPagesList(); // Re-render to show updated name
    }
  } else if (e.target.closest(".delete-page-btn")) {
    if (confirm("Are you sure you want to delete this page?")) {
      const newCurrentPageId = deletePage(pageId);
      renderPagesList(); // Re-render to show updated list
      loadCurrentPageContent(); // Load content of the new current page
      updateCounts();
    }
  } else {
    // Clicked on the list item itself (to open the page)
    openPage(pageId);
    loadCurrentPageContent(); // Load content of the newly opened page
    updateCounts();
    renderPagesList(); // Re-render to highlight the active page
  }
});

function loadCurrentPageContent() {
  writingArea.value = getCurrentPageContent();
}

helpButton.addEventListener("click", () => togglePanel(markdownShortcutsPanel));

// Overlay click closes all panels
overlay.addEventListener("click", () => {
  settingsPanel.classList.remove("open");
  markdownShortcutsPanel.classList.remove("open");
  pagesPanel.classList.remove("open");
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

// Color Event Listeners
function setupColorPicker(
  pickerElement,
  localStorageKey,
  defaultColorProperty,
  resetButtonElement = null
) {
  if (pickerElement) {
    pickerElement.addEventListener("input", (e) => {
      localStorage.setItem(localStorageKey, e.target.value);
      applySettings();
      if (presetSelect) {
        presetSelect.value = getCurrentPresetName();
      }
    });
  }

  if (resetButtonElement) {
    resetButtonElement.addEventListener("click", () => {
      const defaultColor =
        defaultColors[getSystemTheme()][defaultColorProperty];
      localStorage.setItem(localStorageKey, defaultColor);
      applySettings();
      if (presetSelect) {
        presetSelect.value = getCurrentPresetName();
      }
    });
  }
}
// Writing Area Background Color controls
setupColorPicker(
  writingAreaBgColorPicker,
  "writingAreaBgColor",
  "writingAreaBg",
  resetWritingAreaBgColorButton
);

// Writing Area Text Color controls
setupColorPicker(
  writingAreaTextColorPicker,
  "writingAreaTextColor",
  "writingAreaText",
  resetWritingAreaTextColorButton
);

// Accent Color controls
setupColorPicker(
  accentColorPicker,
  "accentColor",
  "accent",
  resetAccentColorButton
);

// Background Color controls
setupColorPicker(bgColorPicker, "appBgColor", "bg", resetBgColorButton);

// App Text Color controls
setupColorPicker(
  appTextColorPicker,
  "appTextColor",
  "text",
  resetAppTextColorButton
);

// Markdown View Text Color controls
setupColorPicker(
  markdownViewTextColorPicker,
  "markdownViewTextColor",
  "markdownViewText",
  resetMarkdownViewTextColorButton
);

// Control Bar Button Background Color controls
setupColorPicker(
  controlBarButtonBgColorPicker,
  "controlBarButtonBgColor",
  "controlBarButtonBg",
  resetControlBarButtonBgColorButton
);

// Control Bar Button Icon Color controls
setupColorPicker(
  controlBarButtonIconColorPicker,
  "controlBarButtonIconColor",
  "controlBarButtonIcon",
  resetControlBarButtonIconColorButton
);

// Writing Area Placeholder
writingAreaPlaceholderInput.addEventListener("input", (e) => {
  // Only update placeholder text if random placeholder is NOT active
  if (!appSettings.useRandomPlaceholder) {
    updateSetting("writingAreaPlaceholder", e.target.value);
  }
});

resetWritingAreaPlaceholderButton.addEventListener("click", () => {
  updateSetting(
    "writingAreaPlaceholder",
    defaultSettings.writingAreaPlaceholder
  );
  // reset the random placeholder toggle
  updateSetting("useRandomPlaceholder", defaultSettings.useRandomPlaceholder);
});

// Event listener for the "Use Random Placeholder" toggle
if (useRandomPlaceholderToggle) {
  useRandomPlaceholderToggle.addEventListener("change", (e) => {
    const checked = e.target.checked;
    updateSetting("useRandomPlaceholder", checked);
    // If toggled ON, the input will be disabled and cleared by applySettings()
    // If toggled OFF, applySettings() will re-enable the input and set its value.
  });
}

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
  const { pages, currentPageId: initialCurrentPageId } = loadPages();
  loadCurrentPageContent();
  updateCounts();

  loadSettings(); // Loads non-color settings into appSettings
  applySettings(); // Applies all non-color settings AND calls applyAllColors

  initPresetsDropdown();
  setupButtonOrder();
  updateFullScreenIcon();
  setupExportImportFeatures();

  renderPagesList();
});

// service worker for offline support, need testing
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Register the Service Worker with  current scope of repo name in Github Pages
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((err) => {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}
