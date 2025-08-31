const API_URL = "http://127.0.0.1:8000"; // FastAPI backend

// Subscribe user to backend
export async function subscribeUser(subscription) {
  const res = await fetch(`${API_URL}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  return res.json();
}

// Trigger notification from backend
export async function sendNotification(message = "Hello from Frontend ") {
  const res = await fetch(`${API_URL}/send-notification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
}
