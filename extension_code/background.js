try {
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
}

////REFRENCES
//https://www.youtube.com/watch?v=kybyYwu9Mpw
//https://developer.chrome.com/docs/extensions/mv3/getstarted/
//https://www.freecodecamp.org/news/building-chrome-extension/
//https://neilpatel.com/blog/chrome-extension/
//https://www.youtube.com/watch?v=qorfxFW3Vbo
//https://developer.chrome.com/docs/extensions/mv2/getstarted/
