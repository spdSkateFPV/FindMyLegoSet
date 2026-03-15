// sw.js – Service Worker
//
// 🔰 WAS IST EIN SERVICE WORKER?
// Ein kleines Skript das im Hintergrund läuft, auch wenn die App
// nicht offen ist. Er kann Dateien im Cache speichern damit die
// App auch ohne Internet (teilweise) funktioniert.
//
// Für unsere App ist er vor allem nötig damit der Browser die
// App als "echte PWA" anerkennt und die Installation anbietet.

const CACHE_NAME = 'lego-checker-v1';

// Beim Installieren: Grunddateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['/lego-checker/', '/lego-checker/index.html', '/lego-checker/manifest.json', '/lego-checker/icon.svg']);
    })
  );
  self.skipWaiting();
});

// Beim Aktivieren: Alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Bei Netzwerkanfragen: Erst Cache, dann Internet
// (Außer für API-Anfragen – die müssen immer frisch sein)
self.addEventListener('fetch', event => {
  if (event.request.url.includes('rebrickable.com')) return; // API nie cachen
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
