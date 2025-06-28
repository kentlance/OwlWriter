const CACHE_NAME = "owlwriter-cache-v1.10";

const urlsToCache = [
  "/",
  "index.html",
  "style.css",
  "fonts.css",
  "scripts/buttonOrder.js",
  "scripts/colors.js",
  "scripts/export.js",
  "scripts/exportImportTheme.js",
  "scripts/import.js",
  "scripts/main.js",
  "scripts/markdown.js",
  "scripts/pages.js",
  "scripts/presets.js",
  "scripts/settings.js",
  "images/icon512_maskable.png",
  "images/icon512_rounded.png",

  // libraries
  "libraries/tailwind.min.js",
  "libraries/marked.min.js",
  "libraries/Sortable.min.js",

  // Local fonts
  "fonts/inter-v19-latin-regular.woff2",
  "fonts/inter-v19-latin-regular.ttf",
  "fonts/amethysta-v16-latin-regular.woff2",
  "fonts/amethysta-v16-latin-regular.ttf",
  "fonts/roboto-v48-latin-regular.woff2",
  "fonts/roboto-v48-latin-regular.ttf",
  "fonts/merriweather-v32-latin-regular.woff2",
  "fonts/merriweather-v32-latin-regular.ttf",
  "fonts/raleway-v36-latin-regular.woff2",
  "fonts/raleway-v36-latin-regular.ttf",
  "fonts/nunito-v31-latin-regular.woff2",
  "fonts/nunito-v31-latin-regular.ttf",
  "fonts/quicksand-v36-latin-regular.woff2",
  "fonts/quicksand-v36-latin-regular.ttf",
  "fonts/outfit-v14-latin-regular.woff2",
  "fonts/outfit-v14-latin-regular.ttf",
  "fonts/libre-baskerville-v16-latin-regular.woff2",
  "fonts/libre-baskerville-v16-latin-regular.ttf",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Attempting to cache app shell assets...");

        // Use Promise.allSettled to see the result of each individual add
        // This won't fail the whole install if one asset fails
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
              console.error(`  - Failed URL: ${failure.url}`, failure.reason)
            );
            // optional if asset fails to download
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

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // console.log('Service Worker: Serving from cache:', event.request.url);
        return response;
      }
      // console.log('Service Worker: Fetching from network:', event.request.url);
      return fetch(event.request).catch((error) => {
        console.error(
          "Service Worker: Fetch failed (offline/network issue):",
          event.request.url,
          error
        );
        // offline page maybe
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
