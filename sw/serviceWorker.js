var VERSION = 'v1';

// 缓存（安装后）
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        './index.html',
        './jquery.js',
        './code.png'
      ]);
    })
  );
});

// 缓存更新（激活后）
// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.map(function(cacheName) {
//           // 如果当前版本和缓存版本不一致
//           if (cacheName !== VERSION) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// 捕获请求并返回缓存数据（请求后）
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        caches.open(VERSION).then(function(cache) {
          cache.put(event.request, response);
        });
        return response.clone();
      })
      .catch(function() {
        return fetch(event.request);
      })
    )
});