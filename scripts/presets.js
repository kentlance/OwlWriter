import { applySettings, loadSettings, saveSettings } from "./main.js";
import { defaultSettings } from "./settings.js";
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

const randomPlaceholders = [
  "Start writing here...",
  "One word at a time...",
  "Type away!",
  "Get creative!",
  "What's on your mind?",
  `"The poet doesn't invent. He listens." — Jean Cocteau`,
  `"Nobody is a villain in their own story" — George R.R. Martin`,
  `"There is no rule on how to write. Sometimes it comes easily and perfectly; sometimes it's like drilling rock and then blasting it out with charges." — Ernest Hemmingway`,
  `"If I waited for perfection, I wouldn't write a thing" — Margaret Atwood`,
  `"The thing about writing is if you really try, if you do it every day, and you put in your time, you get better." — Francis Ford Coppola`,
  `"You must stay drunk on writing so reality cannot destroy you." — Ray Bradbury`,
  `"Let me live, love, and say it well in good sentences." — Sylvia Plath`,
  `"A word after a word after a word is power." — Margaret Atwood`,
  `"Tears are words that need to be written." — Paul Coelho`,
  `"There is no greater agony than bearing an untold story inside you." — Maya Angelou`,
];

// Get a random placeholder from the randomPlaceholders array
const getRandomDynamicPlaceholder = () => {
  return randomPlaceholders[
    Math.floor(Math.random() * randomPlaceholders.length)
  ];
};

