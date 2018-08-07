// Use of this source code is governed by a BSD-style license that can be found in the LICENSE file.
document.body.innerHTML="";

function addSect(questionObj) {
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
  document.body.appendChild(titlebar);
}
function storageSet(tit, val){
  chrome.storage.sync.set({tit : val}, function() {
    console.log('Value is set to ' + val);
    return result.tit;
  });
}
function storageGet(tit){
  chrome.storage.sync.get(tit, function(result) {
    return result.value;
  });
}
function moveFwd(obj){
  var titleE = document.getElementById(obj.domid);
  var val = obj.value;
  titleE.setAttribute('value', info);
  titleE.style.opacity="0.5";
  titleE.style.color="black";
  var employE = document.getElementById(next).style.display = 'block';
  return;
}
var theFields = ([
  {
    "title":"JobTitle",
    "id": "1",
    "domid": "tit",
    "value":undefined
  },
  {
    "title":"Company",
    "id": "2",
    "domid": "employ",
    "value":undefined
  },
  {
    "title":"Contact",
    "id": 3,
    "domid":"cont",
    "value":undefined
  },
  {
    "title":"USP1",
    "id": "4",
    "domid":"uspi",
    "value":undefined
  },
    {
      "title":"USP2",
    "id": "5",
    "domid":"uspii",
    "value":undefined
  },
  {
    "title":"USP3",
    "id": "6",
    "domid":"uspiii",
    "value":undefined
  }]
);

for (var t=1;t<=theFields.length;++t){
  addSect(theFields[t]);
  }
addButton("close-button", "closeWindow");
  
chrome.contextMenus.create({
  "id": 1,
  "title": theFields[0].title,
  "contexts": ["selection"],
  });
chrome.contextMenus.onClicked.addListener(function(e) {
  if (e.selectionText){
    var id =String(numId);
    var ret = storageSet(id,e.selectionText);
      chrome.contextMenus.update(id,{
      "title": theFields.id.title+": "+ret
     }, popPicker('frameless_window.html'));
    chrome.contextMenus.create({
      "id": String(id++),
      "title": theFields[id].title,
      "contexts": ["selection"],
      });
  }
});



// on load...
//on click?

