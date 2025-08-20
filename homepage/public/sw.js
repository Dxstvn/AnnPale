// Service Worker for Ann Pale - Enhanced Mobile Admin Offline Support
const CACHE_NAME = 'ann-pale-admin-v2';
const STATIC_CACHE = 'ann-pale-static-v2';
const DYNAMIC_CACHE = 'ann-pale-dynamic-v2';
const ADMIN_CACHE = 'ann-pale-admin-data-v2';

// Critical admin resources for offline access
const CRITICAL_ADMIN_URLS = [
  '/',
  '/admin',
  '/admin/mobile',
  '/admin/dashboard',
  '/offline.html',
  '/manifest.json',
  // Admin dashboard essentials
  '/admin/emergency',
  '/admin/alerts'
];

// Static assets that should be cached
const STATIC_ASSETS = [
  '/manifest.json',
  '/offline.html',
  // Add more static assets as needed
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_ADMIN_CACHE_SIZE = 20;

// Cache size management
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, size));
      }
    });
  });
};

// Network strategies
const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
};

const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
};

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching critical admin resources');
        return cache.addAll(CRITICAL_ADMIN_URLS);
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, ADMIN_CACHE];

  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - handle different request types
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle admin API requests with network-first strategy
  if (url.pathname.startsWith('/api/admin')) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          
          // Cache successful admin data requests
          if (networkResponse.ok && request.method === 'GET') {
            const cache = await caches.open(ADMIN_CACHE);
            cache.put(request, networkResponse.clone());
            limitCacheSize(ADMIN_CACHE, MAX_ADMIN_CACHE_SIZE);
          }
          
          return networkResponse;
        } catch (error) {
          // Return cached admin data if available
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline response for admin requests
          return new Response(JSON.stringify({
            error: 'Offline - Admin data unavailable',
            cached: false,
            timestamp: new Date().toISOString()
          }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })()
    );
    return;
  }

  // Handle admin pages with cache-first strategy
  if (url.pathname.startsWith('/admin')) {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          // Attempt to update cache in background
          fetch(request).then(response => {
            if (response.ok) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response);
              });
            }
          }).catch(() => {
            // Ignore network errors in background update
          });
          
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // Return offline page for admin routes
          return caches.match('/offline.html') || 
                 new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // Handle static assets
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Handle document requests
  if (request.destination === 'document') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline page for document requests
          return caches.match('/offline.html') || 
                 new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // Default: network-first for other requests
  event.respondWith(networkFirst(request));
});

// Background sync for admin actions
self.addEventListener('sync', event => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'admin-actions-sync') {
    event.waitUntil(syncAdminActions());
  }
});

// Sync pending admin actions when back online
const syncAdminActions = async () => {
  try {
    const pendingActions = await getStoredAdminActions();
    
    for (const action of pendingActions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        if (response.ok) {
          await removeStoredAdminAction(action.id);
          console.log('Synced admin action:', action.id);
        }
      } catch (error) {
        console.error('Failed to sync admin action:', action.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
};

// Handle push notifications for admin alerts
self.addEventListener('push', event => {
  console.log('Push notification received');
  
  const options = {
    body: 'New admin alert requires attention',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      type: 'admin-alert'
    },
    actions: [
      {
        action: 'view',
        title: 'View Alert',
        icon: '/icon-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-dismiss.png'
      }
    ],
    requireInteraction: true,
    tag: 'admin-alert'
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.message || options.body;
      options.data = { ...options.data, ...payload };
    } catch (error) {
      console.error('Error parsing push payload:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification('Ann Pale Admin Alert', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.notification.data);
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/admin/mobile#alerts')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open admin dashboard
    event.waitUntil(
      clients.openWindow('/admin/mobile')
    );
  }
});

// Message handling for admin client communication
self.addEventListener('message', event => {
  const { action, data } = event.data;
  
  switch (action) {
    case 'STORE_ADMIN_ACTION':
      storeAdminAction(data);
      break;
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
    case 'CLEAR_ADMIN_CACHE':
      clearAdminCache().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
    default:
      console.log('Unknown message action:', action);
  }
});

// Helper functions for IndexedDB operations
const storeAdminAction = async (action) => {
  // Store admin action for later sync when online
  const actions = await getStoredAdminActions();
  actions.push({
    ...action,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('pendingAdminActions', JSON.stringify(actions));
};

const getStoredAdminActions = async () => {
  try {
    const stored = localStorage.getItem('pendingAdminActions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting stored admin actions:', error);
    return [];
  }
};

const removeStoredAdminAction = async (actionId) => {
  try {
    const actions = await getStoredAdminActions();
    const filtered = actions.filter(action => action.id !== actionId);
    localStorage.setItem('pendingAdminActions', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing stored admin action:', error);
  }
};

const getCacheStatus = async () => {
  const caches_list = await caches.keys();
  const status = {};
  
  for (const cacheName of caches_list) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = {
      size: keys.length,
      lastUpdated: new Date().toISOString()
    };
  }
  
  return status;
};

const clearAdminCache = async () => {
  await caches.delete(ADMIN_CACHE);
  await caches.delete(DYNAMIC_CACHE);
  localStorage.removeItem('pendingAdminActions');
};