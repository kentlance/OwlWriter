const writingArea = document.getElementById("writingArea");
const markdownOutput = document.getElementById("markdownOutput");
const markdownViewButton = document.getElementById("markdownViewButton");
const markdownHighlightPopup = document.getElementById(
  "markdownHighlightPopup"
);

// marked js
marked.setOptions({
  breaks: true,
  gfm: true,
  sanitize: true,
});

let isMarkdownViewActive = false; // false = writing area active, true = markdown view active
let lastPointerCoords = { x: 0, y: 0, type: "" }; // Stores last pointer position and type

function renderMarkdown() {
  markdownOutput.innerHTML = marked.parse(writingArea.value);
}

function toggleMarkdownView() {
  isMarkdownViewActive = !isMarkdownViewActive;

  if (isMarkdownViewActive) {
    renderMarkdown(); // Render before showing
    writingArea.style.display = "none";
    markdownOutput.style.display = "block";
    hideMarkdownPopup(); // Hide popup when switching to markdown view
  } else {
    markdownOutput.style.display = "none";
    writingArea.style.display = "block";
    writingArea.focus();
  }
  localStorage.setItem("isMarkdownViewActive", isMarkdownViewActive);
}

// Apply Markdown formatting to  selected text or insert at cursor in textarea
function applyFormatting(before, after = "") {
  const start = writingArea.selectionStart;
  const end = writingArea.selectionEnd;
  const selectedText = writingArea.value.substring(start, end);

  const newValue =
    writingArea.value.substring(0, start) +
    before +
    selectedText +
    after +
    writingArea.value.substring(end);

  writingArea.value = newValue;

  // Reposition cursor
  if (selectedText.length === 0) {
    writingArea.selectionStart = writingArea.selectionEnd =
      start + before.length;
  } else {
    writingArea.selectionStart = start;
    writingArea.selectionEnd = end + before.length + after.length;
  }

  writingArea.focus();
  writingArea.dispatchEvent(new Event("input")); // Trigger input event for counts/rendering
  hideMarkdownPopup(); // Hide popup after applying formatting
}

// Popup Logic
// showMarkdownPopup expects pixel values
function showMarkdownPopup(x, y) {
  markdownHighlightPopup.style.left = `${x}px`;
  markdownHighlightPopup.style.top = `${y}px`;
  markdownHighlightPopup.classList.remove("hidden");
}

function hideMarkdownPopup() {
  markdownHighlightPopup.classList.add("hidden");
  console.log(
    "[hideMarkdownPopup] Hiding popup and resetting lastPointerCoords."
  );
  lastPointerCoords = { x: 0, y: 0, type: "" }; // Reset coordinates when popup hides
}

// Store pointer coordinates on pointerup in the writing area
writingArea.addEventListener("pointerup", (e) => {
  const currentSelectionLength =
    writingArea.selectionEnd - writingArea.selectionStart;

  if (currentSelectionLength > 0) {
    lastPointerCoords.x = e.clientX;
    lastPointerCoords.y = e.clientY;
    lastPointerCoords.type = e.pointerType; // mouse, touch, or pen

    // add delay to make sure the pointerup event has been processed
    setTimeout(handleDocumentSelectionChange, 10);
  }
});

