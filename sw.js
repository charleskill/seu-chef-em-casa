// Service worker do app instalável. Faz uma coisa só: sem internet, mostra a página /offline
// em vez da tela de erro do navegador. Não guarda páginas, dados nem a API em cache,
// para o chef sempre ver pedidos e orçamentos atualizados.
const VERSAO = 'offline-v1';
const OFFLINE = '/offline'; // o Cloudflare Pages serve offline.html sem o .html

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(VERSAO).then(c => c.addAll([OFFLINE, '/assets/app/icone-192.png'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.mode === 'navigate') {
    ev.respondWith(fetch(req).catch(() => caches.match(OFFLINE)));
  } else if (req.method === 'GET' && new URL(req.url).pathname === '/assets/app/icone-192.png') {
    ev.respondWith(fetch(req).catch(() => caches.match(req)));
  }
});
