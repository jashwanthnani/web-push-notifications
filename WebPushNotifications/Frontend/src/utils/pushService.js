// Replace with your actual VAPID Public Key from backend
const VAPID_PUBLIC_KEY = "YOUR_PUBLIC_VAPID_KEY_HERE";

// Convert base64 public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Register Service Worker and Subscribe
export async function registerPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Push notifications are not supported in this browser.");
    return;
  }

  try {
    // Register service worker
    const reg = await navigator.serviceWorker.register("/sw.js");

    // Ask notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission denied");
      return;
    }

    // Subscribe user
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Send subscription to backend
    await fetch("http://127.0.0.1:8000/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    alert("Subscribed successfully!");
  } catch (err) {
    console.error("Push subscription failed", err);
  }
}
