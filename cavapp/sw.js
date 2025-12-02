const CACHE_NAME = 'cavapp-cache-v5'; // <--- AGGIORNATO A v5
// Lista di tutti i file necessari all'app per funzionare offline
const urlsToCache = [
  '/', 
  'index.html',
  'manifest.json',
  'sw.js',
  // Aggiunti i CDN (librerie esterne) necessari per l'offline
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  
  // CORREZIONE DEL PERCORSO DELLE ICONE
  '/icons/icon-192x192.png', 
  '/icons/icon-512x512.png'  
];

// 1. Installazione: memorizza tutti i file nella cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Forza l'attivazione immediata (best practice)
  );
});

// 2. Fetch: intercetta le richieste e usa la versione in cache se disponibile
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Risponde con la versione cache
        }
        return fetch(event.request); // Altrimenti, cerca dalla rete
      })
  );
});

// 3. Attivazione: pulisce le vecchie cache (se cambiamo il CACHE_NAME)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});