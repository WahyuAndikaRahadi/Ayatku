// service-worker.js
self.addEventListener('install', event => {
    console.log('Service Worker installed');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker activated');
    return self.clients.claim();
  });
  
  // Handle messages from the main app with improved logging
  self.addEventListener('message', event => {
    console.log('Service Worker received message:', event.data);
    
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
      const { title, body, icon, tag, timestamp, sound, silent } = event.data;
      
      // Log notification details for debugging
      console.log('Preparing to show notification:', { title, body, tag });
      
      // If sound is specified and not silent, let the main thread know to play sound
      if (sound && !silent) {
        self.clients.matchAll().then(clients => {
          if (clients.length > 0) {
            console.log('Found clients to send audio message to:', clients.length);
            clients.forEach(client => {
              client.postMessage({
                type: 'PLAY_SOUND',
                sound: sound
              });
            });
          } else {
            console.warn('No clients found to play sound');
          }
        });
      }
      
      // Show notification with proper error handling
      self.registration.showNotification(title, {
        body,
        icon,
        tag,
        timestamp,
        vibrate: [200, 100, 200],
        requireInteraction: true,
        silent: silent
      }).then(() => {
        console.log('Notification shown successfully');
      }).catch(error => {
        console.error('Failed to show notification:', error);
      });
    }
  });
  
  // Handle notification clicks with improved logging
  self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event.notification.tag);
    event.notification.close();
    
    // Open the app if clicked
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientsArr => {
        // If already open, focus it
        const hadWindowToFocus = clientsArr.some(windowClient => {
          if (windowClient.url.includes(self.location.origin)) {
            return windowClient.focus();
          }
          return false;
        });
        
        // Otherwise open a new window
        if (!hadWindowToFocus) {
          clients.openWindow('/');
        }
      })
    );
  });
  
  // Keep the service worker alive with improved fetch handler
  self.addEventListener('fetch', event => {
    // Just let the browser handle the request normally
    // This minimal implementation keeps the service worker active
  });