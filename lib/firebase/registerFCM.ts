import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./messaging";
import { registerServiceWorker } from "./registerSW";

export async function registerFCM() {
  try {
    console.log("Starting FCM setup");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    const registration = await registerServiceWorker();

    console.log("SW Ready:", registration);

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: registration!,
    });

    console.log("FCM Token:", token);
  } catch (err) {
    console.error("FCM Error:", err);
  }
}