/*try {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //this tells to do add listner on page update (new page) event
    if (changeInfo.status == "complete") {
      //when page loads and changing status complete
      chrome.scripting.executeScript({
        // execute scipt provided below on every page load
        files: ["contentScript.js"],
        target: { tabId: tab.id },
      });
    }
  });
} catch (e) {
  console.log(e);
}*/
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action == "createPopup") {
    chrome.windows.create(
      {
        url: chrome.runtime.getURL("test.html"),
        type: "popup",
        width: 180,
        height: 50,
        left: 1082,
        top: 100,
      },
      function (window) {
        console.log("Popup created at position:", window.left, window.top);
      }
    );
  }
});
/*chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    details.responseHeaders.push({
      name: "Cross-Origin-Embedder-Policy",
      value: "require-corp",
    });
    details.responseHeaders.push({
      name: "Cross-Origin-Opener-Policy",
      value: "same-origin",
    });
    return { responseHeaders: details.responseHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
);*/

////REFRENCES
//https://www.youtube.com/watch?v=kybyYwu9Mpw
//https://developer.chrome.com/docs/extensions/mv3/getstarted/
//https://www.freecodecamp.org/news/building-chrome-extension/
//https://neilpatel.com/blog/chrome-extension/
//https://www.youtube.com/watch?v=qorfxFW3Vbo
//https://developer.chrome.com/docs/extensions/mv2/getstarted/
