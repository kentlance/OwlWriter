import {
  applySettings,
  loadSettings,
  saveSettings,
  appSettings,
} from "./main.js";
import { defaultSettings } from "./settings.js";
import { applyAllColors, defaultColors, getSystemTheme } from "./colors.js";
import { getUserPresets } from "./exportImportTheme.js";

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
const controlBarButtonBgColorPicker = document.getElementById(
  "controlBarButtonBgColorPicker"
);
const controlBarButtonIconColorPicker = document.getElementById(
  "controlBarButtonIconColorPicker"
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
  controlBarButtonBgColorPicker,
  controlBarButtonIconColorPicker,
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
  `"Writing is the painting of the voice" — Voltaire`,
  `"I know nothing in the world that has as much power as a word. Sometimes I write one, and look at it, until it shines." — Emily Dickinson`,
];

// Get a random placeholder from the randomPlaceholders array
const getRandomDynamicPlaceholder = () => {
  return randomPlaceholders[
    Math.floor(Math.random() * randomPlaceholders.length)
  ];
};

const mapColorNames = (colors) => ({
  accentColor: colors.accent,
  appBgColor: colors.bg,
  appTextColor: colors.text,
  writingAreaBgColor: colors.writingAreaBg,
  writingAreaTextColor: colors.writingAreaText,
  markdownViewTextColor: colors.markdownViewText,
  controlBarButtonBgColor: colors.controlBarButtonBg,
  controlBarButtonIconColor: colors.controlBarButtonIcon,
  sliderTrackBgColor: colors.sliderTrackBg,
});

