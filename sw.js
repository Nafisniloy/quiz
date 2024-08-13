const cacheName = 'v2';
// const dynamicCache = 'v1';
const cacheFiles = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    'script.js',
    'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png',
];
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
    caches.open(cacheName).then(function(cache) {
        return cache.addAll(cacheFiles);
    })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {
                if (thisCacheName !== cacheName) {
                    return caches.delete(thisCacheName);
                }
            }));
        })
    );
});


self.addEventListener('fetch', function(event) {

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        }).catch(function() {            
            return new Response.json({results: []});
        })
      
    );
});