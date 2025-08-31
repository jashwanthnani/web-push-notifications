self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("Push received:", data);

  event.waitUntil(
    self.registration.showNotification(" New Notification", {
      body: data,
      icon: "/vite.svg", // change icon if needed
    })
  );
});
