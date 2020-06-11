if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then( registration => {
            // Success
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            // Failure
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}