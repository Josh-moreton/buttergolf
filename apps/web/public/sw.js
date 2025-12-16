// Service Worker for PWA support
// This is a minimal service worker to enable PWA installation

const CACHE_NAME = 'buttergolf-v3';
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
  const url = new URL(request.url);
  
  // Skip cross-origin requests entirely - let browser handle them
  // This prevents issues with Stripe, Clerk, Cloudinary, and other external services
  if (url.origin !== self.location.origin) {
    return; // Don't call respondWith, let browser handle normally
  }
  
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
  
  // For same-origin requests, try cache first, then network
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request);
      })
      .catch(() => {
        // If both cache and network fail, just fail gracefully
        return new Response('Network error', { status: 503 });
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
