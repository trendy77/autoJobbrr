var f1, f2, f3, f4, f5, f6, f7, f8;
var jobAppFields = {
	"JobTitle": f1,
	"Company": f2,
	"Agency": f8,
	"Contact": f3,
	"Contact/Email": f4,
	"USP1": f5,
	"USP2": f6,
	"USP3": f7
};
var SCRIPT_ID = '1OyjlytEo2uEorwa12PyFanPBm549L9Koe2Fl5Mwkg-p-5V4k7k-KgDsc';
var o1, o2, o3;
var exec_Optsdata = [o1, o2, o3];
//var theTitz = ["JobTitle", "Company", "Contact", "Number", "USP1", "USP2", "USP3"];
//var theVals = [f1, f2, f3, f4, f5, f6, f7];
var exec_Senddata;
var appNumber = 1;
var STATE_START = 1;
var STATE_ACQUIRING_AUTHTOKEN = 2;
var STATE_AUTHTOKEN_ACQUIRED = 3;
var state = STATE_START;
var contentJsPort =c;
var popupJsPort =p;

function addButton(parent, eleType, cla) {
	var a = document.createElement(eleType);
	var par = document.querySelector(parent);
	var cla = "btn-floating pulse";
	par.appendChild(a);
	document.body.appendChild(par);
}
function closeWindow() {
	window.close();
}
function focusSection(obj) {
	var bg_cr = "#3a3d3d";
	
	var focusOnNow = document.getElementById(next);
	var focusPrev = document.getElementById(obj.domid);
	focusOnNow.style.backgroundColor = bg_cr;
	focusOnNow.style.opacity = "1";
	focusPrev.style.opacity = "0.5";
	document.body.appendChild(focusOnNow);
}
function setIcon(opt_badgeObj) {
	if (opt_badgeObj) {
		var badgeOpts = {};
		if (opt_badgeObj && opt_badgeObj.text != undefined) {
			badgeOpts.text = opt_badgeObj.text;
		}
		chrome.browserAction.setBadgeText(badgeOpts);
	}
}

function changeState(newState) {
	state = newState;
	switch (state) {
		case STATE_START:
		
			break;
		case STATE_ACQUIRING_AUTHTOKEN:
			exec_info.innerHTML += 'Acquiring token...';
			break;
		case STATE_AUTHTOKEN_ACQUIRED:
			chrome.contextMenus.update('RevokeToken', { visible: true });
			chrome.contextMenus.update('SignIn', { visible: false });
			chrome.contextMenus.update('ResetFields', { visible: true });
			chrome.contextMenus.update('Send2Sheet', { visible: true });
			break;
	}
}

function sendValsToSheet(token) {
	console.log('sendValstoSheet');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'process1',
			'parameters': JSON.parse(exec_Senddata.value)
		}
	});
}
function sendVals() {
	var activ = 'app' + appNumber.toString();

	chrome.storage.local.get([activ], function (object) {
		var thedat = object.activ;
		exec_Senddata = thedat;
		//"[" + viObj[0] + "\,\"" + viObj[1] + "\",\"" + viObj[2] + "\",\"" + viObj[3] + "\",\"" + viObj[4] + "\",\"" + viObj[5] + "\",\"" + viObj[6] + "\"]]";
		console.log(exec_Senddata);
		getAuthToken({
			'interactive': false,
			'callback': sendValsToSheet
		});
	});
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
		sampleSupport('No token aquired');
		changeState(STATE_START);
	} else {
		sampleSupport('Logged In');
		changeState(STATE_AUTHTOKEN_ACQUIRED);
	}
}
function sendOpts() {
	var s = document.getElementById('shtin').value.trim();
	var t = document.getElementById('fldin').value.trim();
	var f = document.getElementById('tplin').value.trim();
	if (typeof s !== 'undefined') {
		var newIds = [s, t, f];
		chrome.storage.sync.set({ theIds: newIds });
		exec_Optsdata = "[\"sheetId\":\"" + s + "\",\"folderId\":\"" + f + "\",\"templateId\":\"" + t + "\"}";
		getAuthToken({
			'interactive': false,
			'callback': sendOptsToSheet,
		});
	}
}
function sendOptsToExecutionAPI() {
	getAuthToken({
		'interactive': false,
		'callback': sendOptsToSheet,
	});
}
function sendDataToExecutionAPICallback(token) {
	exec_info.innerHTML += 'Sending data to Execution API script';
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'sendOpts',
			'parameters': exec_Senddata
		}
	});
}
function sendOptsToSheet(token) {
	sampleSupport('Sending IDs to Execution API script');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'setIds',
			'parameters': { 'data': JSON.parse(exec_Optsdata.value) }
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
		sampleSupport('Data has been entered into <a href="' + response.response.result.doc + '" target="_blank"><strong>this sheet</strong></a>');
	} else {
		sampleSupport('Error...');
	}
	chrome.windows.getCurrent(function (currentWindow) {
		currentWindow.document.querySelector('#exec_result').innerHTML = info;
	});
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
		sampleSupport('Token revoked and removed from cache. ' +
			'Check chrome://identity-internals to confirm.');
	}
}
function post(options) {
	sampleSupport('posting');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// JSON response assumed. Other APIs may have different responses.
			options.callback(JSON.parse(xhr.responseText));
		} else if (xhr.readyState === 4 && xhr.status !== 200) {
			sampleSupport('post', xhr.readyState, xhr.status, xhr.responseText);
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
	chrome.storage.local.get(['theVals'], function (object) {
		var tiObj = object.theVals;
		for (var w in theTitz) {
			chrome.contextMenus.update(theTitz[w], { "title": theTitz[w] });
		}
		chrome.storage.local.clear();
	});
}

