// Firebase push notifications — add your config in js/firebase-config.js
let messaging = null;

async function requestNotifications() {
    if (typeof firebase === 'undefined') {
        throw new Error('Firebase not loaded');
    }
    if (!firebase.apps.length && typeof FIREBASE_CONFIG !== 'undefined') {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
    if (!firebase.apps.length) {
        throw new Error('Firebase config missing — add js/firebase-config.js');
    }

    messaging = firebase.messaging();
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Permission denied');

    const token = await messaging.getToken();
    console.log('FCM Token:', token);
    return token;
}

if ('serviceWorker' in navigator && typeof firebase !== 'undefined') {
    navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => {});
}
