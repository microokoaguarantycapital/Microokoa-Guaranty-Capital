// Service Worker for Microokoa Guaranty Capital PWA
const CACHE_NAME = 'microokoa-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/assets/logo.svg',
  '/assets/favicon.ico',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip POST requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the new response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.log('Fetch failed; returning offline page:', error);
            
            // For navigation requests, return offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // For other requests, return a generic error
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'donation-sync') {
    console.log('Background sync for donations');
    event.waitUntil(syncDonations());
  }
});

async function syncDonations() {
  try {
    // Get pending donations from IndexedDB
    const db = await openDonationDB();
    const pendingDonations = await getAllPendingDonations(db);
    
    // Send each pending donation
    for (const donation of pendingDonations) {
      try {
        const response = await fetch('https://api.microokoa.com/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(donation)
        });
        
        if (response.ok) {
          // Mark as synced
          await markDonationAsSynced(db, donation.id);
          console.log('Donation synced:', donation.id);
        }
      } catch (error) {
        console.error('Failed to sync donation:', error);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// Handle Push Notifications
self.addEventListener('push', event => {
  console.log('Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Microokoa Guaranty Capital';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/assets/icon-192x192.png',
    badge: '/assets/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || '1'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/');
        }
      })
  );
});

// Handle Background Periodic Sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-rates') {
    console.log('Periodic sync for rates update');
    event.waitUntil(updateLoanRates());
  }
});

async function updateLoanRates() {
  try {
    const response = await fetch('https://api.microokoa.com/rates');
    const rates = await response.json();
    
    // Store rates in cache
    const cache = await caches.open(CACHE_NAME);
    await cache.put('/rates', new Response(JSON.stringify(rates)));
    
    console.log('Loan rates updated');
  } catch (error) {
    console.error('Failed to update rates:', error);
  }
}

// Helper functions for IndexedDB
function openDonationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MicrookoaDonations', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('donations')) {
        const store = db.createObjectStore('donations', { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
      }
    };
  });
}

function getAllPendingDonations(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['donations'], 'readonly');
    const store = transaction.objectStore('donations');
    const index = store.index('status');
    const request = index.getAll('pending');
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function markDonationAsSynced(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['donations'], 'readwrite');
    const store = transaction.objectStore('donations');
    const getRequest = store.get(id);
    
    getRequest.onerror = () => reject(getRequest.error);
    getRequest.onsuccess = () => {
      const donation = getRequest.result;
      donation.status = 'synced';
      donation.syncedAt = new Date().toISOString();
      
      const putRequest = store.put(donation);
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve();
    };
  });
}