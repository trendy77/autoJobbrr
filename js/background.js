// new back...
var counter=1;
var SHEETLIST_SCOPE = 'https://sheets.google.com/feeds';
var FLDLIST_SCOPE = 'https://drive.google.com/feeds';
var DOCLIST_SCOPE = 'https://docs.google.com/feeds';
var DOCLIST_FEED = DOCLIST_SCOPE + '/default/private/full/';
var FLDLIST_FEED = FLDLIST_SCOPE + '/default/private/full/';
var docs,folders = []; // In memory cache for the user's entire doclist.
var refreshRate = localStorage.refreshRate || 300; // 5 min default.
var pollIntervalMin = 1000 * refreshRate;
var theFields = [
  {
    "title":"JobTitle",
    "id": 1,
    "domid": "tit",
    "value":undefined,
    "done":false
  },
  {
    "title":"Company",
    "id": 2,
    "domid": "employ",
    "value":undefined,
    "done":false
  },
  {
    "title":"Contact",
    "id": 3,
    "domid":"cont",
    "value":undefined,
    "done":false
  },
  {
    "title":"USP1",
    "id": 4,
    "domid":"uspi",
    "value":undefined,
    "done":false
  },
    {
      "title":"USP2",
    "id": 5,
    "domid":"uspii",
    "value":undefined,
    "done":false
  },
  {
    "title":"USP3",
    "id": 6,
    "domid":"uspiii",
    "value":undefined,
    "done":false
  }];

// options
  var sheetId = "";  
  var templateId = "";
  var folderId = "";
  var ids = [sheetId,templateId,folderId];
  for(var z in ids){
    var go = ids[z];
    chrome.storage.sync.get(go, function(result) {
    if (!chrome.runtime.error) {
      document.getElementById(go).innerText = result.data;
    }
  });
}

function getSelected(){
  var info = window.getSelection().toString();
  return info;
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

chrome.runtime.onInstalled.addListener(function(e) {
  chrome.runtime.openOptionsPage();
});

chrome.webNavigation.onCompleted.addListener(function(e) {
  var parent = chrome.contextMenus.create({"title": "JobAdder"});
  for(var t=0;t<theFields.length;++t){
    var disOne=theFields[t];
    var idd = chrome.contextMenus.create({"id":disOne.id,"title": disOne.title, "parentId": parent,"contexts": ["selection"]});
}},{url: [{hostSuffix: 'seek.com'},{hostSuffix: 'seek.com.au'}]});

chrome.contextMenus.onClicked.addListener(function(e) {
    if (e.selectionText){
      var text =e.selectionText;
      var id =e.menuItemId;
      var store = { id : text };
      chrome.storage.sync.set(store, function(e) {
        console.log('Value is set to ' + e.value);
        appendText(e.data,id);
        if (id==6){ endit(); }else{
          chrome.contextMenus.update(id,{
          "title": theFields.title +": "+e.selectionText });
       }});
    }
});
 
chrome.runtime.onSuspend.addListener(function() {
 });
console.log("Unloading.");
  
  
  
