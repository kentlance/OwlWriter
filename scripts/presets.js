import { applySettings, loadSettings, saveSettings } from "./main.js";
import { applyAllColors, defaultColors, getSystemTheme } from "./colors.js";

const presetSelect = document.getElementById("presetSelect");
const accentColorPicker = document.getElementById("accentColorPicker");
const bgColorPicker = document.getElementById("bgColorPicker");
const appTextColorPicker = document.getElementById("appTextColorPicker");
const writingAreaBgColorPicker = document.getElementById(
  "writingAreaBgColorPicker"
);
const writingAreaTextColorPicker = document.getElementById(
  "writingAreaTextColorPicker"
);
const markdownViewTextColorPicker = document.getElementById(
  "markdownViewTextColorPicker"
);

// Exported for main.js to update values when a preset is applied
export {
  accentColorPicker,
  bgColorPicker,
  appTextColorPicker,
  writingAreaBgColorPicker,
  writingAreaTextColorPicker,
  markdownViewTextColorPicker,
  presetSelect,
};

const presets = {
  Default: {
    settings: {
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
    },
    colors: {
      accentColor: defaultColors.dark.accent,
      appBgColor: defaultColors.dark.bg,
      appTextColor: defaultColors.dark.text,
      writingAreaBgColor: defaultColors.dark.writingAreaBg,
      writingAreaTextColor: defaultColors.dark.writingAreaText,
      markdownViewTextColor: defaultColors.dark.markdownViewText,
    },
  },
  Light: {
    settings: {
      documentPanelWidth: 896,
      writingAreaFontFamily: "serif",
      fontSize: 18,
      writingAreaTextAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.6,
      wordSpacing: 0,
      markdownViewFontSize: 16,
      markdownViewTextAlign: "left",
      isWordCountVisible: true,
      hideControlBarOnHover: false,
    },
    colors: {
      accentColor: "#60a5fa",
      appBgColor: "#ffffff",
      appTextColor: "#adc9ff",
      writingAreaBgColor: "#f9fafb",
      writingAreaTextColor: "#1f2937",
      markdownViewTextColor: "#1f2937",
    },
  },
  "Minimalist - Light": {
    settings: {
      documentPanelWidth: 700,
      writingAreaFontFamily: "system-sans",
      fontSize: 16,
      writingAreaTextAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.6,
      wordSpacing: 0,
      markdownViewFontSize: 16,
      markdownViewTextAlign: "left",
      isWordCountVisible: false,
      hideControlBarOnHover: true,
    },
    colors: {
      accentColor: "#60a5fa",
      appBgColor: "#ffffff",
      appTextColor: "#ffffff",
      writingAreaBgColor: "#f9fafb",
      writingAreaTextColor: "#1f2937",
      markdownViewTextColor: "#1f2937",
    },
  },
  "Minimalist - Dark": {
    settings: {
      documentPanelWidth: 700,
      writingAreaFontFamily: "system-sans",
      fontSize: 16,
      writingAreaTextAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.6,
      wordSpacing: 0,
      markdownViewFontSize: 16,
      markdownViewTextAlign: "left",
      isWordCountVisible: false,
      hideControlBarOnHover: true,
    },
    colors: {
      accentColor: "#93c5fd",
      appBgColor: "#1a202c",
      appTextColor: "#e2e8f0",
      writingAreaBgColor: "#2d3748",
      writingAreaTextColor: "#f8fafc",
      markdownViewTextColor: "#f8fafc",
    },
  },
  Tea: {
    settings: {
      documentPanelWidth: 800,
      writingAreaFontFamily: "serif",
      fontSize: 19,
      writingAreaTextAlign: "justify",
      letterSpacing: 0.02,
      lineHeight: 1.7,
      wordSpacing: 2,
      markdownViewFontSize: 17,
      markdownViewTextAlign: "justify",
      isWordCountVisible: true,
      hideControlBarOnHover: false,
    },
    colors: {
      accentColor: "#a3b18a",
      appBgColor: "#fefae0",
      appTextColor: "#eabfa4",
      writingAreaBgColor: "#fffbe6",
      writingAreaTextColor: "#6c584c",
      markdownViewTextColor: "#6c584c",
    },
  },
  Sky: {
    settings: {
      documentPanelWidth: 900,
      writingAreaFontFamily: "inter",
      fontSize: 17,
      writingAreaTextAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.5,
      wordSpacing: 0,
      markdownViewFontSize: 17,
      markdownViewTextAlign: "left",
      isWordCountVisible: true,
      hideControlBarOnHover: false,
    },
    colors: {
      accentColor: "#67e8f9",
      appBgColor: "#e0f2f7",
      appTextColor: "#67e8f9",
      writingAreaBgColor: "#ffffff",
      writingAreaTextColor: "#083344",
      markdownViewTextColor: "#083344",
    },
  },
};

