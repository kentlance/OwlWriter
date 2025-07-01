import { showControlBar } from "./main.js";

const DEFAULT_BUTTON_ORDER = {
  // use ID
  left: ["pagesButton"], // Pages button on left by default
  center: [], // Nothing on center by default
  right: [
    "importButton",
    "exportButtonContainer",
    "copyAllButton",
    "markdownViewButton",
    "helpButton",
    "fullScreenToggleButton",
    "settingsButton",
  ],
};

let sortableInstanceLeft;
let sortableInstanceCenter;
let sortableInstanceRight;

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
      // make sure it's an object with 'left', 'center', 'right' arrays
      if (
        typeof parsedOrder === "object" &&
        Array.isArray(parsedOrder.left) &&
        Array.isArray(parsedOrder.center) &&
        Array.isArray(parsedOrder.right)
      ) {
        // make sure all default buttons are present in the parsed order
        const allDefaultButtons = [
          ...DEFAULT_BUTTON_ORDER.left,
          ...DEFAULT_BUTTON_ORDER.center,
          ...DEFAULT_BUTTON_ORDER.right,
        ];
        let combinedStored = [
          ...parsedOrder.left,
          ...parsedOrder.center,
          ...parsedOrder.right,
        ];

        // Add any missing default buttons to the right section
        allDefaultButtons.forEach((id) => {
          if (!combinedStored.includes(id)) {
            parsedOrder.right.push(id);
          }
        });

        // Remove any invalid/old buttons from stored order
        parsedOrder.left = parsedOrder.left.filter((id) => BUTTON_NAMES[id]);
        parsedOrder.center = parsedOrder.center.filter(
          (id) => BUTTON_NAMES[id]
        );
        parsedOrder.right = parsedOrder.right.filter((id) => BUTTON_NAMES[id]);

        return parsedOrder;
      }
    } catch (e) {
      console.error("Error parsing stored button order, using default.", e);
    }
  }
  // If stored order is invalid or not found, use default
  return {
    left: [...DEFAULT_BUTTON_ORDER.left],
    center: [...DEFAULT_BUTTON_ORDER.center],
    right: [...DEFAULT_BUTTON_ORDER.right],
  };
}

function saveButtonOrder(order) {
  localStorage.setItem("buttonOrder", JSON.stringify(order));
}

