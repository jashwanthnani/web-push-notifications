const API_URL = "http://127.0.0.1:8000"; // backend running locally

export async function subscribeUser(subscription) {
  const res = await fetch(`${API_URL}/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return res.json();
}

export async function sendNotification() {
  const res = await fetch(`${API_URL}/send-notification`, {
    method: "POST",
  });
  return res.json();
}
