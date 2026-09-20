// Minimal service worker — exists only to satisfy browsers' "installable as an
// app" checklist (Chrome/Edge on Windows and Mac, plus Android). It does not
// cache anything and does not intercept requests, so nothing here can ever
// serve a stale/old version of a tool — every load still goes straight to the
// network, exactly like a normal page. Safe to leave in place indefinitely.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {
  // Intentionally does not call event.respondWith() — the browser handles
  // every request normally. This empty handler is what makes Chrome/Edge
  // consider the site "installable" without adding any offline behavior.
});
