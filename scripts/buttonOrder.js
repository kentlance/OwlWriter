const DEFAULT_BUTTON_ORDER = [
  // use ID
  "importButton",
  "exportButtonContainer",
  "copyAllButton",
  "markdownViewButton",
  "helpButton",
  "fullScreenToggleButton",
  "pagesButton",
  "settingsButton",
];

let sortableInstance;

// Map of button IDs to their display names for settings UI
const BUTTON_NAMES = {
  importButton: "Import File",
  exportButtonContainer: "Export Content",
  copyAllButton: "Copy All",
  markdownViewButton: "Toggle Markdown View",
  helpButton: "Markdown Shortcuts",
  fullScreenToggleButton: "Toggle Fullscreen",
  pagesButton: "Manage Pages",
  settingsButton: "Settings",
};

function getButtonOrder() {
  const storedOrder = localStorage.getItem("buttonOrder");
  if (storedOrder) {
    try {
      const parsedOrder = JSON.parse(storedOrder);
      const validOrder = DEFAULT_BUTTON_ORDER.filter((id) =>
        parsedOrder.includes(id)
      );
      DEFAULT_BUTTON_ORDER.forEach((id) => {
        if (!validOrder.includes(id)) {
          validOrder.push(id);
        }
      });
      return validOrder;
    } catch (e) {
      console.error("Error parsing stored button order, using default.", e);
      return [...DEFAULT_BUTTON_ORDER];
    }
  }
  return [...DEFAULT_BUTTON_ORDER];
}

function saveButtonOrder(order) {
  localStorage.setItem("buttonOrder", JSON.stringify(order));
}

function applyButtonOrderToDOM(order) {
  const controlBar = document.getElementById("controlBar");
  if (!controlBar) return;

  const fragment = document.createDocumentFragment();

  order.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      fragment.appendChild(element);
    }
  });

  controlBar.innerHTML = "";
  controlBar.appendChild(fragment);
}

function initializeSortableUI() {
  const settingsContainer = document.getElementById(
    "buttonOrderSettingsContainer"
  );
  if (!settingsContainer) {
    console.warn("Button order settings container not found.");
    return;
  }

  settingsContainer.innerHTML = "";

  // Create list items for SortableJS
  const currentOrder = getButtonOrder();
  currentOrder.forEach((buttonId) => {
    const listItem = document.createElement("div");
    listItem.className =
      "button-order-item flex items-center justify-between p-2 rounded-md bg-gray-200 dark:bg-gray-700 shadow-sm cursor-grab";
    listItem.setAttribute("data-id", buttonId);

    const iconSpan = document.createElement("span");
    iconSpan.className = "handle text-gray-500 dark:text-gray-400 mr-2";
    iconSpan.innerHTML = "&#9776;"; // Hamburger icon for drag handle
    listItem.appendChild(iconSpan);

    const nameSpan = document.createElement("span");
    nameSpan.textContent = BUTTON_NAMES[buttonId] || buttonId;
    listItem.appendChild(nameSpan);

    settingsContainer.appendChild(listItem);
  });

  if (sortableInstance) {
    sortableInstance.destroy();
  }

  sortableInstance = Sortable.create(settingsContainer, {
    animation: 150,
    handle: ".handle", // Drag handle
    onEnd: function (evt) {
      // Get the new order of IDs from the DOM elements
      const newOrder = Array.from(evt.to.children).map(
        (item) => item.dataset.id
      );
      saveButtonOrder(newOrder);
      applyButtonOrderToDOM(newOrder); // Apply to control bar
    },
  });
}

function resetButtonOrderToDefault() {
  saveButtonOrder(DEFAULT_BUTTON_ORDER);
  applyButtonOrderToDOM(DEFAULT_BUTTON_ORDER);
  initializeSortableUI();
}

// Function to call on initial load or when settings panel opens
function setupButtonOrder() {
  const initialOrder = getButtonOrder();
  applyButtonOrderToDOM(initialOrder); // Apply saved order immediately

  document
    .getElementById("resetButtonOrder")
    ?.addEventListener("click", resetButtonOrderToDefault);
}

export { setupButtonOrder, initializeSortableUI, resetButtonOrderToDefault };
