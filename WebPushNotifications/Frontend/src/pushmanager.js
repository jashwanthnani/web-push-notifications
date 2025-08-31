import { subscribeUser } from "./api";

const API_URL = "http://127.0.0.1:8000";

// Get VAPID public key from backend
async function getVapidKey() {
  const res = await fetch(`${API_URL}/vapid_public_key`);
  const data = await res.json();
  return data.vapidPublicKey;
}

// Subscribe user
export async function registerPush() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert(" Notification permission denied");
      return;
    }

    const publicKey = await getVapidKey();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    console.log("New Subscription:", subscription);
    await subscribeUser(subscription);
    alert(" Subscribed to notifications!");
  }
}

// Convert base64 string → Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
