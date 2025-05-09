const version = 'v3';
const projectArtifacts = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './repo.js',
  './worker.js',
  './pages/travel-config.js',
  './pages/travel-main.js',
  './pages/travel-trip.js',
  './pages/travel-stay.js',
  './components/location-edit.js',
  './components/location-view.js',
  './components/stay-edit.js',
  './components/stay-view.js',
  './components/travel-confirmation.js',
  './components/travel-header.js',
  './components/travel-list.js',
  './components/travel-login.js',
  './components/travel-map-overview.js',
  './components/travel-notification.js',
  './components/travel-position-edit.js',
  './components/travel-repo.js',
  './components/travel-router.js',
  './components/trip-edit.js',
  './components/trip-view.js',
  './data/map-location.svg',
  './data/map-pin.svg',
];
const externalLibraries = [
  'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap',
  'https://fonts.gstatic.com/s/notosans/v39/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/pouchdb/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-find/+esm',
  'https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/+esm',
  'https://cdn.jsdelivr.net/npm/uuid@8.3.2/+esm',
  'https://cdn.jsdelivr.net/npm/vuvuzela@1.0.3/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-errors@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-fetch@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-abstract-mapreduce@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-md5@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-collate@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-selector-core@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-utils@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-binary-utils@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/pouchdb-mapreduce-utils@9.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/ol/+esm',
  'https://cdn.jsdelivr.net/npm/ol/proj/+esm',
  'https://cdn.jsdelivr.net/npm/ol/source/+esm',
  'https://cdn.jsdelivr.net/npm/ol/layer/+esm',
  'https://cdn.jsdelivr.net/npm/ol/geom/+esm',
  'https://cdn.jsdelivr.net/npm/ol/style/+esm',
  'https://cdn.jsdelivr.net/npm/rbush@4.0.1/+esm',
  'https://cdn.jsdelivr.net/npm/geotiff@2.1.3/+esm',
  'https://cdn.jsdelivr.net/npm/earcut@3.0.1/+esm',
  'https://cdn.jsdelivr.net/npm/quickselect@3.0.0/+esm',
  'https://cdn.jsdelivr.net/npm/@petamoriken/float16@3.8.4/+esm',
  'https://cdn.jsdelivr.net/npm/xml-utils@1.7.0/get-attribute.js/+esm',
  'https://cdn.jsdelivr.net/npm/xml-utils@1.7.0/find-tags-by-name.js/+esm',
  'https://cdn.jsdelivr.net/npm/quick-lru@6.1.2/+esm',
  'https://cdn.jsdelivr.net/npm/ol@10.5.0/ol.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version).then(function(cache) {
      return cache.addAll([
        ...projectArtifacts,
        ...externalLibraries]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  let url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/') || url.origin.startsWith('https://tile.openstreetmap.org')) {
    event.respondWith(
      fetch(event.request)
    );
    return;
  }

  event.respondWith(
    caches.open(version).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', function activator(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys
        .filter(function(key) {
            return key.indexOf(version) !== 0;
        })
        .map(function(key) {
            return caches.delete(key);
        })
      );
    })
  );
});
