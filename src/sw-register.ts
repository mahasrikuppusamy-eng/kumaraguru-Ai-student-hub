export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      // Use relative service worker path for GitHub Pages and sub-directory hosting compatibility
      const swUrl = './sw.js';
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[KCT AI Hub] Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[KCT AI Hub] Service Worker registration failed:', error);
        });
    });
  }
}
