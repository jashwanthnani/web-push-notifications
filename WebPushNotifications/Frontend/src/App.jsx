import React from "react";
import { registerPush } from "./pushManager";
import { sendNotification } from "./api";

function App() {
  const handleSubscribe = async () => {
    await registerPush();
  };

  const handleSendNotification = async () => {
    const res = await sendNotification("📢 Hello from React frontend!");
    alert(res.message);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🔔 Push Notification Demo</h1>
      <button style={styles.button} onClick={handleSubscribe}>
        Enable Notifications
      </button>
      <button style={styles.button} onClick={handleSendNotification}>
        Send Test Notification
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  button: {
    margin: "10px",
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default App;