const builtInPresets = {
  Default: {
    // Reference defaultSettings directly from settings.js
    settings: defaultSettings,
    colors: mapColorNames(defaultColors.dark),
  },
  Light: {
    settings: defaultSettings,
    colors: mapColorNames(defaultColors.light),
  },
  "Minimalist (Dark)": {
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
      showMarkdownPopup: true,
      useRandomPlaceholder: false,
    },
    colors: {
      accentColor: "#60a5fa",
      appBgColor: "#ffffff",
      appTextColor: "#395a9d",
      writingAreaBgColor: "#f9fafb",
      writingAreaTextColor: "#1f2937",
      markdownViewTextColor: "#1f2937",
      controlBarButtonBgColor: "#E2E8F0",
      controlBarButtonIconColor: "#475569",
      sliderTrackBgColor: "#e0e0e0",
    },
  },
  "Minimalist (Dark)": {
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
      showMarkdownPopup: true,
      useRandomPlaceholder: false,
    },
    colors: {
      accentColor: "#518dd2",
      appBgColor: "#1a202c",
      appTextColor: "#e2e8f0",
      writingAreaBgColor: "#2d3748",
      writingAreaTextColor: "#f8fafc",
      markdownViewTextColor: "#f8fafc",
      controlBarButtonBgColor: "#4A4A4A",
      controlBarButtonIconColor: "#FAFAFA",
      sliderTrackBgColor: "#e0e0e0",
    },
  },
  Tea: {
    settings: {
      documentPanelWidth: 800,
      writingAreaFontFamily: "libre-baskerville",
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
      // Use special string for random placeholder with naming convention "RANDOM_PLACEHOLDER_<PRESET_NAME>"
      writingAreaPlaceholder: "RANDOM_PLACEHOLDER_TEA", // will be replaced by getRandomDynamicPlaceholder()
      showMarkdownPopup: true,
      useRandomPlaceholder: true,
    },
    colors: {
      accentColor: "#a3b18a",
      appBgColor: "#fefae0",
      appTextColor: "#d06f33",
      writingAreaBgColor: "#fffbe6",
      writingAreaTextColor: "#6c584c",
      markdownViewTextColor: "#6c584c",
      controlBarButtonBgColor: "#A3B18A",
      controlBarButtonIconColor: "#4A2B0A",
      sliderTrackBgColor: "#e0e0e0",
    },
  },
  Sky: {
    settings: {
      documentPanelWidth: 900,
      writingAreaFontFamily: "raleway",
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
      writingAreaPlaceholder: "RANDOM_PLACEHOLDER_SKY",
      showMarkdownPopup: true,
      useRandomPlaceholder: true,
    },
    colors: {
      accentColor: "#67e8f9",
      appBgColor: "#e0f2f7",
      appTextColor: "#0696aa",
      writingAreaBgColor: "#ffffff",
      writingAreaTextColor: "#083344",
      markdownViewTextColor: "#083344",
      controlBarButtonBgColor: "#B2EBF2",
      controlBarButtonIconColor: "#01579B",
      sliderTrackBgColor: "#e0e0e0",
    },
  },
  Sakura: {
    settings: {
      documentPanelWidth: 850,
      writingAreaFontFamily: "amethysta",
      fontSize: 18,
      writingAreaTextAlign: "left",
      letterSpacing: 0.01,
      lineHeight: 1.6,
      wordSpacing: 0,
      markdownViewFontSize: 17,
      markdownViewTextAlign: "left",
      isWordCountVisible: true,
      hideControlBarOnHover: false,
      controlBarButtonOpacity: 1,
      writingAreaPlaceholder: "RANDOM_PLACEHOLDER_SAKURA",
      showMarkdownPopup: true,
      useRandomPlaceholder: true,
    },
    colors: {
      accentColor: "#f9a8d4",
      appBgColor: "#ffe4e6",
      appTextColor: "#ff7070",
      writingAreaBgColor: "#fff0f5",
      writingAreaTextColor: "#31242c",
      markdownViewTextColor: "#31242c",
      controlBarButtonBgColor: "#FFC0CB",
      controlBarButtonIconColor: "#4A142F",
      sliderTrackBgColor: "#e0e0e0",
    },
  },
  Sunset: {
    settings: {
      documentPanelWidth: 950,
      writingAreaFontFamily: "nunito",
      fontSize: 17,
      writingAreaTextAlign: "center",
      letterSpacing: 0,
      lineHeight: 1.5,
      wordSpacing: 0,
      markdownViewFontSize: 17,
      markdownViewTextAlign: "center",
      isWordCountVisible: true,
      hideControlBarOnHover: true,
      controlBarButtonOpacity: 0.9,
      writingAreaPlaceholder: "RANDOM_PLACEHOLDER_SUNSET",
      showMarkdownPopup: true,
      useRandomPlaceholder: true,
    },
    colors: {
      accentColor: "#fcd34d",
      appBgColor: "#fdba74",
      appTextColor: "#6d28d9",
      writingAreaBgColor: "#fef3c7",
      writingAreaTextColor: "#7f1d1d",
      markdownViewTextColor: "#7f1d1d",
      controlBarButtonBgColor: "#FDBA74",
      controlBarButtonIconColor: "#7C2D12",
      sliderTrackBgColor: "#e0e0e0",
    },
  },
  Cream: {
    settings: {
      documentPanelWidth: 800,
      writingAreaFontFamily: "quicksand",
      fontSize: 19,
      writingAreaTextAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.7,
      wordSpacing: 0,
      markdownViewFontSize: 18,
      markdownViewTextAlign: "left",
      isWordCountVisible: false,
      hideControlBarOnHover: false,
      controlBarButtonOpacity: 1,
      writingAreaPlaceholder: "RANDOM_PLACEHOLDER_CREAM",
      showMarkdownPopup: true,
      useRandomPlaceholder: true,
    },
    colors: {
      accentColor: "#d9f99d",
      appBgColor: "#fffbed",
      appTextColor: "#374151",
      writingAreaBgColor: "#fdfae7",
      writingAreaTextColor: "#374151",
      markdownViewTextColor: "#374151",
      controlBarButtonBgColor: "#E5E5E5",
      controlBarButtonIconColor: "#3F3F46",
      sliderTrackBgColor: "#e0e0e0",
    },
  },
  Neobrutalist: {
    settings: {
      documentPanelWidth: 960,
      writingAreaFontFamily: "monospace",
      fontSize: 18,
      writingAreaTextAlign: "left",
      letterSpacing: 0,
      lineHeight: 1.5,
      wordSpacing: 0,
      markdownViewFontSize: 16,
      markdownViewTextAlign: "left",
      isWordCountVisible: true,
      hideControlBarOnHover: false,
      controlBarButtonOpacity: 1,
      writingAreaPlaceholder: ">> INITIATE DOCUMENTATION SEQUENCE...",
      showMarkdownPopup: true,
      useRandomPlaceholder: false,
    },
    colors: {
      accentColor: "#7A7AFF",
      appBgColor: "#494D6E",
      appTextColor: "#EBEBEB",
      writingAreaBgColor: "#3D3D3D",
      writingAreaTextColor: "#EBEBEB",
      markdownViewTextColor: "#EBEBEB",
      controlBarButtonBgColor: "#3D3D3D",
      controlBarButtonIconColor: "#EBEBEB",
      sliderTrackBgColor: "#e0e0e0",
    },
  },
  Forest: {
    settings: {
      documentPanelWidth: 820,
      writingAreaFontFamily: "raleway",
      fontSize: 18,
      writingAreaTextAlign: "justify",
      letterSpacing: 0.02,
      lineHeight: 1.75,
      wordSpacing: 1,
      markdownViewFontSize: 17,
      markdownViewTextAlign: "justify",
      isWordCountVisible: true,
      hideControlBarOnHover: false,
      controlBarButtonOpacity: 1,
      writingAreaPlaceholder: "RANDOM_PLACEHOLDER_FOREST",
      showMarkdownPopup: true,
      useRandomPlaceholder: true,
    },
    colors: {
      accentColor: "#5e8c61",
      appBgColor: "#d7e8c6",
      appTextColor: "#438b48",
      writingAreaBgColor: "#ffffff",
      writingAreaTextColor: "#2c3a26",
      markdownViewTextColor: "#2c3a26",
      controlBarButtonBgColor: "#d9ead3",
      controlBarButtonIconColor: "#274d32",
      sliderTrackBgColor: "#ccd5ae",
    },
  },
};

