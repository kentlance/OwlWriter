const APP_PREFIX = "OwlWriter_"; // Use your app name
const VERSION = "version_10"; // Increment  every time theres an update cached files or sw.js
const CACHE_NAME = APP_PREFIX + VERSION;

const urlsToCache = [
  "/", // The root of the app (maps to index.html)
  "/index.html",
  "/sw.js",
  "/output.css",
  "/style.css",
  "/fonts.css",
  "/manifest.json",
  "/scripts/buttonOrder.js",
  "/scripts/colors.js",
  "/scripts/export.js",
  "/scripts/exportImportTheme.js",
  "/scripts/import.js",
  "/scripts/main.js",
  "/scripts/markdown.js",
  "/scripts/pages.js",
  "/scripts/presets.js",
  "/scripts/settings.js",
  "/images/icon512_maskable.png",
  "/images/icon512_rounded.png",

  // libraries
  "/libraries/marked.min.js",
  "/libraries/Sortable.min.js",

  // Local fonts
  "/fonts/inter-v19-latin-regular.woff2",
  "/fonts/inter-v19-latin-regular.ttf",
  "/fonts/amethysta-v16-latin-regular.woff2",
  "/fonts/amethysta-v16-latin-regular.ttf",
  "/fonts/roboto-v48-latin-regular.woff2",
  "/fonts/roboto-v48-latin-regular.ttf",
  "/fonts/merriweather-v32-latin-regular.woff2",
  "/fonts/merriweather-v32-latin-regular.ttf",
  "/fonts/raleway-v36-latin-regular.woff2",
  "/fonts/raleway-v36-latin-regular.ttf",
  "/fonts/nunito-v31-latin-regular.woff2",
  "/fonts/nunito-v31-latin-regular.ttf",
  "/fonts/quicksand-v36-latin-regular.woff2",
  "/fonts/quicksand-v36-latin-regular.ttf",
  "/fonts/outfit-v14-latin-regular.woff2",
  "/fonts/outfit-v14-latin-regular.ttf",
  "/fonts/libre-baskerville-v16-latin-regular.woff2",
  "/fonts/libre-baskerville-v16-latin-regular.ttf",
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
