// new back...

var sheetId = storageGet("sheetId");
var templateId = storageGet("templateId");
var folderId = storageGet("folderId");
var ids = [sheetId,templateId,folderId];

var counter=1;
var SHEETLIST_SCOPE = 'https://sheets.google.com/feeds';
var FLDLIST_SCOPE = 'https://drive.google.com/feeds';
var DOCLIST_SCOPE = 'https://docs.google.com/feeds';
var DOCLIST_FEED = DOCLIST_SCOPE + '/default/private/full/';
var FLDLIST_FEED = FLDLIST_SCOPE + '/default/private/full/';
var docs,folders = []; // In memory cache for the user's entire doclist.
var refreshRate = localStorage.refreshRate || 300; // 5 min default.
var pollIntervalMin = 1000 * refreshRate;

function areNewOptions(key,val) {
var curOption = storageGet(key);
    if (val != curOption) {
     return true;
   }
 return false;
}
function getElement(element) {
 return document.getElementById(element);
}
function appendText(text,element) {
   document.getElementById(element).innerHTML += text;
}
function popPicker(htmlPick){
   chrome.windows.create({url: htmlPick,
        type: "popup",
        frame: "none",
        id: "framelessWinID",
        innerBounds: {
          width: 260,
          height: 300,
          left: 600,
          minWidth: 220,
          minHeight: 220
       }});
}

function progress(obj){
  var info = window.getSelection().toString();
  obj.value = info;
  storageSet(obj.title,obj.value);
  focusSection(obj);
}
function addButton(name, cb) {
  var a = document.createElement("button");
  a.setAttribute("class","btn-floating pulse");
  a.innerText = name;
  a.onclick = cb;
  document.body.appendChild(document.createElement("br"));
  document.body.appendChild(a);
}
function closeWindow() {
  window.close();
}
function focusSection(obj) {
  var bg_cr = "#3a3d3d";
  var next = (obj.id+1);
  var focusOnNow = document.getElementById(next.domid);
  var focusPrev = document.getElementById(obj.domid);
  focusOnNow.style.backgroundColor = bg_cr;
  focusOnNow.style.opacity = "1";
  focusPrev.style.opacity = "0.5";
  document.body.appendChild(focusOnNow);
}
function loadJs(theJs) {
  chrome.tabs.executeScript({file: theJs});
}
function setIcon(opt_badgeObj) {
  if (opt_badgeObj) {
    var badgeOpts = {};
    if (opt_badgeObj && opt_badgeObj.text != undefined) {
      badgeOpts['text'] = opt_badgeObj.text;
    }
     chrome.browserAction.setBadgeText(badgeOpts);
  }
}

function logout() {
  docs = [];
  setIcon({'text': ''});
  oauth.clearTokens();
  clearPendingRequests();
}
  // on install...
  chrome.runtime.onInstalled.addListener(function() {
    alert("PLEASE GO TO OPTIONS !");
    var oauth = ChromeExOAuth.initBackgroundPage({
      'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
      'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
      'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
      'consumer_key': 'anonymous',
      'consumer_secret': 'anonymous',
      'scope': [DOCLIST_SCOPE],
      'app_name': 'JobApplier'
    });
});
    
  chrome.webNavigation.onCompleted.addListener(function() {
    chrome.contextMenus.create({
      "id": counter,
      "title": theFields[(counter-1)].title,
      "contexts": ["selection"],
      }).onClick.addListener(function(){
        counter++;
      progress();
      });
  }, {url: [{urlMatches : 'https://*.seek.com*'}]});

  chrome.runtime.onSuspend.addListener(function() {
  });

  console.log("Unloading.");