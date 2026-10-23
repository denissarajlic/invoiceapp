// Service worker: keeps a copy of the app's files on the phone so the
// app also opens without internet. With internet, it always loads the
// newest version first, so a `git push` reaches the phone right away.
const CACHE = "invoiceapp";

const FILES = [
  "./",
  "index.html",
  "style.css",
  "i18n.js",
  "clients.js",
  "print.js",
  "export.js",
  "app.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Try the internet first and save what comes back.
// Without internet, use the saved copy.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
