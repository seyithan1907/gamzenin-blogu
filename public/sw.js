const CACHE_NAME = 'gamzenin-blogu-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const OFFLINE_PAGE = '/offline.html';

// Önbelleğe alınacak statik dosyalar
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icons/android/android-launchericon-192-192.png',
  '/icons/android/android-launchericon-512-512.png',
  OFFLINE_PAGE,
  // Stil dosyaları
  '/_next/static/css/app.css',
  // Font dosyaları
  '/fonts/inter.woff2',
];

// Kurulum aşamasında
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Statik önbellek
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // Dinamik önbellek
      caches.open(DYNAMIC_CACHE),
    ])
  );
  self.skipWaiting();
});

// Aktivasyon aşamasında
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// İstek yakalama stratejisi
self.addEventListener('fetch', (event) => {
  // API isteklerini atla
  if (event.request.url.includes('/api/')) {
    return;
  }

  // POST isteklerini atla
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Önbellekte varsa döndür
        if (response) {
          // Arka planda güncelleme yap
          fetch(event.request)
            .then((freshResponse) => {
              if (freshResponse) {
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => cache.put(event.request, freshResponse));
              }
            });
          return response;
        }

        // Önbellekte yoksa ağdan al
        return fetch(event.request)
          .then((response) => {
            // Geçersiz yanıt ise direkt döndür
            if (!response || response.status !== 200) {
              return response;
            }

            // Yanıtın bir kopyasını önbelleğe ekle
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Ağ hatası durumunda offline sayfasını göster
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_PAGE);
            }
            return null;
          });
      })
  );
});

// Periyodik önbellek temizleme
self.addEventListener('message', (event) => {
  if (event.data === 'CLEAR_DYNAMIC_CACHE') {
    event.waitUntil(
      caches.delete(DYNAMIC_CACHE)
        .then(() => {
          console.log('Dinamik önbellek temizlendi');
        })
    );
  }
}); 