// Combine built-in and user-defined presets
function getAllAvailablePresets() {
  const userPresets = getUserPresets();
  const combinedPresets = { ...builtInPresets };

  userPresets.forEach((preset) => {
    if (typeof preset.settings.useRandomPlaceholder === "undefined") {
      preset.settings.useRandomPlaceholder = false; // Default to false if not specified
    }
    // If an imported theme explicitly used the RANDOM_PLACEHOLDER_USER_DEFINED flag,
    // make sure its useRandomPlaceholder property is set to true.
    if (
      preset.settings.writingAreaPlaceholder ===
        "RANDOM_PLACEHOLDER_USER_DEFINED" &&
      !preset.settings.useRandomPlaceholder
    ) {
      preset.settings.useRandomPlaceholder = true;
    } else if (
      preset.settings.writingAreaPlaceholder !==
        "RANDOM_PLACEHOLDER_USER_DEFINED" &&
      preset.settings.useRandomPlaceholder
    ) {
      // If it claims to be random but has a specific placeholder (not the flag), treat it as not random.
      // This is a safeguard against malformed custom themes.
      preset.settings.useRandomPlaceholder = false;
    }

    combinedPresets[preset.name] = preset;
  });

  return combinedPresets;
}

export function applyPreset(presetName) {
  const allPresets = getAllAvailablePresets(); // Use all available presets, including user-defined
  const preset = allPresets[presetName];

  if (!preset) {
    console.warn(`Preset "${presetName}" not found.`);
    return;
  }

  // Determine the actual placeholder text and the random placeholder flag
  let actualPlaceholderValue = preset.settings.writingAreaPlaceholder;
  // Ensure useRandomPlaceholder is a boolean, defaulting to false if undefined
  let useRandomFlag = preset.settings.useRandomPlaceholder || false;

  // If the preset specifies to use a random placeholder
  if (useRandomFlag) {
    actualPlaceholderValue = getRandomDynamicPlaceholder();
  }
  // If useRandomFlag is false, actualPlaceholderValue remains whatever is in preset.settings.writingAreaPlaceholder

  // Update appSettings with the preset's settings
  for (const key of Object.keys(preset.settings)) {
    // Handle writingAreaPlaceholder and useRandomPlaceholder specially
    if (key === "writingAreaPlaceholder") {
      appSettings[key] = actualPlaceholderValue; // Set the resolved placeholder text
    } else if (key === "useRandomPlaceholder") {
      appSettings[key] = useRandomFlag; // Set the boolean flag
    } else {
      appSettings[key] = preset.settings[key];
    }
  }

  // Apply colors from the preset
  for (const key in preset.colors) {
    localStorage.setItem(key, preset.colors[key]);
  }

  saveSettings();
  applySettings(); // This will now correctly set the placeholder and toggle input based on useRandomPlaceholder

  // Update color picker values in the settings panel
  if (accentColorPicker)
    accentColorPicker.value =
      localStorage.getItem("accentColor") ||
      defaultColors[getSystemTheme()].accent;
  if (bgColorPicker)
    bgColorPicker.value =
      localStorage.getItem("appBgColor") || defaultColors[getSystemTheme()].bg;
  if (appTextColorPicker)
    appTextColorPicker.value =
      localStorage.getItem("appTextColor") ||
      defaultColors[getSystemTheme()].text;
  if (writingAreaBgColorPicker)
    writingAreaBgColorPicker.value =
      localStorage.getItem("writingAreaBgColor") ||
      defaultColors[getSystemTheme()].writingAreaBg;
  if (writingAreaTextColorPicker)
    writingAreaTextColorPicker.value =
      localStorage.getItem("writingAreaTextColor") ||
      defaultColors[getSystemTheme()].writingAreaText;
  if (markdownViewTextColorPicker)
    markdownViewTextColorPicker.value =
      localStorage.getItem("markdownViewTextColor") ||
      defaultColors[getSystemTheme()].markdownViewText;
  if (controlBarButtonBgColorPicker)
    controlBarButtonBgColorPicker.value =
      localStorage.getItem("controlBarButtonBgColor") ||
      defaultColors[getSystemTheme()].controlBarButtonBg ||
      defaultColors[getSystemTheme()].accent;
  if (controlBarButtonIconColorPicker)
    controlBarButtonIconColorPicker.value =
      localStorage.getItem("controlBarButtonIconColor") ||
      defaultColors[getSystemTheme()].controlBarButtonIcon ||
      defaultColors[getSystemTheme()].text;
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

  const allPresets = getAllAvailablePresets();

  // Sort presets: Default and Light first, then others alphabetically
  const sortedPresetNames = Object.keys(allPresets).sort((a, b) => {
    if (a === "Default") return -1;
    if (b === "Default") return 1;
    if (a === "Light") return -1;
    if (b === "Light") return 1;
    return a.localeCompare(b);
  });

  sortedPresetNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    presetSelect.appendChild(option);
  });

  const customOption = document.createElement("option");
  customOption.value = "Custom";
  customOption.textContent = "Custom";
  presetSelect.appendChild(customOption);

  // Set the initial value of the dropdown based on current settings
  presetSelect.value = getCurrentPresetName();

  presetSelect.removeEventListener("change", handlePresetChange);
  presetSelect.addEventListener("change", handlePresetChange);
}