const presets = {
  Default: {
    // Reference defaultSettings directly from settings.js
    settings: defaultSettings,
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
      ...defaultSettings,
      lineHeight: 1.6, // Only override this one property
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
      controlBarButtonOpacity: 0.8,
      writingAreaPlaceholder: " ",
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
      controlBarButtonOpacity: 0.8,
      writingAreaPlaceholder: " ",
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
      controlBarButtonOpacity: 1,
      // use naming convention "RANDOM_PLACEHOLDER_" + preset name to indicate a random placeholder on that preset
      writingAreaPlaceholder: "RANDOM_PLACEHOLDER_TEA",
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
      controlBarButtonOpacity: 1,
      // use naming convention "RANDOM_PLACEHOLDER_" + preset name to indicate a random placeholder on that preset
      writingAreaPlaceholder: "RANDOM_PLACEHOLDER_SKY",
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

  // Define all possible setting keys to ensure consistency and fallback to Default
  const allSettingKeys = [
    "documentPanelWidth",
    "writingAreaFontFamily",
    "fontSize",
    "writingAreaTextAlign",
    "letterSpacing",
    "lineHeight",
    "wordSpacing",
    "markdownViewFontSize",
    "markdownViewTextAlign",
    "isWordCountVisible",
    "hideControlBarOnHover",
    "controlBarButtonOpacity",
    "writingAreaPlaceholder",
  ];

  for (const key of allSettingKeys) {
    let valueToSet;
    // Check if the current preset's placeholder is one of the ones that need random placeholder
    if (
      key === "writingAreaPlaceholder" &&
      (preset.settings[key] === "RANDOM_PLACEHOLDER_TEA" ||
        preset.settings[key] === "RANDOM_PLACEHOLDER_SKY")
    ) {
      valueToSet = getRandomDynamicPlaceholder(); // Generate a random one
    } else {
      // Otherwise, use the preset's value or fallback to Default if not defined
      valueToSet =
        preset.settings[key] !== undefined
          ? preset.settings[key]
          : presets.Default.settings[key];
    }
    localStorage.setItem(key, valueToSet);
  }

  // Apply colors from the preset
  for (const key in preset.colors) {
    localStorage.setItem(key, preset.colors[key]);
  }

  loadSettings();
  applySettings();

  // Update color picker values in the settings panel to reflect the preset colors
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

  // Clear existing options before adding to prevent duplicates on re-init
  presetSelect.innerHTML = "";

  for (const name in presets) {
    // Only add the explicit presets defined in the `presets` object
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    presetSelect.appendChild(option);
  }

  const customOption = document.createElement("option");
  customOption.value = "Custom";
  customOption.textContent = "Custom";
  presetSelect.appendChild(customOption);

  // Set the initial value of the dropdown based on current settings
  presetSelect.value = getCurrentPresetName();

  presetSelect.addEventListener("change", (e) => {
    applyPreset(e.target.value);
  });
}

export function getCurrentPresetName() {
  const currentSettingsFromLS = {};
  // Define all possible setting keys. This ensures we check all settings for a match.
  const allSettingKeys = [
    "documentPanelWidth",
    "writingAreaFontFamily",
    "fontSize",
    "writingAreaTextAlign",
    "letterSpacing",
    "lineHeight",
    "wordSpacing",
    "markdownViewFontSize",
    "markdownViewTextAlign",
    "isWordCountVisible",
    "hideControlBarOnHover",
    "controlBarButtonOpacity",
    "writingAreaPlaceholder",
  ];

  // Get current settings from localStorage or fallback to Default preset's values
  for (const key of allSettingKeys) {
    const value = localStorage.getItem(key);
    // Use the default value from the 'Default' preset for type reference and fallback
    const defaultValue = presets.Default.settings[key];

    if (value !== null) {
      if (typeof defaultValue === "boolean") {
        currentSettingsFromLS[key] = value === "true";
      } else if (typeof defaultValue === "number") {
        currentSettingsFromLS[key] = parseFloat(value);
      } else {
        currentSettingsFromLS[key] = value;
      }
    } else {
      // If not in localStorage, use the default from the 'Default' preset
      currentSettingsFromLS[key] = defaultValue;
    }
  }

  // Get current colors from localStorage or default
  const currentColorsFromLS = {};
  for (const key of Object.keys(presets.Default.colors)) {
    const value = localStorage.getItem(key);
    currentColorsFromLS[key] =
      value !== null
        ? value
        : defaultColors[getSystemTheme()][key.replace("Color", "")];
  }

  // Compare current settings and colors against each defined preset
  for (const presetName in presets) {
    const preset = presets[presetName];

    let settingsMatch = true;
    for (const key in preset.settings) {
      // Special handling for writingAreaPlaceholder when it's meant to be random
      if (
        key === "writingAreaPlaceholder" &&
        (preset.settings[key] === "RANDOM_PLACEHOLDER_TEA" ||
          preset.settings[key] === "RANDOM_PLACEHOLDER_SKY")
      ) {
        const currentPlaceholder = currentSettingsFromLS[key];

        // Check if the current placeholder matches any *fixed* placeholder from *any other preset*
        const isCurrentPlaceholderFixedInOtherPreset = Object.keys(
          presets
        ).some((otherPresetName) => {
          if (otherPresetName === presetName) return false; // Don't compare against itself
          const otherPreset = presets[otherPresetName];
          const otherPresetPlaceholder =
            otherPreset.settings.writingAreaPlaceholder;
          // Only compare if the other preset's placeholder is *not* a random chosen placeholder
          return (
            otherPresetPlaceholder !== "RANDOM_PLACEHOLDER_TEA" &&
            otherPresetPlaceholder !== "RANDOM_PLACEHOLDER_SKY" &&
            otherPresetPlaceholder === currentPlaceholder
          );
        });

        if (isCurrentPlaceholderFixedInOtherPreset) {
          // If the current placeholder IS a fixed one from another preset, then this random-placeholder preset does NOT match.
          settingsMatch = false;
          break;
        }
        // If it's NOT a fixed placeholder from another preset, it *could* be
        // a random one set by this preset, so we allow it to proceed as a match for this key.
        continue; // Skip direct value comparison
      }

      // Perform direct comparison for all other settings
      if (currentSettingsFromLS[key] !== preset.settings[key]) {
        settingsMatch = false;
        break;
      }
    }

    let colorsMatch = true;
    if (settingsMatch) {
      // Only check colors if settings match so far
      for (const key in preset.colors) {
        if (currentColorsFromLS[key] !== preset.colors[key]) {
          colorsMatch = false;
          break;
        }
      }
    }

    if (settingsMatch && colorsMatch) {
      return presetName; // Found a matching preset
    }
  }

  return "Custom"; // No matching preset found
}
