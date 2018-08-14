var SCRIPT_ID = '1OyjlytEo2uEorwa12PyFanPBm549L9Koe2Fl5Mwkg-p-5V4k7k-KgDsc';
var f1, f2, f3, f4, f5, f6, f7;
var o1, o2, o3;
var theOpts = [o1, o2, o3];
var theTitz = ["JobTitle", "Company", "Contact", "Number", "USP1", "USP2", "USP3"];
var theVals = [f1, f2, f3, f4, f5, f6, f7];
var exec_Senddata = "[[\"JobTitle,\"Company\",\"Contact\",\"Number,\"USP1\",\"USP2\",\"USP3\"][\"" + f1 + "\",\"" + f2 + "\",\"" + f3 + "\",\"" + f4 + "\",\"" + f5 + "\",\"" + f6 + "\",\"" + f7 + "\"]]";
var exec_Optsdata = "[[\"sheetId,\"templateId\",\"folderId\"][\"" + o1 + "\",\"" + o2 + "\",\"" + o3 + "\"]]";

var STATE_START = 1;
var STATE_ACQUIRING_AUTHTOKEN = 2;
var STATE_AUTHTOKEN_ACQUIRED = 3;
var state = STATE_START;


function sendValsToSheet(token) {
	console.log('sendValstoSheet');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'process1',
			'parameters': { 'data': JSON.parse(exec_Senddata.value) }
		}
	});
}
function sendVals() {
	chrome.storage.local.get(['theVals'], function (object) {
		var viObj = object.theVals;
		var exec_Senddata = "[[\"JobTitle,\"Company\",\"Contact\",\"Number,\"USP1\",\"USP2\",\"USP3\"][\"" + viObj[0] + "\",\"" + viObj[1] + "\",\"" + viObj[2] + "\",\"" + viObj[3] + "\",\"" + viObj[4] + "\",\"" + viObj[5] + "\",\"" + viObj[6] + "\"]]";
		console.log(exec_Senddata);
		sendVals2();
	});
}
function sendVals2() {
	getAuthToken({
		'interactive': false,
		'callback': sendValsToSheet,
	});
}

function changeState(state) {
	var newState = state;
	switch (newState) {
		case STATE_START:
		chrome.storage.local.set({ state: state });	
		break;
		case STATE_ACQUIRING_AUTHTOKEN:
			break;
		case STATE_AUTHTOKEN_ACQUIRED:
		chrome.storage.local.set({ state: state });	
		break;
	}
}

function getAuthToken(options) {
	chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
}
function getAuthTokenSilent() {
	getAuthToken({
		'interactive': false,
		'callback': getAuthTokenCallback
	});
}
function getAuthTokenInteractive() {
	getAuthToken({
		'interactive': true,
		'callback': getAuthTokenCallback
	});
}
function getAuthTokenCallback(token) {
	if (chrome.runtime.lastError) {
		alert('No token aquired');
		changeState(STATE_START);
	} else {
		alert('Logged In');
		changeState(STATE_AUTHTOKEN_ACQUIRED);		
	}
}

function getState(){
	chrome.storage.local.get(['state'], function (object) {
		var tiObj = object.state;
			return state;
	});
}

function sendOpts() {
	var s = document.getElementById('shtin').value.trim();
	var t = document.getElementById('fldin').value.trim();
	var f = document.getElementById('tplin').value.trim();
	if (s) {
		var newIds = [s, t, f];
		chrome.storage.local.set({ theIds: newIds });
		exec_Optsdata = "[[\"sheetId,\"templateId\",\"folderId\"][\"" + s + "\",\"" + t + "\",\"" + f + "\"]]";
	} else {
		exec_Optsdata = "[[\"sheetId,\"templateId\",\"folderId\"][\"" + o1 + "\",\"" + o2 + "\",\"" + o3 + "\"]]";
	}
	getAuthToken({
		'interactive': false,
		'callback': sendOptsToSheet,
	});
}
function sendOptsToExecutionAPI() {
	//disableButton(upIds);
	//upIds.className = 'loading';
	getAuthToken({
		'interactive': false,
		'callback': sendOptsToSheet,
	});
}
function sendDataToExecutionAPICallback(token) {
	sampleSupport.log('Sending data to Execution API script');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'sendOpts',
			'parameters': { 'data': JSON.parse(exec_Senddata.value) }
		}
	});
}
function sendOptsToSheet(token) {
	alert('Sending IDs to Execution API script');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'setIds',
			'parameters': { 'data': JSON.parse(exec_Optsdata.value), 'sheetId': 'itWorks!' }
		}
	});
}
function sendDataToExecutionAPI() {
	getAuthToken({
		'interactive': false,
		'callback': sendDataToExecutionAPICallback,
	});
}
function executionAPIResponse(response) {
	console.log(JSON.stringify(response));
	//	upIds.classList.remove('loading');
	var info;
	if (response.response.result.status == 'ok') {
		alert('Data has been entered into <a href="' + response.response.result.doc + '" target="_blank"><strong>this sheet</strong></a>');
	} else {
		alert('Error...');
	}
	//chrome.windows.getCurrent(function (currentWindow) {
	//	currentWindow.document.querySelector('#exec_result').innerHTML = info;
	//});
}
function revokeToken() {
	exec_result.innerHTML = '';
	getAuthToken({
		'interactive': false,
		'callback': revokeAuthTokenCallback,
	});
}
function revokeAuthTokenCallback(current_token) {
	if (!chrome.runtime.lastError) {
		chrome.identity.removeCachedAuthToken({ token: current_token }, function () { });
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
			current_token);
		xhr.send();
		changeState(STATE_START);
		alert('Token revoked and removed from cache. ' +
			'Check chrome://identity-internals to confirm.');
	}
}
function post(options) {
	alert('posting');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// JSON response assumed. Other APIs may have different responses.
			options.callback(JSON.parse(xhr.responseText));
		} else if (xhr.readyState === 4 && xhr.status !== 200) {
			alert('post', xhr.readyState, xhr.status, xhr.responseText);
		}
	};
	xhr.open('POST', options.url, true);
	xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
	xhr.send(JSON.stringify(options.request));
}

