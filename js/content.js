var bk = chrome.extension.getBackgroundPage();
var bkJsPort = chrome.runtime.connect( { name: "port-content" } );;

function renderButton() {
 var dom_item = document.createElement('a');
 domSetAttribute('dom_item', 'class','floating btn-large hoverable blue-grey darken-4 pulse');
  domSetAttribute('dom_item', 'id', 'seekBut');
 var goButt = document.createElement('i');
 domSetAttribute('goButt', 'class', 'material-icons right');
var go=chrome.extension.getBackgroundPage.setVal;
goButt.addEventListener('click', go.bind(goButt,true));
var t = document.createTextNode();
t.innerText="Set Highlighted Text" ;
domAppendChild(goButt,t);
domAppendChild(dom_item,goButt);
document.body.appendChild(dom_item);
}


bkJsPort.onMessage.addListener(function (m) {
  console.log("In content script, received message from bkgrd script");
  var msgObj = m.msg;
  if (typeOf(msgObj.jobAppFields) !== 'undefined') {
    var fieldSet = msgObj.jobAppFields;
    console.log(fieldSet);
  }
  });
  

  
document.addEventListener('DOMContentLoaded', function() {
renderButton();

var myPort = browser.runtime.connect({name:"port-contentjs"});
myPort.postMessage({msg: "hi"});

myPort.onMessage.addListener(function(m) {
  var keys = Object.keys(m);
  for (var r in keys){
     console.log(keys[r]+"  "+ keys[r].value);
}
});


document.body.addEventListener("click", function() {
   myPort.postMessage({greeting: "they clicked the button!"});
});
=======
'use strict';

var idz = [];
const titles = ["JobTitle","Company","Contact","Agency","Contact#","Location","USP1","USP2","USP3","Agency","misc"];
var contexts= ["selection","link","editable","image","video"];

function process(info, tab) {
	var t=info;
	alert(info);
	alert(tab);
		if (info.selectionText){
		  var text =info.selectionText;
		  var id =info.menuItemId;
		  for (let t = 0; t < idz.length; t++) {
			  const ele = idz[t];
			  if(ele==id){
				theVals[t]=text;
				chrome.contextMenus.update(id,{"title": thatits[t] +": "+text });
				return ;  
			  }
		  }
		}
	}
		
// autoSEEKr content.js
// 
// 

chrome.tabs.insertCSS(tabId,details, function callback); 

chrome.runtime.onConnect.addListener(conListener);
var contentJsPort =  chrome.runtime.connect({ name: "port-content" });

// LISTENERS...
// Messages
contentJsPort.onMessage.addListener(function (m) {
	var keys = Object.keys(m);
	for (var r in keys) {
		console.log(keys[r] + "  " + keys[r].value);
	}
});




var fieldInfo = {
  "title": document.title,
  "selection": window.getSelection().toString()
};

chrome.runtime.connect().postMessage(fieldInfo);