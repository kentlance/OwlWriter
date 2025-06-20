import { writingArea, updateCounts, showCopyMessage } from "./main.js";

const importButton = document.getElementById("importButton");
const fileInput = document.getElementById("fileInput");
const importPromptModal = document.getElementById("importPromptModal");
const closeImportPromptModal = document.getElementById(
  "closeImportPromptModal"
);
const importOverrideButton = document.getElementById("importOverride");
const importAtCursorButton = document.getElementById("importAtCursor");
const importAtStartButton = document.getElementById("importAtStart");
const importAtBottomButton = document.getElementById("importAtBottom");

let importedContent = "";

function showImportPromptModal() {
  importPromptModal.classList.remove("hidden");
  document.getElementById("overlay").classList.remove("hidden");
}

function hideImportPromptModal() {
  importPromptModal.classList.add("hidden");
  document.getElementById("overlay").classList.add("hidden");
  fileInput.value = "";
}

// Places content into the writing area based on the chosen method 'override', 'cursor', 'start', 'bottom'.

function placeContentInWritingArea(content, method) {
  const currentContent = writingArea.value;
  let newContent = currentContent;

  switch (method) {
    case "override":
      newContent = content;
      break;
    case "cursor":
      const start = writingArea.selectionStart;
      const end = writingArea.selectionEnd;
      newContent =
        currentContent.substring(0, start) +
        content +
        currentContent.substring(end);
      writingArea.value = newContent;
      writingArea.selectionStart = writingArea.selectionEnd =
        start + content.length;
      break;
    case "start":
      newContent = content + "\n" + currentContent;
      break;
    case "bottom":
      newContent = currentContent + "\n" + content;
      break;
    default:
      console.error("Unknown import method:", method);
      return;
  }

  writingArea.value = newContent;
  updateCounts();
  showCopyMessage("Content Imported!");
  hideImportPromptModal();
}

importButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    importedContent = e.target.result;

    if (writingArea.value.trim().length > 0) {
      showImportPromptModal();
    } else {
      placeContentInWritingArea(importedContent, "override");
    }
  };

  reader.onerror = (e) => {
    console.error("Error reading file:", e);
    showCopyMessage("Error importing file.");
  };

  reader.readAsText(file);
});

closeImportPromptModal.addEventListener("click", hideImportPromptModal);

importOverrideButton.addEventListener("click", () => {
  placeContentInWritingArea(importedContent, "override");
});

importAtCursorButton.addEventListener("click", () => {
  placeContentInWritingArea(importedContent, "cursor");
});

importAtStartButton.addEventListener("click", () => {
  placeContentInWritingArea(importedContent, "start");
});

importAtBottomButton.addEventListener("click", () => {
  placeContentInWritingArea(importedContent, "bottom");
});
