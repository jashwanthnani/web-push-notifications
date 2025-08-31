self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("Push received:", data);

  const options = {
    body: data.body,
    icon: "/icon.png", // Add a small icon in public folder
    badge: "/badge.png" // Optional
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