function applyButtonOrderToDOM(order) {
  const controlBarLeft = document.getElementById("controlBarLeft");
  const controlBarCenter = document.getElementById("controlBarCenter");
  const controlBarRight = document.getElementById("controlBarRight");
  const buttonStash = document.getElementById("buttonStash");

  if (
    !controlBarLeft ||
    !controlBarCenter ||
    !controlBarRight ||
    !buttonStash
  ) {
    console.warn(
      "Control bar sections or button stash not found. Cannot apply button order."
    );
    return;
  }

  // move all displayed buttons to buttonstash
  Array.from(controlBarLeft.children).forEach((child) =>
    buttonStash.appendChild(child)
  );
  Array.from(controlBarCenter.children).forEach((child) =>
    buttonStash.appendChild(child)
  );
  Array.from(controlBarRight.children).forEach((child) =>
    buttonStash.appendChild(child)
  );

  // clear control bar
  // safe since we moved buttons to buttonstash
  controlBarLeft.innerHTML = "";
  controlBarCenter.innerHTML = "";
  controlBarRight.innerHTML = "";

  // Helper to append buttons
  const appendButtons = (container, buttonIds) => {
    buttonIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        container.appendChild(element); // Move element from stash to new container
      } else {
        console.warn(
          `Element with ID '${id}' was not found in the DOM (after re-stashing).`
        );
      }
    });
  };

  appendButtons(controlBarLeft, order.left);
  appendButtons(controlBarCenter, order.center);
  appendButtons(controlBarRight, order.right);
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

  // Create the three separate lists for SortableJS in the settings panel
  const leftSection = document.createElement("div");
  leftSection.className = "mb-4";
  leftSection.innerHTML =
    '<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Left Side Buttons</h4>';
  settingsContainer.appendChild(leftSection); // Append the header section first

  const leftList = document.createElement("div");
  leftList.id = "sortableLeft";
  leftList.className =
    "sortable-list p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner flex flex-col space-y-2 py-4 min-h-16";
  leftSection.appendChild(leftList);

  const centerSection = document.createElement("div");
  centerSection.className = "mb-4";
  centerSection.innerHTML =
    '<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Center Buttons</h4>';
  settingsContainer.appendChild(centerSection);

  const centerList = document.createElement("div");
  centerList.id = "sortableCenter";
  centerList.className =
    "sortable-list p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner flex flex-col space-y-2 py-4 min-h-16";
  centerSection.appendChild(centerList);

  const rightSection = document.createElement("div");
  rightSection.className = "mb-4";
  rightSection.innerHTML =
    '<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Right Side Buttons</h4>';
  settingsContainer.appendChild(rightSection);

  const rightList = document.createElement("div");
  rightList.id = "sortableRight";
  rightList.className =
    "sortable-list p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner flex flex-col space-y-2 py-4 min-h-16";
  rightSection.appendChild(rightList);

  const currentOrder = getButtonOrder();

  // populate the sortable list visually in the settings panel
  const populateSortableList = (listElement, buttonIds) => {
    buttonIds.forEach((buttonId) => {
      const listItem = document.createElement("div");
      listItem.className =
        "button-order-item flex items-center justify-between p-2 rounded-md bg-gray-200 dark:bg-gray-700 shadow-xs cursor-grab";
      listItem.setAttribute("data-id", buttonId);

      const iconSpan = document.createElement("span");
      iconSpan.className = "handle text-gray-500 dark:text-gray-400 mr-2";
      iconSpan.innerHTML = "&#9776;"; // Hamburger icon for drag handle
      listItem.appendChild(iconSpan);

      const nameSpan = document.createElement("span");
      nameSpan.textContent = BUTTON_NAMES[buttonId] || buttonId;
      listItem.appendChild(nameSpan);

      listElement.appendChild(listItem);
    });
  };

  populateSortableList(leftList, currentOrder.left);
  populateSortableList(centerList, currentOrder.center);
  populateSortableList(rightList, currentOrder.right);

  // Destroy existing Sortable instances if they exist
  if (sortableInstanceLeft) sortableInstanceLeft.destroy();
  if (sortableInstanceCenter) sortableInstanceCenter.destroy();
  if (sortableInstanceRight) sortableInstanceRight.destroy();

  // Define a common onEnd handler to save and apply the new order
  const onEndHandler = function () {
    // Collect the IDs from all three lists
    const newOrder = {
      left: Array.from(leftList.children)
        .filter((el) => el.dataset.id)
        .map((el) => el.dataset.id),
      center: Array.from(centerList.children)
        .filter((el) => el.dataset.id)
        .map((el) => el.dataset.id),
      right: Array.from(rightList.children)
        .filter((el) => el.dataset.id)
        .map((el) => el.dataset.id),
    };
    saveButtonOrder(newOrder);
    applyButtonOrderToDOM(newOrder);
    showControlBar();
  };

  // Initialize SortableJS for each list and group them
  sortableInstanceLeft = Sortable.create(leftList, {
    animation: 150,
    group: "buttonOrder", // All lists in this group can share items
    onEnd: onEndHandler,
  });

  sortableInstanceCenter = Sortable.create(centerList, {
    animation: 150,
    group: "buttonOrder",
    onEnd: onEndHandler,
  });

  sortableInstanceRight = Sortable.create(rightList, {
    animation: 150,
    group: "buttonOrder",
    onEnd: onEndHandler,
  });
}

function resetButtonOrderToDefault() {
  // Save a deep copy of the default order
  const defaultOrderCopy = {
    left: [...DEFAULT_BUTTON_ORDER.left],
    center: [...DEFAULT_BUTTON_ORDER.center],
    right: [...DEFAULT_BUTTON_ORDER.right],
  };
  saveButtonOrder(defaultOrderCopy);
  applyButtonOrderToDOM(defaultOrderCopy);
  initializeSortableUI(); // Re-render the settings UI with the default order
}

// Function to call on initial load or when settings panel opens
function setupButtonOrder() {
  const initialOrder = getButtonOrder();
  applyButtonOrderToDOM(initialOrder); // Apply saved order immediately

  const resetButton = document.getElementById("resetButtonOrder");
  if (resetButton && !resetButton.dataset.listenerAttached) {
    resetButton.addEventListener("click", resetButtonOrderToDefault);
    resetButton.dataset.listenerAttached = "true"; // Mark as attached
  }
}

export { setupButtonOrder, initializeSortableUI, resetButtonOrderToDefault };
