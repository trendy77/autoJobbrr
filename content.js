// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

document.body.innerHTML = "";

function log(str) {
  console.log(str);
  logDiv.innerHTML += str + "<br>";
}

addButton("Clear logs", function() {
  logDiv.innerHTML = "";
});

addButton("Send message with delayed response", function() {
  chrome.runtime.sendMessage({delayedResponse: true}, function(response) {
    log("Background page responded: " + response);
  });
});

addButton("JT", function () {
    let jt = response.selectionText;
    if (jt) {

    }
});

addButton("goto Options Page", function() {
  chrome.runtime.sendMessage({setAlarm: true});
});

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  log("Got message from background page: " + msg);
});

var logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";
document.body.appendChild(document.createElement("br"));
document.body.appendChild(logDiv);

log("Ready.");
