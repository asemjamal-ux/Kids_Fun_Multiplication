const CACHE_NAME = "fun-with-math-v3";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/games.html",
  "/videos.html",
  "/worksheets.html",
  "/parents.html",
  "/css/style.css",
  "/js/i18n.js",
  "/js/main.js",
  "/js/games.js",
  "/js/games-more.js",
  "/js/videos.js",
  "/js/worksheets.js",
  "/js/home.js",
  "/js/parents.js",
  "/division/index.html",
  "/division/games.html",
  "/division/videos.html",
  "/division/worksheets.html",
  "/division/parents.html",
  "/division/css/style.css",
  "/division/js/i18n.js",
  "/division/js/main.js",
  "/division/js/games.js",
  "/division/js/games-more.js",
  "/division/js/videos.js",
  "/division/js/worksheets.js",
  "/division/js/home.js",
  "/division/js/parents.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