// calculate popup position based on input type
function calculatePopupPosition() {
  const popupWidth = markdownHighlightPopup.offsetWidth;
  const popupHeight = markdownHighlightPopup.offsetHeight;

  let popupX, popupY;

  // Try to position based on the last pointer event if valid (mouse, touch, pen)
  if (
    lastPointerCoords.type === "mouse" ||
    lastPointerCoords.type === "touch" ||
    lastPointerCoords.type === "pen"
  ) {
    // Position relative to the pointer coordinates
    popupX = lastPointerCoords.x - popupWidth / 2; // Center horizontally over pointer
    popupY = lastPointerCoords.y - popupHeight - 18; // 10px above pointer

    // Ensure popup stays within viewport bounds for pointer-based positioning
    if (popupY < 0) {
      popupY = lastPointerCoords.y + 10; // Fallback: below pointer if off-screen top
    }

    // Keep within horizontal bounds
    if (popupX < 0) {
      popupX = 0;
    }
    if (popupX + popupWidth > window.innerWidth) {
      popupX = window.innerWidth - popupWidth;
    }
    if (popupY + popupHeight > window.innerHeight) {
      popupY = window.innerHeight - popupHeight;
    }
  } else {
    // Fixed position using vw/vh (for keyboard selection or if no pointer event)
    const TOP_OFFSET_VH = 7;
    const LEFT_OFFSET_VW = 15;

    popupX = (window.innerWidth * LEFT_OFFSET_VW) / 100;
    popupY = (window.innerHeight * TOP_OFFSET_VH) / 100;

    // Ensure fixed popup stays within horizontal bounds if screen is narrow
    if (popupX + popupWidth > window.innerWidth) {
      popupX = window.innerWidth - popupWidth - 10;
      if (popupX < 0) popupX = 0;
    }
  }
  return { x: popupX, y: popupY };
}

// handle selection detection
function handleDocumentSelectionChange() {
  // Only show the popup if the writing area is currently displayed
  if (writingArea.style.display === "none") {
    hideMarkdownPopup();
    return;
  }

  const selectedText = writingArea.value.substring(
    writingArea.selectionStart,
    writingArea.selectionEnd
  );

  console.log(
    `[handleDocumentSelectionChange] Selected text length: ${selectedText.length}`
  );
  console.log(
    `[handleDocumentSelectionChange] Active element:`,
    document.activeElement
  );

  // Check if text is selected within the writingArea and it is the active element
  if (selectedText.length > 0 && document.activeElement === writingArea) {
    console.log(
      "[handleDocumentSelectionChange] Text selected in writing area."
    );
    const { x, y } = calculatePopupPosition(); // Get calculated position
    showMarkdownPopup(x, y);
  } else {
    console.log(
      "[handleDocumentSelectionChange] No text selected or writing area not active, hiding popup."
    );
    hideMarkdownPopup();
  }
}

// selection changes across the document
document.addEventListener("selectionchange", handleDocumentSelectionChange);

// hide the popup when text is typed or selection changes
writingArea.addEventListener("input", () => {
  console.log("[input listener] Input detected, hiding popup.");
  hideMarkdownPopup();
});
writingArea.addEventListener("keydown", (e) => {
  if (!e.shiftKey) {
    // Hide unless shift is held (indicating selection might be in progress)
    hideMarkdownPopup();
  }
});

// hide the popup when clicking anywhere outside the popup or writingArea
document.addEventListener("mousedown", (event) => {
  if (
    !markdownHighlightPopup.contains(event.target) && // If click is not inside the popup
    event.target !== markdownHighlightPopup && // If click is not on the popup itself
    event.target !== writingArea // If click is not on the writing area
  ) {
    hideMarkdownPopup();
  }
});

