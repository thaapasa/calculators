// Self-unregistering service worker: clears old Workbox caches and removes itself.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(name => caches.delete(name)))).then(() => self.registration.unregister())
  );
});
