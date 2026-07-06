export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  await navigator.serviceWorker.ready;

  return registration;
}