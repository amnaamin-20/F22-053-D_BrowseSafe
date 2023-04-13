document.addEventListener("DOMContentLoaded", () => {
  var changeColor = document.getElementById("changeColor");
  changeColor.addEventListener("click", openIndex);
});

function openIndex() {
  chrome.tabs.create({ active: true, url: "/interface/index.html" });
}
