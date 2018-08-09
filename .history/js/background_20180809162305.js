'use strict';
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

	var theVals = [theFields[0].value,theFields[1].value,theFields[5].value,theFields[7].value,theFields[8].value,theFields[9].value];


function process(e) {
	if (e.selectionText){
		var text =e.selectionText;
		var id =e.menuItemId;
		theFields[(id-1)].value = text;
		chrome.contextMenus.update(id,{"title": theFields[(id-1)].title +": "+text });
		chrome.storage.sync(theFields[(id-1)]);
	} else {
		alert('HIGHLIGHT SOME TEXT FIRST!')
	}
}


chrome.runtime.onInstalled.addListener(function() {
	var parent = chrome.contextMenus.create({"title": "JobAdder"});
	for(var t=0;t<theFields.length;++t){
		var disOne=theFields[t];
	 for (let key of Object.keys(theFields)) {
    chrome.contextMenus.create({
			id: disOne.id,
			parentId: 'parent',
			title: disOne.title,
      type: 'normal',
      contexts: ['selection'],
    });
  }
}
});

chrome.contextMenus.onClicked.addListener(function(item, tab) {
var mod = item.menuItemId-1;
theFields[mod].id = item.menuItemId;
theFields[mod].value = item.selectionText;
chrome.storage.sync(theFields[mod]);
process(item);
chrome.tabs.create({url: "popup.html", index: tab.index + 1});
}); 