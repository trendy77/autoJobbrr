'use strict';
var theFields = [
{
	"title":"JobTitle",
	"id": 1,
	"domid": "tit",
	"value":"undefined",
	"done":false
},
{
	"title":"Company",
	"id": 2,
	"domid": "employ",
	"value":"undefined",
	"done":false
},
{
	"title":"Contact",
	"id": 3,
	"domid":"cont",
	"value":"undefined",
	"done":false
},
{
	"title":"USP1",
	"id": 4,
	"domid":"uspi",
	"value":"undefined",
	"done":false
},
{
	"title":"USP2",
	"id": 5,
	"domid":"uspii",
	"value":"undefined",
	"done":false
},
{
	"title":"7",
	"id": 7,
	"domid":"7",
	"value":"undefined",
	"done":false
},
{
	"title":"8",
	"id": 8,
	"domid":"8",
	"value":"undefined",
	"done":false
},
{
	"title":"9",
	"id": 9,
	"domid":"9",
	"value":"undefined",
	"done":false
}];
var theVals = [theFields[0].value, theFields[1].value, theFields[5].value, theFields[7].value, theFields[8].value, theFields[9].value];
function disableField(field) {
	field.setAttribute('opacity', '0.6');
	field.setAttribute('font-size', '12px');
}
function enableField(field) {
	field.setAttribute('opacity', '1');
	field.setAttribute('font-size', '16px');
}
function disableButton(button) {
	button.setAttribute('disabled', 'disabled');
}
function enableButton(button) {
	button.removeAttribute('disabled');
}
function changeState(newState) {
	state = newState;
	switch (state) {
		case STATE_START:
			enableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
		case STATE_ACQUIRING_AUTHTOKEN:
			sampleSupport.log('Acquiring token...');
			disableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
		case STATE_AUTHTOKEN_ACQUIRED:
			disableButton(signin_button);
			enableButton(xhr_button);
			enableButton(revoke_button);
			break;
	}
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
function createJobForm() {
	chrome.storage.sync.get('theFields', function (list) {
		let div = document.getElementById('form');
			for (var i = 0; i < list.length; i++) {
				let theField = theFields[i];
				let domid = theField.domid;
				let field = createJobField(theField);
				if (theField.done == false) {
					field.setAttribute('opacity', '0.7');
				} else {
					field.setAttribute('opacity', '1');
				}
				div.appendChild(field);
			}
	});
}
function createJobField(theField) {
	let div1 = document.createElement('div');
	div1.setAttribute('class', 'container');
	let div2 = document.createElement('div');
	div2.setAttribute('class', 'card blue-grey darken-1');
	let div3 = document.createElement('div');
	div3.setAttribute('class', 'card-content white-text');
	let span = document.createElement('span');
	span.setAttribute('class', 'card-title');
	let title = document.createElement('h6');
	title.innerText = theField.title;
	span.appendChild(title);
	div3.appendChild(span);
	div2.appendChild(div3);
	let infield = document.createElement('input');
	infield.setAttribute('placeholder', theField.value);
	infield.setAttribute('type', 'text');
	div2.appendChild(infield);
	div1.appendChild(div2);
	return div1;
}
function sendDataToExecutionAPIData() {
	disableButton(gobutton);
	gobutton.className = 'loading';
	getAuthToken({
		'interactive': false,
		'callback': sendDataToExecutionAPICallbackData,
	});
}
function sendDataToExecutionAPICallbackData(token) {
	sampleSupport.log('Sending data to Execution API script');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponseData,
		'token': token,
		'request': {
			'function': 'process1',
			'parameters': {
				JSON.parse(theVals)
			}
		}
	});
}
function post(options) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// JSON response assumed. Other APIs may have different responses.
			options.callback(JSON.parse(xhr.responseText));
		} else if (xhr.readyState === 4 && xhr.status !== 200) {
			sampleSupport.log('post', xhr.readyState, xhr.status, xhr.responseText);
		}
	};
	xhr.open('POST', options.url, true);
	xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
	xhr.send(JSON.stringify(options.request));
}
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