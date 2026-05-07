/* ═════════════════════════════════════════════════════════════
   Cueva Code · Service Worker
   Cache-first app shell · stale-while-revalidate dynamic
═══════════════════════════════════════════════════════════════ */
const VERSION = 'cueva-code-v7.4.0';
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// Files that make up the offline app shell.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  './icons/icon-maskable-512.png',
];

// Google Fonts URLs are added dynamically (stale-while-revalidate).

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(APP_SHELL.map(u => new Request(u, {cache: 'reload'}))))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] install failed', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Same-origin: cache-first then network
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Google Fonts (CSS + WOFF): stale-while-revalidate
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // esm.sh / unpkg / cdnjs / jsdelivr (Three.js + libs): stale-while-revalidate
  if (
    url.hostname === 'esm.sh' || url.hostname.endsWith('.esm.sh') ||
    url.hostname === 'unpkg.com' || url.hostname === 'cdnjs.cloudflare.com' ||
    url.hostname === 'cdn.jsdelivr.net'
  ) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Anything else: try network, fallback to cache
  event.respondWith(networkFirst(req));
});

/* ═══ Strategies ═══ */
async function cacheFirst(req) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok && res.type === 'basic') {
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    // Last-resort fallback for navigations
    if (req.mode === 'navigate') {
      const root = await cache.match('./index.html') || await cache.match('./');
      if (root) return root;
    }
    throw err;
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const networkPromise = fetch(req).then(res => {
    if (res && res.status === 200) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached || (await networkPromise) || Response.error();
}

async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    throw err;
  }
}

/* ═══ Allow client to trigger update ═══ */
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
  if (event.data === 'clearCache') {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
});
