// Wait for the popup to fully load
window.addEventListener("DOMContentLoaded", () => {
  // Get a reference to the current window
  chrome.windows.getCurrent((window) => {
    // Close the window after 1 second
    setTimeout(() => {
      console.log("Closing popup window");
      chrome.windows.remove(window.id);
    }, 1000);
  });
});
