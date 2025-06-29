const APP_PREFIX = "OwlWriter_"; // Use your app name
const VERSION = "version_05"; // Increment  every time theres an update cached files or sw.js
const CACHE_NAME = APP_PREFIX + VERSION;

const urlsToCache = [
  "/OwlWriter/", // The root of the app on GitHub Pages (maps to index.html)
  "/OwlWriter/index.html",
  "/OwlWriter/sw.js",
  "/OwlWriter/dist/output.css",
  "/OwlWriter/style.css",
  "/OwlWriter/fonts.css",
  "/OwlWriter/manifest.json",
  "/OwlWriter/scripts/buttonOrder.js",
  "/OwlWriter/scripts/colors.js",
  "/OwlWriter/scripts/export.js",
  "/OwlWriter/scripts/exportImportTheme.js",
  "/OwlWriter/scripts/import.js",
  "/OwlWriter/scripts/main.js",
  "/OwlWriter/scripts/markdown.js",
  "/OwlWriter/scripts/pages.js",
  "/OwlWriter/scripts/presets.js",
  "/OwlWriter/scripts/settings.js",
  "/OwlWriter/images/icon512_maskable.png",
  "/OwlWriter/images/icon512_rounded.png",

  // libraries
  "/OwlWriter/libraries/marked.min.js",
  "/OwlWriter/libraries/Sortable.min.js",

  // Local fonts
  "/OwlWriter/fonts/inter-v19-latin-regular.woff2",
  "/OwlWriter/fonts/inter-v19-latin-regular.ttf",
  "/OwlWriter/fonts/amethysta-v16-latin-regular.woff2",
  "/OwlWriter/fonts/amethysta-v16-latin-regular.ttf",
  "/OwlWriter/fonts/roboto-v48-latin-regular.woff2",
  "/OwlWriter/fonts/roboto-v48-latin-regular.ttf",
  "/OwlWriter/fonts/merriweather-v32-latin-regular.woff2",
  "/OwlWriter/fonts/merriweather-v32-latin-regular.ttf",
  "/OwlWriter/fonts/raleway-v36-latin-regular.woff2",
  "/OwlWriter/fonts/raleway-v36-latin-regular.ttf",
  "/OwlWriter/fonts/nunito-v31-latin-regular.woff2",
  "/OwlWriter/fonts/nunito-v31-latin-regular.ttf",
  "/OwlWriter/fonts/quicksand-v36-latin-regular.woff2",
  "/OwlWriter/fonts/quicksand-v36-latin-regular.ttf",
  "/OwlWriter/fonts/outfit-v14-latin-regular.woff2",
  "/OwlWriter/fonts/outfit-v14-latin-regular.ttf",
  "/OwlWriter/fonts/libre-baskerville-v16-latin-regular.woff2",
  "/OwlWriter/fonts/libre-baskerville-v16-latin-regular.ttf",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Attempting to cache app shell assets...");

        const addPromises = urlsToCache.map((url) => {
          return cache
            .add(url)
            .then(() => {
              console.log(`Service Worker: Successfully cached: ${url}`);
              return { status: "fulfilled", value: url };
            })
            .catch((error) => {
              console.error(`Service Worker: Failed to cache: ${url}`, error);
              return { status: "rejected", reason: error, url: url };
            });
        });

        return Promise.allSettled(addPromises).then((results) => {
          const failed = results.filter(
            (result) => result.status === "rejected"
          );
          if (failed.length > 0) {
            console.warn(
              `Service Worker: Installation completed with ${failed.length} failures.`
            );
            failed.forEach((failure) =>
              console.error(`   - Failed URL: ${failure.url}`, failure.reason)
            );
          } else {
            console.log(
              "Service Worker: All app shell assets successfully cached!"
            );
          }
        });
      })
      .catch((error) => {
        console.error(
          "Service Worker: Fatal error opening cache or processing requests:",
          error
        );
      })
  );
});

// added comments, uncomment if needed later for debugging
self.addEventListener("fetch", (event) => {
  // console.log('fetch request : ' + event.request.url); // Uncomment for detailed debugging
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // console.log('responding with cache : ' + event.request.url); // Uncomment for detailed debugging
        return response;
      } else {
        // console.log('file is not cached, fetching : ' + event.request.url); // Uncomment for detailed debugging
        return fetch(event.request).catch((error) => {
          console.error(
            "Service Worker: Fetch failed (offline/network issue):",
            event.request.url,
            error
          );
          // offline page could be called here
        });
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((keyList) => {
      const cacheWhitelist = keyList.filter(function (key) {
        return key.startsWith(APP_PREFIX);
      });

      // Add current cache name to white list
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(
        keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            // Use .includes() for cleaner check
            console.log("Service Worker: Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim()); // Makes the new SW take control immediately
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
