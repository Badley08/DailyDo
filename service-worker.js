// service-worker.js

const CACHE_NAME = 'dailydo-cache-v1.1'; // Incrémentez le numéro de version pour forcer le rafraîchissement du cache
const urlsToCache = [
  '/DailyDo',
  '/DailyDo/index.html',
  '/DailyDo/styles.css',
  '/DailyDo/script.js',
  '/DailyDo/app.js',
  // Ajoutez ici les chemins vers vos icônes si elles sont locales et que vous voulez les mettre en cache
  '/DailyDo/secretary.png',
  '/DailyDo/secretary.png',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des fichiers');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Échec de la mise en cache', error);
      })
  );
  // Force le nouvel SW à devenir actif immédiatement
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprime les anciens caches
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Prend contrôle des clients existants
  return self.clients.claim();
});

// Récupération des ressources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si la ressource est en cache, on la retourne
        if (response) {
          console.log(`Service Worker: Récupération depuis le cache pour ${event.request.url}`);
          return response;
        }
        console.log(`Service Worker: Récupération depuis le réseau pour ${event.request.url}`);
        // Sinon, on la récupère du réseau
        return fetch(event.request);
      })
      .catch(() => {
        // En cas d'échec réseau (hors ligne), on peut retourner une page de secours
        // Par exemple, si c'est une requête pour une page HTML
        if (event.request.destination === 'document') {
             return caches.match('/index.html'); // Ou une page offline.html personnalisée
        }
        return new Response('Vous êtes actuellement hors ligne et cette ressource n\'est pas disponible.', {
             status: 503,
             statusText: 'Service Unavailable'
        });
      })
  );
});