function handlePresetChange(e) {
  applyPreset(e.target.value);
}

export function getCurrentPresetName() {
  const allPresets = getAllAvailablePresets();
  const currentTheme = getSystemTheme();

  // 1. Get current SETTINGS from localStorage with type conversion
  const currentSettingsFromLS = {};
  const settingKeysToCompare = [
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
    "showMarkdownPopup",
    "useRandomPlaceholder",
  ];

  settingKeysToCompare.forEach((key) => {
    const lsValue = localStorage.getItem(key);
    // Convert localStorage string values back to their expected types for comparison
    if (lsValue === null) {
      currentSettingsFromLS[key] = defaultSettings[key]; // Fallback to defaultSettings
    } else if (
      key === "isWordCountVisible" ||
      key === "hideControlBarOnHover" ||
      key === "showMarkdownPopup" ||
      key === "useRandomPlaceholder"
    ) {
      currentSettingsFromLS[key] = lsValue === "true";
    } else if (
      key === "documentPanelWidth" ||
      key === "fontSize" ||
      key === "markdownViewFontSize"
    ) {
      currentSettingsFromLS[key] = parseInt(lsValue);
    } else if (
      key === "letterSpacing" ||
      key === "lineHeight" ||
      key === "wordSpacing" ||
      key === "controlBarButtonOpacity"
    ) {
      currentSettingsFromLS[key] = parseFloat(lsValue);
    } else {
      currentSettingsFromLS[key] = lsValue;
    }
  });

  // Get current colors from localStorage
  const currentColorsFromLS = {};
  const allColorKeys = [
    "accentColor",
    "appBgColor",
    "appTextColor",
    "writingAreaBgColor",
    "writingAreaTextColor",
    "markdownViewTextColor",
    "controlBarButtonBgColor",
    "controlBarButtonIconColor",
    "sliderTrackBgColor",
  ];

  allColorKeys.forEach((key) => {
    const lsValue = localStorage.getItem(key);
    if (lsValue === null) {
      const defaultColorMap = {
        accentColor: "accent",
        appBgColor: "bg",
        appTextColor: "text",
        writingAreaBgColor: "writingAreaBg",
        writingAreaTextColor: "writingAreaText",
        markdownViewTextColor: "markdownViewText",
        controlBarButtonBgColor: "controlBarButtonBg",
        controlBarButtonIconColor: "controlBarButtonIcon",
        sliderTrackBgColor: "sliderTrackBg",
      };
      // Fallback to defaultColors for current system theme if localStorage item is missing
      currentColorsFromLS[key] =
        defaultColors[currentTheme][defaultColorMap[key]];
    } else {
      currentColorsFromLS[key] = lsValue;
    }
  });

  for (const presetName in allPresets) {
    const preset = allPresets[presetName];

    let settingsMatch = true;
    for (const key of settingKeysToCompare) {
      let presetSettingValue = preset.settings[key];
      let currentSettingValue = currentSettingsFromLS[key];

      // Special handling for useRandomPlaceholder and writingAreaPlaceholder
      if (key === "useRandomPlaceholder") {
        if (presetSettingValue !== currentSettingValue) {
          settingsMatch = false;
          break;
        }
      } else if (key === "writingAreaPlaceholder") {
        const presetUsesRandom = preset.settings.useRandomPlaceholder;
        const currentUsesRandom = currentSettingsFromLS.useRandomPlaceholder;

        if (presetUsesRandom && currentUsesRandom) {
          // both are random, match
          continue;
        } else if (presetUsesRandom !== currentUsesRandom) {
          // only one is random, not match
          settingsMatch = false;
          break;
        } else {
          // both not random, comppare placeholder explicitly
          if (currentSettingValue !== presetSettingValue) {
            settingsMatch = false;
            break;
          }
        }
      } else if (
        typeof presetSettingValue === "number" &&
        !Number.isInteger(presetSettingValue)
      ) {
        if (Math.abs(currentSettingValue - presetSettingValue) > 0.0001) {
          settingsMatch = false;
          break;
        }
      } else if (currentSettingValue !== presetSettingValue) {
        settingsMatch = false;
        break;
      }
    }

    let colorsMatch = true;
    if (settingsMatch) {
      for (const key of allColorKeys) {
        let presetColorValue;
        if (preset.colors.hasOwnProperty(key)) {
          presetColorValue = preset.colors[key];
        } else {
          const defaultColorMap = {
            accentColor: "accent",
            appBgColor: "bg",
            appTextColor: "text",
            writingAreaBgColor: "writingAreaBg",
            writingAreaTextColor: "writingAreaText",
            markdownViewTextColor: "markdownViewText",
            controlBarButtonBgColor: "controlBarButtonBg",
            controlBarButtonIconColor: "controlBarButtonIcon",
            sliderTrackBgColor: "sliderTrackBg",
          };
          presetColorValue = defaultColors[currentTheme][defaultColorMap[key]];
        }

        if (currentColorsFromLS[key] !== presetColorValue) {
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
