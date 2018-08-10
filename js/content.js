let page = document.body;
page.innerHTML="";

for (var t=0;t<=theTitz.length;++t){
  addSect(page, theTitz[t]);
}
addButton("JT", function () {
    let jt = page.getSelection().toString();
    if (jt) {
let resp = storageSet(theTitz[0],jt);
    }
});
addButton("close-button", "closeWindow");
addButton("Clear logs", function() {
logDiv.innerHTML = "";
});
addButton("Send message with delayed response", function() {
  chrome.runtime.sendMessage({delayedResponse: true}, function(response) {
    log("Background page responded: " + response);
  });
});
addButton("goto Options Page", function() {
  chrome.brow
});

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  log("Got message from background page: " + msg);
});

var logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";

page.appendChild(document.createElement("br"));
page.appendChild(logDiv);

log("Ready.");
