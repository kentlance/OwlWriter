const writingArea = document.getElementById("writingArea");
const markdownOutput = document.getElementById("markdownOutput");
const markdownViewButton = document.getElementById("markdownViewButton");

// marked js
marked.setOptions({
  breaks: true,
  gfm: true,
  sanitize: true,
});

let isMarkdownViewActive = false; // false = writing area active, true = markdown view active

function renderMarkdown() {
  markdownOutput.innerHTML = marked.parse(writingArea.value);
}

function toggleMarkdownView() {
  isMarkdownViewActive = !isMarkdownViewActive;

  if (isMarkdownViewActive) {
    renderMarkdown(); // Render before showing
    writingArea.style.display = "none";
    markdownOutput.style.display = "block";
  } else {
    markdownOutput.style.display = "none";
    writingArea.style.display = "flex";
    writingArea.focus(); //
  }
  localStorage.setItem("isMarkdownViewActive", isMarkdownViewActive); // Save preference
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
}

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
        case "u": // Ctrl/Cmd + U for Underline
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
    writingArea.style.display = "flex";
    markdownOutput.style.display = "none";
    writingArea.focus();
  }
});
