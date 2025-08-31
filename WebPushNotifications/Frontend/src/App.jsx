import { useState } from "react";
import { subscribeUser, sendNotification } from "./api";

function App() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service Worker registered:", registration);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });

      await subscribeUser(subscription);
      setIsSubscribed(true);
      alert("✅ Notifications Enabled!");
    } else {
      alert("❌ Push notifications are not supported in this browser.");
    }
  };

  const handleSendNotification = async () => {
    await sendNotification();
    alert("📩 Notification Sent (check top-right corner)");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">🔔 Push Notification Demo</h1>
      <button
        onClick={registerServiceWorker}
        disabled={isSubscribed}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        {isSubscribed ? "✅ Notifications Enabled" : "Enable Notifications"}
      </button>
      <button
        onClick={handleSendNotification}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Send Test Notification
      </button>
    </div>
  );
}

export default App;
