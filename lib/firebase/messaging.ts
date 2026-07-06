import { getMessaging, isSupported } from "firebase/messaging";
import { app } from "./client";

export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  return getMessaging(app);
};