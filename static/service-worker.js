const CACHE_NAME = 'translator-v1';

const urlsToCache = [
  '/',
  '/static/style.css',
  '/static/scripts.js',
  '/static/icon-192.png',
  '/static/icon-512.png',
];

// Instalar y cachear
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalado');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activar y limpiar caches viejos
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activado');
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Interceptar fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((response) => response)
    )
  );
});