export function applyPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) {
    console.warn(`Preset "${presetName}" not found.`);
    return;
  }

  for (const key in preset.settings) {
    localStorage.setItem(key, preset.settings[key]);
  }

  for (const key in preset.colors) {
    localStorage.setItem(key, preset.colors[key]);
  }

  loadSettings();
  applySettings();

  accentColorPicker.value =
    localStorage.getItem("accentColor") ||
    defaultColors[getSystemTheme()].accent;
  bgColorPicker.value =
    localStorage.getItem("appBgColor") || defaultColors[getSystemTheme()].bg;
  appTextColorPicker.value =
    localStorage.getItem("appTextColor") ||
    defaultColors[getSystemTheme()].text;
  writingAreaBgColorPicker.value =
    localStorage.getItem("writingAreaBgColor") ||
    defaultColors[getSystemTheme()].writingAreaBg;
  writingAreaTextColorPicker.value =
    localStorage.getItem("writingAreaTextColor") ||
    defaultColors[getSystemTheme()].writingAreaText;
  markdownViewTextColorPicker.value =
    localStorage.getItem("markdownViewTextColor") ||
    defaultColors[getSystemTheme()].markdownViewText;

  if (presetSelect) {
    presetSelect.value = presetName;
  }
}

export function initPresetsDropdown() {
  if (!presetSelect) {
    console.error("Preset select dropdown not found.");
    return;
  }

  for (const name in presets) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    presetSelect.appendChild(option);
  }

  const customOption = document.createElement("option");
  customOption.value = "Custom";
  customOption.textContent = "Custom";
  presetSelect.appendChild(customOption);

  presetSelect.value = getCurrentPresetName();

  presetSelect.addEventListener("change", (e) => {
    applyPreset(e.target.value);
  });
}

export function getCurrentPresetName() {
  const currentSettingsFromLS = {};
  for (const key of Object.keys(presets.Default.settings)) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      if (typeof presets.Default.settings[key] === "boolean") {
        currentSettingsFromLS[key] = value === "true";
      } else if (typeof presets.Default.settings[key] === "number") {
        currentSettingsFromLS[key] = parseFloat(value);
      } else {
        currentSettingsFromLS[key] = value;
      }
    } else {
      currentSettingsFromLS[key] = presets.Default.settings[key];
    }
  }

  const currentColorsFromLS = {};
  for (const key of Object.keys(presets.Default.colors)) {
    const value = localStorage.getItem(key);
    currentColorsFromLS[key] =
      value !== null
        ? value
        : defaultColors[getSystemTheme()][key.replace("Color", "")];
  }

  for (const presetName in presets) {
    const preset = presets[presetName];

    let settingsMatch = true;
    for (const key in preset.settings) {
      if (currentSettingsFromLS[key] !== preset.settings[key]) {
        settingsMatch = false;
        break;
      }
    }

    let colorsMatch = true;
    if (settingsMatch) {
      for (const key in preset.colors) {
        if (currentColorsFromLS[key] !== preset.colors[key]) {
          colorsMatch = false;
          break;
        }
      }
    }

    if (settingsMatch && colorsMatch) {
      return presetName;
    }
  }

  return "Custom";
}
