import { Repo } from "/repo.js";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  // NOTE: Chrome throws errors regarding preloadResponse, see:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1420515
  // https://github.com/mdn/dom-examples/issues/145
  // To avoid those errors, remove or comment out this block of preloadResponse
  // code along with enableNavigationPreload() and the "activate" listener.
  const preloadResponse = await preloadResponsePromise;
  
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
  
    return preloadResponse;
  } 

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      './',
      './index.html',
      './manifest.json',
      './icon.svg',
      './repo.js',
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
      './components/travel-position-edit.js',
      './components/travel-repo.js',
      './components/travel-router.js',
      './components/trip-edit.js',
      './components/trip-view.js',
      './data/map-location.svg',
      './data/map-pin.svg',
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
    ])
  );
});

self.addEventListener('fetch', (event) => {
  let url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/') || url.origin.startsWith('https://tile.openstreetmap.org')) {
    event.respondWith(
      fetch(event.request)
    );
    return;
  }

  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse
    })
  );
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'couchdb-sync') {
    console.log('periodic sync');
    event.waitUntil(async () => {
      const repo = await Repo.create();
      await repo.sync();
    });
  }
});