function close() {
	chrome.windows.getCurrent(function (currentWindow) {
		window.close(currentWindow);
	});
}
function resetIt() {
	chrome.storage.local.get(['theTitz'], function (object) {
		var tiObj = object.theTitz;
		for (var w = 0; w < tiObj.length; w++) {
			var t = tiObj[w];
			chrome.contextMenus.update(t, { "title": t });
		}
		chrome.storage.local.clear();
	});
}

function addVCon() {		
	chrome.contextMenus.create({
		"id": "JobTitle", "parentId": parent,
		"title": "JobTitle",
		"contexts": ["selection"]
	});

	
chrome.contextMenus.create({
	"id": "Company", "parentId": parent,
	"title": "Company",
	"contexts": ["selection"],
	"visible": true
});
chrome.contextMenus.create({
	"id": "Contact", "parentId": parent,
	"title": "Contact",
	"contexts": ["selection"],
	"visible": true
});
chrome.contextMenus.create({
	"id": "Number", "parentId": parent,
	"title": "Number",
	"contexts": ["selection"],
	"visible": true
});
chrome.contextMenus.create({
	"id": "USP1", "parentId": parent,
	"title": "USP1",
	"contexts": ["selection"],
	"visible": true
});
chrome.contextMenus.create({
	"id": "USP2", "parentId": parent,
	"title": "USP2",
	"contexts": ["selection"],
	"visible": true
});
chrome.contextMenus.create({
	"id": "USP3",
	"parentId": parent,
	"title": "USP3",
	"contexts": ["selection"],
	"visible": true
});
chrome.contextMenus.create({"ItemType":"separator"});
chrome.contextMenus.create({
	"id": "GO!",
	"parentId": parent,
	"title": "GO!",
	"contexts": ["all"],
	"visible": true
});
chrome.contextMenus.create({
	"id": "Reset",
	"parentId": parent,
	"title": "Reset",
	"contexts": ["all"],
	"visible": true
});
chrome.contextMenus.create({"parentId": parent,	"itemType": "separator"});
chrome.contextMenus.create({
	"id": "SignIn",
	"parentId": parent,
	"title": "SignIn",
	"contexts": ["all"],
	"visible": true
});	

/*	
	case STATE_ACQUIRING_AUTHTOKEN:
	chrome.contextMenus.create({
		"id": "SIGNING IN.",
		"parentId": parent,
		"title": "SIGNING IN.",
		"contexts": ["all"],
		"visible": true
	});
*/
}


chrome.runtime.onInstalled.addListener(function () {
	getAuthTokenSilent();
});

var parent = chrome.contextMenus.create({
	"title": "autoSEEKr", "id": "parent",
	"contexts": ["all"]
});

addVCon();



// MESSAGES FROM CONTENT/POPUP SCRIPTS

var contentJsPort, popupJsPort;

function msgListener(p) {
  contentJsPort = p;
  contentJsPort.postMessage({greeting: "hi there content script!"});

	contentJsPort.onMessage.addListener(function(m) {
    	console.log("In background script, received message from content script")
		
		console.log(m.greeting);
  	});
}


chrome.runtime.onConnect.addListener(msgListener);

chrome.browserAction.onClicked.addListener(function() {
  contentJsPort.postMessage({greeting: "they clicked the button!"});
});



// LISTENERS...




chrome.contextMenus.onClicked.addListener(function (item, tab) {
	var sel2 = item.selectionText;
	var tit = item.menuItemId;
	if (tit == 'parent') {
	}
	 if (tit == 'SignIn') {
	getAuthTokenInteractive();
	} 
	 if (tit == 'GO!') {
	console.log('SENDING!	');
	sendVals();
	} 
	 if (tit == 'Reset') {
	resetIt();
	} else {
	//	alert(tit + " : " + item.selectionText);
	chrome.contextMenus.update(tit, { "title": tit + ': ' + sel2 }, function () {
			chrome.storage.local.get(['theVals'], function (object) {
				chrome.storage.local.get(['theTitz'], function (objtit) {
					var theArray = object.theVals || [];
					var theTitArray = objtit.theTitz || [];
					theArray.push(sel2);
					theTitArray.push(tit);
					alert(theArray + "  " + theTitArray);
					chrome.storage.local.set({ 'theVals': theArray }, function () {
						chrome.storage.local.set({ 'theTitz': theTitArray }, function () {
							var len = theArray.length;
							var tlen = theTitz.length;
							switch (len) {
								case "default":
									break;
								case "6":
									sendVals();
									break;
							}
						});
					});
				});
			});
		});
	}
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (var key in changes) {
		var storageChange = changes[key];
		console.log('Storage key "%s" in namespace "%s" changed. ' +
			'Old value was "%s", new value is "%s".',
			key,
			namespace,
			storageChange.oldValue,
			storageChange.newValue);
	}
	alert(item.key + ' onChange notification, now: ' + item.value);
});