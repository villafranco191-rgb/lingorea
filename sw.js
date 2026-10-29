/* LingoREA · service worker — la app abre sin conexión tras la primera visita
   y se actualiza sola: la caché lleva la huella del build. */
const CACHE = 'lingorea-4ddff695fc';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './puerta-tucana.mp4', './puerta-cine.mp4', './puerta-poster.jpg', './celebracion-3d.webp', './cuento-3d.webp', './poster-dia.webp', './poster-noche.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  const path = new URL(e.request.url).pathname;
  const isDoc = e.request.mode === 'navigate' || path.endsWith('/') || path.endsWith('/index.html');
  if (isDoc) {
    e.respondWith(fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html', { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  })));
});
