// SeekAlpha Service Worker
const CACHE_NAME = 'seekalpha-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Network-first strategy for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('api.devnet.solana.com')) {
    // Always go to network for Solana RPC
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