markdownHighlightPopup.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-format]");
  if (button) {
    const format = button.dataset.format;
    console.log(`[Popup Click] Applying format: ${format}`);
    switch (format) {
      case "bold":
        applyFormatting("**", "**");
        break;
      case "italic":
        applyFormatting("*", "*");
        break;
      case "link":
        const linkSelection = writingArea.value.substring(
          writingArea.selectionStart,
          writingArea.selectionEnd
        );
        if (linkSelection.length > 0) {
          applyFormatting(`[${linkSelection}](`, ")");
          writingArea.selectionStart = writingArea.selectionEnd - 1;
        } else {
          applyFormatting("[Link Text](", ")");
          writingArea.selectionStart = writingArea.selectionEnd - 1;
        }
        break;
      case "inline-code":
        applyFormatting("`", "`");
        break;
      case "strikethrough":
        applyFormatting("~~", "~~");
        break;
      case "heading":
        applyFormatting("# ", "");
        break;
      case "unordered-list":
        applyFormatting("- ", "");
        break;
      case "blockquote":
        applyFormatting("> ", "");
        break;
    }
  }
});

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  // Only apply shortcuts if the writing area is visible and active
  if (writingArea.style.display === "none" || e.target !== writingArea) return;

  // Check for Ctrl/Cmd + key combinations
  if (e.ctrlKey || e.metaKey) {
    // Ctrl for Windows/Linux, Cmd for Mac
    if (e.altKey) {
      switch (e.key.toLowerCase()) {
        case "c": // Ctrl/Cmd + Alt + C for Block Code
          e.preventDefault();
          applyFormatting("```\n", "\n```");
          writingArea.selectionStart = writingArea.selectionEnd - 3;
          break;
        case "h": // Ctrl/Cmd + Alt + H for Horizontal Rule
          e.preventDefault();
          const hrBefore =
            writingArea.selectionStart === 0 ||
            writingArea.value[writingArea.selectionStart - 1] === "\n"
              ? ""
              : "\n\n";
          applyFormatting(hrBefore + "---", "\n\n");
          break;
        case "s": // Ctrl/Cmd + Alt + S for Strikethrough
          e.preventDefault();
          applyFormatting("~~", "~~");
          break;
        case "i": // Ctrl/Cmd + Alt + I for Image
          e.preventDefault();
          const imageSelection = writingArea.value.substring(
            writingArea.selectionStart,
            writingArea.selectionEnd
          );
          if (imageSelection.length > 0) {
            applyFormatting(`![${imageSelection}](`, ")"); // Use selected text as alt
            writingArea.selectionStart = writingArea.selectionEnd - 1;
          } else {
            applyFormatting("![Alt Text](", ")");
            writingArea.selectionStart = writingArea.selectionEnd - 1;
          }
          break;
      }
    }
    // check for Ctrl/Cmd only combinations
    else {
      switch (e.key.toLowerCase()) {
        case "b": // Ctrl/Cmd + B for Bold
          e.preventDefault();
          applyFormatting("**", "**");
          break;
        case "i": // Ctrl/Cmd + I for Italic
          e.preventDefault();
          applyFormatting("*", "*");
          break;
        case "k": // Ctrl/Cmd + K for Link
          e.preventDefault();
          const linkSelection = writingArea.value.substring(
            writingArea.selectionStart,
            writingArea.selectionEnd
          );
          if (linkSelection.length > 0) {
            applyFormatting(`[${linkSelection}](`, ")");
            writingArea.selectionStart = writingArea.selectionEnd - 1;
          } else {
            applyFormatting("[Link Text](", ")");
            writingArea.selectionStart = writingArea.selectionEnd - 1;
          }
          break;
        case "e": // Ctrl/Cmd + E for Code (inline)
          e.preventDefault();
          applyFormatting("`", "`");
          break;
        case "h": // Ctrl/Cmd + H for Heading 1
          e.preventDefault();
          applyFormatting("# ", "");
          break;
        case "l": // Ctrl/Cmd + L for unordered list
          e.preventDefault();
          applyFormatting("- ", "");
          break;
        case "1": // Ctrl/Cmd + 1 for ordered list
          e.preventDefault();
          applyFormatting("1. ", "");
          break;
        case "q": // Ctrl/Cmd + Q for Blockquote
          e.preventDefault();
          applyFormatting("> ", "");
          break;
      }
    }
  }
});

markdownViewButton.addEventListener("click", toggleMarkdownView);

// Initial load check localStorage and set initial view
document.addEventListener("DOMContentLoaded", () => {
  const savedViewState = localStorage.getItem("isMarkdownViewActive");
  const shouldBeMarkdownView = savedViewState === "true";

  isMarkdownViewActive = shouldBeMarkdownView;
  if (isMarkdownViewActive) {
    renderMarkdown();
    writingArea.style.display = "none";
    markdownOutput.style.display = "block";
  } else {
    writingArea.style.display = "block";
    markdownOutput.style.display = "none";
    writingArea.focus();
  }
  hideMarkdownPopup(); // popup is hidden on initial load
});
