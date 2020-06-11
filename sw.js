var CACHE_NAME = 'memoes_cache';
var urlsToCache = [
  '',
  // css
  'css/generateMemo.css',
  'css/index.css',
  'css/memolist.css',
  'css/modal.css',
  'css/settings.css',
  'css/theme.css',
  // js
  'js/config.js',
  'js/generateMemo.js',
  'js/loader.js',
  'js/memolist.js',
  'js/objects.js',
  'js/pwa.js',
  'js/settings.js',
  // picker
  'vendor/picker/picker.min.css',
  'vendor/picker/picker.min.js',
  // swiper
  'vendor/swiper/swiper.min.css',
  'vendor/swiper/swiper.min.js'
];

// USE OUTSIDE GITHUB PAGES
// var urlsToCache = [
//   '/',
//   '/css/**.cs',
//   '/js/**.js'
// ];


globalThis.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
      })
  );
});

globalThis.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
          // Cache hit - return response
          return response || fetch(event.request);
      }
    )
  );
});