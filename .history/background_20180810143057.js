'use strict';
var counter = 1;
var lastTabId = -1;

function log(str) {
  console.log(str);
  logDiv.innerHTML += str + "<br>";
}

function moveFwd(){
  counter++;
  
  var val = obj.value;
  titleE.setAttribute('value', info);
  titleE.style.opacity="0.5";
  titleE.style.color="black";
  var employE = document.getElementById(next).style.display = 'block';
  return;
}
var theTitz = ["JobTitle","Company","Contact","USP1","USP2","USP3"];
var theVals = ["","","","","","]"];
function close(window){
  window.close();
}

function addSect(onto,questionObj) {
  var titlebar = document.createElement("div");
  titlebar.setAttribute("class", "container");
  titlebar.setAttribute("id", questionObj.domid);
  var row = document.createElement("div");
  row.setAttribute("class", "row");
  titlebar.appendChild(row);
  var col = document.createElement("div");
  col.setAttribute("class", "col s12");
  row.appendChild(col);
  var tit = document.createElement("h6");
  tit.innerText = questionObj.title;
  col.appendChild(tit);
  var inpu = document.createElement("input");
  inpu.setAttribute("type","text");
  inpu.innerText = storageGet(questionObj.value);
  tit.appendChild(inpu);
  var divider = document.createElement("div");
  divider.setAttribute("class", questionObj.title + "-divider");
  titlebar.appendChild(divider);
  onto.appendChild(titlebar);
}
function sendMessage() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    lastTabId = tabs[0].id;
    chrome.tabs.sendMessage(lastTabId, "Background page started.");
  });
}
function storageSet(titI, val){
  chrome.storage.sync.set({ titI : val}, function() {
    console.log('Value is set to ' + val);
    return titI;
  });
}
function storageGet(titI){
  chrome.storage.sync.get({titI}, function(result) {
    return result;
  });
}

sendMessage();
chrome.browserAction.setBadgeText({
  text: "ON"
});
console.log("Loaded.");

// localStorage is persisted, so it's a good place to keep state that you
// need to persist across page reloads.
localStorage.counter = 1;

// Register a webRequest rule to redirect bing to google.
var wr = chrome.declarativeWebRequest; chrome.declarativeWebRequest.onRequest.addRules([{
  id: "0",
  conditions: [new wr.RequestMatcher({
    url: {
      hostSuffix: "seek.com.au"
    }
  })],
  actions: [new wr.RedirectRequest({
    redirectUrl: "http://google.com"
  })]
}]);
});


function saveVal(key, val) {
  chrome.storage.sync.set({
    key: val
  }, function () {
    console.log(key + "is now set to " + val);
  });
  return val;
}

chrome.bookmarks.onRemoved.addListener(function (id, info) {
  alert("I never liked that site anyway.");
});
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({
    url: chrome.extension.getURL("popup.html")
  });
});
chrome.contextMenus.onClicked.addListener(function (e) {
  if (e.selectionText){
    var ret = storageSet(e.menuItemId, e.selectionText);
  }
  chrome.contextMenus.update(e.menuItemId,{
      "title": e.menuItemId+": "+e.selectionText;
  });
});

  
chrome.browserAction.onClicked.addListener(function () {
  // The event page will unload after handling this event (assuming nothing
  // else is keeping it awake). The content script will become the main way to
  // interact with us.
  chrome.tabs.create({
    url: "http://seek.com.au"
  }, function (tab) {
    chrome.tabs.executeScript(tab.id, {
      file: "content.js"
    }, function () {
      // Note: we also sent a message above, upon loading the event page,
      // but the content script will not be loaded at that point, so we send
      // another here.
      sendMessage();
    });
  });
});

chrome.commands.onCommand.addListener(function (command) {
  let vv = command.value;
  alert(vv;
});

chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
  if (msg.setAlarm) {
    // For testing only.  delayInMinutes will be rounded up to at least 1 in a
    // packed or released extension.
    chrome.alarms.create({
      delayInMinutes: 0.1
    });
  } else if (msg.delayedResponse) {
    // Note: setTimeout itself does NOT keep the page awake. We return true
    // from the onMessage event handler, which keeps the message channel open -
    // in turn keeping the event page awake - until we call sendResponse.
    setTimeout(function () {
      sendResponse("Got your message.");
    }, 5000);
    return true;
  } else if (msg.getCounters) {
    sendResponse({
      counter: counter++,
      persistentCounter: localStorage.counter++
    });
  }
  // If we don't return anything, the message channel will close, regardless
  // of whether we called sendResponse.
});

chrome.alarms.onAlarm.addListener(function () {
  alert("Time's up!");
});
chrome.runtime.onSuspend.addListener(function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // After the unload event listener runs, the page will unload, so any
    // asynchronous callbacks will not fire.
    alert("This does not show up.");
  });
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({
    text: ""
  });
  chrome.tabs.sendMessage(lastTabId, "Background page unloaded.");
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
chrome.declarativeContent.onPageChanged.addRules([{
  conditions: [new chrome.declarativeContent.PageStateMatcher({
    pageUrl: {
      hostEquals: 'seek.com.au'
    },
  })],
  actions: [new chrome.declarativeContent.ShowPageAction()]
}]);
});
