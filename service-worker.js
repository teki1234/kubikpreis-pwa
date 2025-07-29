const CACHE_NAME = 'kubikpreis-cache-v1';
const PRECACHE_RESOURCES = [
  '/', '/index.html', '/styles.css', '/app.js', '/manifest.json',
  '/icon-192.png', '/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_RESOURCES)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k!==CACHE_NAME).map(k => caches.delete(k))
  )));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(c => c||fetch(event.request)));
});