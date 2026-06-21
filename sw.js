/* Bump version when deploying updates so old caches are cleared */
const CACHE_NAME = 'aws-agni-v3';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

function isSameOrigin(request) {
    try {
        return new URL(request.url).origin === self.location.origin;
    } catch {
        return false;
    }
}

function isNetworkFirstAsset(url) {
    return url.pathname === '/'
        || /\.(?:html?|css|js)(\?|$)/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || !isSameOrigin(event.request)) return;

    const url = new URL(event.request.url);

    if (isNetworkFirstAsset(url)) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
