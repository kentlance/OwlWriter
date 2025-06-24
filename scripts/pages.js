function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Key for storing all pages data in localStorage
const LOCAL_STORAGE_PAGES_KEY = "writerly_pages_data";

// Internal state for managing pages
let allPages = [];
let currentPageId = null;

// load all pages and current page ID from localstorage
// initialize default page if no pages exist// pages.js
export function loadPages() {
  const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PAGES_KEY));

  if (savedData && savedData.pages && savedData.pages.length > 0) {
    allPages = savedData.pages;
    currentPageId = savedData.currentPageId;

    // Ensure currentPageId is valid; if not, default to first page
    if (!allPages.some((page) => page.id === currentPageId)) {
      currentPageId = allPages[0].id;
      savePagesState(); // Save to reflect the corrected currentPageId
    }
  } else {
    // No pages found, create a default one
    createNewPage("Untitled Page 1", true); // true means it's an initial creation
  }
  return { pages: [...allPages], currentPageId: currentPageId };
}

function savePagesState() {
  const dataToSave = {
    pages: allPages,
    currentPageId: currentPageId,
  };
  localStorage.setItem(LOCAL_STORAGE_PAGES_KEY, JSON.stringify(dataToSave));
}

// create new page, set to current page
export function createNewPage(name, isInitialCreation = false) {
  const newPage = {
    id: generateUniqueId(),
    name: name,
    content: "",
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };

  allPages.push(newPage);
  currentPageId = newPage.id;

  // Sort pages by creation date (by default)
  allPages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  savePagesState();
  return newPage;
}

// delete page by ID
export function deletePage(pageId) {
  const initialPagesCount = allPages.length;
  allPages = allPages.filter((page) => page.id !== pageId);

  if (allPages.length === 0) {
    // If no pages left, create a new default one
    createNewPage("Untitled Page 1");
    // currentPageId is already set by createNewPage
  } else if (pageId === currentPageId) {
    // If the deleted page was the current one, switch to first available page
    currentPageId = allPages[0].id;
  }
  // If the deleted page was not the current one, currentPageId remains unchanged.
  savePagesState();
  return currentPageId;
}

// rename page by ID
export function renamePage(pageId, newName) {
  const page = allPages.find((p) => p.id === pageId);
  if (page) {
    page.name = newName;
    page.lastModified = new Date().toISOString(); // Update modification timestamp
    savePagesState();
  }
}

// open page by ID then set as current page
export function openPage(pageId) {
  const pageExists = allPages.some((page) => page.id === pageId);
  if (pageExists) {
    currentPageId = pageId;
    savePagesState();
  } else {
    console.warn(`Attempted to open non-existent page: ${pageId}`);
    // Optionally, reset to a default page or first page
    if (allPages.length > 0) {
      currentPageId = allPages[0].id;
      savePagesState();
    } else {
      createNewPage("Untitled Page 1");
    }
  }
}

// updates current page content
export function updateCurrentPageContent(newContent) {
  const currentPage = allPages.find((page) => page.id === currentPageId);
  if (currentPage) {
    currentPage.content = newContent;
    currentPage.lastModified = new Date().toISOString(); // Update timestamp
    savePagesState();
  }
}

export function getCurrentPageContent() {
  const currentPage = allPages.find((page) => page.id === currentPageId);
  return currentPage ? currentPage.content : "";
}

export function getCurrentPageId() {
  return currentPageId;
}

export function getAllPages() {
  // Return a sorted copy for UI display
  return [...allPages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function resetPages() {
  allPages = []; // Clear existing pages
  createNewPage("Untitled Page 1", true); // Create a fresh default page
}
