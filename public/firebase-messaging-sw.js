importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBXJWn-KsbW4y_3_3h_iOV_HL8x3cjGM0k",
  authDomain: "ysx-social-media-website.firebaseapp.com",
  projectId: "ysx-social-media-website",
  messagingSenderId: "105087949794",
  appId: "1:105087949794:web:8e0f7191320c6fa580f7bb",
  measurementId: "G-0E67HX6295",
  storageBucket: "ysx-social-media-website.firebasestorage.app"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "New message";

  self.registration.showNotification(title, {
    body: payload.notification?.body || "",
    data: payload.data || {},
  });
});