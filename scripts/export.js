const exportButton = document.getElementById("exportButton");
const exportDropdown = document.getElementById("exportDropdown");
const exportTxtButton = document.getElementById("exportTxt");
const exportHtmlButton = document.getElementById("exportHtml");
const exportMdButton = document.getElementById("exportMd");

const copyAllButton = document.getElementById("copyAllButton");
const copyMessage = document.getElementById("copyMessage");

const writingArea = document.getElementById("writingArea"); // For MD and TXT
const markdownOutput = document.getElementById("markdownOutput"); // For HTML export only

// generate a timestamped filename
function generateFilename(extension) {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `My_Document_${year}${month}${day}_${hours}${minutes}${seconds}.${extension}`;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a); // Append to body required for Firefox
  a.click();
  document.body.removeChild(a); // Clean up DOM
  URL.revokeObjectURL(url); // Free up memory
}

function exportAsTxt() {
  const content = writingArea.value;
  const filename = generateFilename("txt");
  downloadFile(filename, content, "text/plain");
  exportDropdown.style.display = "none"; // close dropdown after export
}

function exportAsHtml() {
  // basic html wrapper
  const rawHtmlContent = markdownOutput.innerHTML;
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Document</title>
    <style>
        /* Basic styles to make the exported HTML readable, similar to prose defaults */
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            line-height: 1.75;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
            color: #1f2937; /* Default text color */
            background-color: #ffffff; /* Default background color */
        }
        @media (prefers-color-scheme: dark) {
            body {
                color: #e5e7eb; /* Dark mode text color */
                background-color: #1f2937; /* Dark mode background color */
            }
        }
        h1, h2, h3, h4, h5, h6 {
            font-weight: 700;
            line-height: 1.25;
            margin-top: 1.5em;
            margin-bottom: 1em;
        }
        h1 { font-size: 2.25em; }
        h2 { font-size: 1.875em; }
        h3 { font-size: 1.5em; }
        h4 { font-size: 1.25em; }
        p {
            margin-top: 1em;
            margin-bottom: 1em;
        }
        a {
            color: #2563eb; /* Blue for links */
            text-decoration: underline;
        }
        blockquote {
            border-left: 0.25rem solid #d1d5db; /* Gray border */
            padding-left: 1rem;
            color: #6b7280; /* Darker gray text */
        }
        ul, ol {
            list-style-position: outside;
            margin-left: 1.5rem;
            margin-top: 1em;
            margin-bottom: 1em;
        }
        li {
            margin-bottom: 0.25em;
        }
        code {
            background-color: #f3f4f6; /* Light gray background for inline code */
            padding: 0.25em 0.5em;
            border-radius: 0.25rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        pre {
            background-color: #1f2937; /* Dark background for code blocks */
            color: #e5e7eb; /* Light text for code blocks */
            padding: 1rem;
            border-radius: 0.375rem;
            overflow-x: auto;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1em;
            margin-bottom: 1em;
        }
        th, td {
            border: 1px solid #d1d5db; /* Light gray border */
            padding: 0.75rem;
            text-align: left;
        }
        th {
            background-color: #f9fafb; /* Lighter gray header background */
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div style="max-width: 800px; margin: 0 auto; padding: 1rem;">
        ${rawHtmlContent}
    </div>
</body>
</html>`;

  const filename = generateFilename("html");
  downloadFile(filename, htmlTemplate, "text/html");
  exportDropdown.style.display = "none";
}

function exportAsMd() {
  const content = writingArea.value;
  const filename = generateFilename("md");
  downloadFile(filename, content, "text/markdown"); // text/markdown for .md files
  exportDropdown.style.display = "none";
}

function copyContentToClipboard() {
  const contentToCopy = writingArea.value;

  // Use a temporary textarea to perform the copy operation
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = contentToCopy;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  tempTextArea.setSelectionRange(0, 99999); // For mobile devices, ensures full selection

  try {
    document.execCommand("copy");
    showCopyMessage();
  } catch (err) {
    console.error("Failed to copy content: ", err);
  } finally {
    document.body.removeChild(tempTextArea);
  }
}

// Function to show the copy confirmation message
function showCopyMessage() {
  // Ensure the message starts fully transparent and off-screen before showing
  copyMessage.classList.remove("opacity-100", "translate-y-0");
  copyMessage.classList.add("opacity-0", "translate-y-full");

  // Force reflow to ensure the transition plays from the correct starting state
  void copyMessage.offsetWidth;

  // Make visible and transition to final position
  copyMessage.classList.add("opacity-100", "translate-y-0");
  copyMessage.classList.remove("opacity-0", "translate-y-full");

  // Hide the message after a delay
  setTimeout(() => {
    copyMessage.classList.remove("opacity-100", "translate-y-0");
    copyMessage.classList.add("opacity-0", "translate-y-full");
  }, 2000); // Message visible for 2 seconds
}

// Event Listeners for Export Dropdown
exportButton.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent this click from immediately closing the dropdown via the document listener
  exportDropdown.style.display =
    exportDropdown.style.display === "block" ? "none" : "block";
});

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  // Check if the click was outside the export button and the dropdown itself
  if (!exportButton.contains(e.target) && !exportDropdown.contains(e.target)) {
    exportDropdown.style.display = "none";
  }
});

exportTxtButton.addEventListener("click", exportAsTxt);
exportHtmlButton.addEventListener("click", exportAsHtml);
exportMdButton.addEventListener("click", exportAsMd);

// Event Listener for Copy All button
if (copyAllButton) {
  copyAllButton.addEventListener("click", copyContentToClipboard);
}
