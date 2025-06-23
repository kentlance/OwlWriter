import { appSettings, saveSettings, applySettings } from "./main.js";
import { applyAllColors } from "./colors.js";
import { initPresetsDropdown, presetSelect } from "./presets.js";

// DOM Elements for Export/Import
const exportThemeButton = document.getElementById("exportThemeButton");
const importThemeInput = document.getElementById("importThemeInput");
const importThemeButton = document.getElementById("importThemeButton");
const userThemesList = document.getElementById("userThemesList");

// Constants for localStorage
const USER_PRESETS_STORAGE_KEY = "userPresets";

// Utility Function

// Function to get current color values directly from CSS variables
function getCurrentColors() {
  const rootStyles = getComputedStyle(document.documentElement);
  return {
    accentColor: rootStyles.getPropertyValue("--accent-color").trim(),
    appBgColor: rootStyles.getPropertyValue("--app-bg-color").trim(),
    appTextColor: rootStyles.getPropertyValue("--app-text-color").trim(),
    writingAreaBgColor: rootStyles
      .getPropertyValue("--writing-area-bg-color")
      .trim(),
    writingAreaTextColor: rootStyles
      .getPropertyValue("--writing-area-text-color")
      .trim(),
    markdownViewTextColor: rootStyles
      .getPropertyValue("--markdown-view-text-color")
      .trim(),
  };
}

// Export Theme
function exportTheme() {
  const themeName = prompt(
    "Enter a name for your custom theme:",
    "My Custom Theme"
  );
  if (!themeName) {
    alert("Theme export cancelled.");
    return;
  }

  // Capture current settings (from appSettings) and current colors (from CSS)
  const exportData = {
    name: themeName,
    settings: { ...appSettings },
    colors: getCurrentColors(),
    // Add a version or timestamp if want future compatibility checks, need feedback
    version: "1.0",
    timestamp: new Date().toISOString(),
  };

  if (
    exportData.settings.writingAreaPlaceholder.startsWith("RANDOM_PLACEHOLDER_")
  ) {
    exportData.settings.writingAreaPlaceholder =
      document.getElementById("writingArea").placeholder;
  }

  const jsonString = JSON.stringify(exportData, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${themeName.toLowerCase().replace(/\s/g, "-")}-theme.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert(`Theme "${themeName}" exported successfully!`);
}

// Import Theme
function importTheme(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedTheme = JSON.parse(e.target.result);

      // Basic validation for the imported theme structure
      if (
        !importedTheme.name ||
        !importedTheme.settings ||
        !importedTheme.colors
      ) {
        alert("Invalid theme file format. Missing name, settings, or colors.");
        return;
      }

      // Load existing user presets
      const userPresets = getUserPresets();

      // Check for duplicate names
      if (userPresets.some((p) => p.name === importedTheme.name)) {
        if (
          !confirm(
            `A theme named "${importedTheme.name}" already exists. Do you want to overwrite it?`
          )
        ) {
          return;
        }
        // Overwrite existing theme
        const index = userPresets.findIndex(
          (p) => p.name === importedTheme.name
        );
        userPresets[index] = importedTheme;
      } else {
        userPresets.push(importedTheme);
      }

      saveUserPresets(userPresets);
      alert(`Theme "${importedTheme.name}" imported successfully!`);

      // Re-initialize the dropdown to show new theme
      initPresetsDropdown();
      if (presetSelect) {
        presetSelect.value = importedTheme.name;
        presetSelect.dispatchEvent(new Event("change")); // Trigger change to apply it
      }
    } catch (error) {
      console.error("Error parsing imported theme JSON:", error);
      alert("Failed to import theme. Invalid JSON file.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

// Local Storage Management for User Presets

export function getUserPresets() {
  try {
    const stored = localStorage.getItem(USER_PRESETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load user presets from localStorage:", e);
    return [];
  }
}

function saveUserPresets(presets) {
  try {
    localStorage.setItem(USER_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (e) {
    console.error("Failed to save user presets to localStorage:", e);
  }
}

// Management UI for Imported Themes
function renderUserThemesList() {
  if (!userThemesList) return;

  userThemesList.innerHTML = "";
  const userPresets = getUserPresets();

  if (userPresets.length === 0) {
    userThemesList.textContent = "No imported themes yet.";
    return;
  }

  userPresets.forEach((preset) => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between py-1"; // basic styling
    li.innerHTML = `
            <span>${preset.name}</span>
            <button data-theme-name="${preset.name}" class="text-red-500 hover:text-red-700 ml-4">Delete</button>
        `;
    userThemesList.appendChild(li);
  });

  userThemesList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("button[data-theme-name]");
    if (deleteButton) {
      const themeNameToDelete = deleteButton.dataset.themeName;
      if (confirm(`Are you sure you want to delete "${themeNameToDelete}"?`)) {
        deleteUserPreset(themeNameToDelete);
      }
    }
  });
}

function deleteUserPreset(themeName) {
  let userPresets = getUserPresets();
  const originalLength = userPresets.length;
  userPresets = userPresets.filter((p) => p.name !== themeName);

  if (userPresets.length < originalLength) {
    saveUserPresets(userPresets);
    alert(`Theme "${themeName}" deleted.`);
    initPresetsDropdown(); // Re-populate dropdown
    renderUserThemesList(); // Re-render management list

    // If the deleted theme was currently selected, revert to 'Custom' or 'Default'
    if (presetSelect && presetSelect.value === themeName) {
      presetSelect.value = "Custom"; // Or 'Default', or trigger current preset detection
      presetSelect.dispatchEvent(new Event("change"));
    }
  } else {
    alert(`Theme "${themeName}" not found.`);
  }
}

// Initialization
export function setupExportImportFeatures() {
  if (exportThemeButton) {
    exportThemeButton.addEventListener("click", exportTheme);
  }

  if (importThemeButton) {
    importThemeButton.addEventListener("click", () => {
      importThemeInput.click(); // Trigger the hidden file input
    });
  }

  if (importThemeInput) {
    importThemeInput.addEventListener("change", importTheme);
  }

  renderUserThemesList();
}
