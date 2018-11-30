// 缓存空间名称
var VERSION = 'v1';
// 需要缓存的文件列表
var CacheSource = [
  '/code.png',
  '/jquery.js'
]
let { origin } = self.location

// 缓存（安装）
self.addEventListener('install', function(event) {
  // debug环境下开发可以跳过等待状态直接立即激活
  // self.skipWaiting();
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll(CacheSource);
    })
  );
});

// 缓存更新（安装完成后进入激活状态）
self.addEventListener('activate', function(event) {
  // 清除所有旧的SW版本
  // self.clients.claim()
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log(cacheNames)
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 如果当前版本和缓存版本不一致
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 捕获请求并返回缓存数据（请求后）
self.addEventListener('fetch', function(event) {
  let filePath = event.request.url.split(origin)[1]
  console.log(event, filePath)
  if (!CacheSource.includes(filePath)) return

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('SW匹配成功')
          return response
        }
        if (!response) {
          console.log('缓存未匹配到')
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) {
                return response
              }
              caches.open(VERSION).then(function(cache) {
                cache.put(event.request, response);
              })
              return response.clone()
            })
        }
      })
      .catch(err => {
        console.log('SW匹配失败：', err)
      })
  )
})