// LISTENERS...

// on install.
chrome.runtime.onInstalled.addListener(function () {
	var parent = chrome.contextMenus.create({ title: "autoSEEKr", id: "parent", contexts: ['all'] });
	for (let key of Object.keys(jobAppFields)) {
		chrome.contextMenus.create({
			id: key,
			parentId: parent,
			title: key,
			contexts: ['selection']
		});
	}
	//		chrome.contextMenus.create({id: "Agency", parentId: parent,title: "Agency","contexts": ["all"],"type": "checkbox"});
	chrome.contextMenus.create({ id: 's2', parentId: parent, type: 'separator', contexts: ['all'] });
	chrome.contextMenus.create({ id: "Send2Sheet", parentId: parent, title: "Send2Sheet", contexts: ["all"], visible: false });
	chrome.contextMenus.create({ id: "ResetFields", parentId: parent, title: "ResetFields", contexts: ['all'], visible: false });
	chrome.contextMenus.create({ id: 's1', parentId: parent, type: 'separator', contexts: ['all'] });
	chrome.contextMenus.create({ id: "SignIn", parentId: parent, title: "SignIn", contexts: ["all"] });
	chrome.contextMenus.create({ id: "RevokeToken", parentId: parent, title: "RevokeToken", contexts: ["all"], visible: false });
});

// on open...
chrome.runtime.onConnect.addListener(msgListener);
chrome.runtime.onConnect.addListener(conListener);
// on click (context menu)
chrome.contextMenus.onClicked.addListener(function (item, tab) {
	//	let url = 'https://google.' + item.menuItemId + '/search?q=' + item.selectionText; chrome.tabs.create({url: url, index: tab.index + 1});
	var sel2 = item.selectionText;
	var tit = item.menuItemId;
	if (tit == 'Send2Sheet') {
		//preloader();
		sendVals();
	} else if (tit == 'SignIn') {
		getAuthTokenInteractive();
	} else if (tit == 'GoToSheet') {
	} else if (tit == 'Reset') {
		resetIt();
	} else {
		chrome.storage.local.get(['jobAppFields'], function (object) {
			var disAppObj = object.jobAppFields || [];
			disAppObj[tit] = sel2;
			chrome.storage.local.set({ jobAppFields: disAppObj }, function () {

			});
		});
	}
});

// on storage change
chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (var key in changes) {
		var storageChange = changes[key];
		console.log('Storage key "%s" in namespace "%s" changed. ' +
			'Old value was "%s", new value is "%s".',
			key,
			namespace,
			storageChange.oldValue,
			storageChange.newValue);
		chrome.contextMenus.update(key, { title: key + '= ' + storageChange.newValue });
	}
	contentJsPort.postMessage({ greeting: "hi there content script!" });
	exec_info.innerHTML += (item.key + ' onChange notification, now: ' + item.value);
});


// MESSAGES FROM CONTENT/POPUP SCRIPTS
function msgListener(p) {
	popupJsPort = p;
	popupJsPort.onMessage.addListener(function (m) {
		console.log("In background script, received message from popup script");
		var msgObj = m.msg;
		console.log(msgObj);
	});
}
function conListener(c) {
	contentJsPort = p;
	//contentJsPort.postMessage({ greeting: "hi there content script!" });
	contentJsPort.onMessage.addListener(function (m) {
		console.log("In background script, received message from content script");
		console.log(m);
	});
}