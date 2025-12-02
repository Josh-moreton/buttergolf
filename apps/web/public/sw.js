// Service Worker for PWA support
// This is a minimal service worker to enable PWA installation

const CACHE_NAME = 'buttergolf-v2';
const urlsToCache = [
  '/manifest.json',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - network-first for navigation, cache for assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // For navigation requests (HTML pages), always go to network
  // This prevents issues with redirects (e.g., coming-soon redirect)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // Only serve from cache if network fails
        return caches.match(request);
      })
    );
    return;
  }
  
  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request);
      })
  );
});

// Activate event - cleanup old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Take control of all clients immediately
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
