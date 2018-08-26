// https://script.google.com/macros/s/AKfycbxB5hPATZclDz6hwe-HKi5o-g9bXtnug6x9nNT5zyBlyeY0pB0/exec
//
//API Key		MXmsJN0_nH3qsA5u644e9P8lvjbIvZS7r

var STATE_START = 1;
var STATE_ACQUIRING_AUTHTOKEN = 2;
var STATE_AUTHTOKEN_ACQUIRED = 3;
var state = STATE_START;

var jobAppFields = {
	"JobTitle": "",
	"Company": "",
	"Agency": "",
	"Contact": "",
	"Phone-Email": "",
	"USP1": "",
	"USP2": "",
	"USP3": "",
	"Url": ""
};
//	fullName : function() {
//			return this.firstName + " " + this.lastName;

var theTitles = Object.keys(jobAppFields);
var theVals = Object.values(jobAppFields);
var entries = Object.entries(jobAppFields);
var SCRIPTID = "1OyjlytEo2uEorwa12PyFanPBm549L9Koe2Fl5Mwkg-p-5V4k7k-KgDsc";
/// https://script.google.com/macros/s/AKfycbxB5hPATZclDz6hwe-HKi5o-g9bXtnug6x9nNT5zyBlyeY0pB0/exec
//// !!! ONLY FOR TESTING....!
var o1 = "1TBqN2KpOMse7_pyKDSZW1QIFii1-5VAL9Zbz2np_TUM";
var o2 = "14850XpEs5bNWo8RttAMgUdvA4LE1UK2mFEhPpI9wk18";
var o3 = "1yOQqQ2Nwae5xvS2tuGbUNGUIRqGwqhWw";
////////////////////
var token;
var newIds;
var eOdata = [o1, o2, o3];
var iconText = "!";

function closeWindow() {
	window.close();
}
function disableButton(button) {
	button.setAttribute('disabled', 'disabled');
}
function enableButton(button) {
	button.removeAttribute('disabled');
}
function iconTit(text) {

	var opt_badgeObj = {};
	var textArr = text;
	opt_badgeObj.text = textArr;
	setIcon(opt_badgeObj);
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

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.msg == "getState") {
			sendResponse({ msg: state });
		}
	});

function resetIt() {
	chrome.storage.local.clear();
}
function sendLoad(msg, which) {
	if (msg == 'on') {
		chrome.runtime.sendMessage({
			msg: 'load',
			load: 'on',
			which: which
		});
	} else if (msg == 'off') {
		chrome.runtime.sendMessage({
			msg: 'load',
			load: 'off'
		});
	}
}
function sendLog(msg) {
	chrome.runtime.sendMessage({
		msg: 'log',
		log: msg
	});
}
// INTERNAL STATE FUNCTIONS
function sendStateChg(msg) {
	chrome.runtime.sendMessage({
		msg: 'state',
		state: msg
	});
}
function getSet() {
	chrome.tabs.query({ active: true }, function (tabs) {
		var info = tabs[0].url;
		chrome.storage.local.get(['jobAppFields'], function (obj) {
			var fields = obj.info.jobAppFields || {};
			return fields;
		});
	});
}
function setSet(fields) {
	chrome.tabs.query({ active: true }, function (tabs) {
		var info = tabs[0].url;
		chrome.storage.local.get(['jobAppFields'], function (obj) {
			var oldField = obj.jobAppFields || [];
			for (var k in fields) {
				oldField['k'] = fields.k;
			}
			chrome.storage.local.set(['jobAppFields'], function (obj) {
			});
		});
	});
}
function changeState(newState) {
	state = newState;
	sendStateChg(state);
	switch (state) {
		case STATE_START:
			authd = false;
			chrome.contextMenus.update('SignIn', { visible: true });
			chrome.contextMenus.update('Revoke', { visible: false });
			chrome.contextMenus.update('SendToSheet', { visible: false });
			chrome.contextMenus.update('GoToSheet', { visible: false });
			break;
		case STATE_ACQUIRING_AUTHTOKEN:
			sendLog('Acquiring token...');
			sendLoad('on', '#spin1');
			sendLoad('on', '#spin3');
			chrome.contextMenus.update('SignIn', { title: "SIGNING IN..." });
			sendLoad('on', 'auth');
			break;
		case STATE_AUTHTOKEN_ACQUIRED:
			sendLoad('off', '');
			authd = true;
			chrome.contextMenus.update('SignIn', { visible: false });
			chrome.contextMenus.update('Revoke', { visible: true });
			chrome.contextMenus.update('SendToSheet', { visible: true });
			chrome.contextMenus.update('GoToSheet', { visible: true });
			break;
	}
}
/// SEND FUNCTIONS
function sendOpts(theOpts) {
	newIds = theOpts
	sendLoad('on', 'upIds');
	getAuthToken({
		'interactive': false,
		'callback': sendOptsToSheet
	});
}
function sendOptsToSheet(token) {
	alert('sending ids to Sheet');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID +
			':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'setIds',
			'parameters': {
				'data': JSON.parse(newIds)
			}
		}
	});
}
function sendDataToSheet(token) {
	sendLog('sending fields to Sheet');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID +
			':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'process1',
			'parameters': {
				'data': JSON.parse(jobAppFields)
			}
		}
	});
}
function sendVals() {
	var dat = getSet();
	var thedat = object.jobAppFields;
	jobAppFields = thedat;
	//"[" + viObj[0] + "\,\"" + viObj[1] + "\",\"" + viObj[2] + "\",\"" + viObj[3] + "\",\"" + viObj[4] + "\",\"" + viObj[5] + "\",\"" + viObj[6] + "\"]]";
	getAuthToken({
		'interactive': false,
		'callback': sendValsToSheet
	});
}
//// AUTH FUNCTIONS
function getAuthToken(options) {
	chrome.identity.getAuthToken({
		'interactive': options.interactive
	}, options.callback);
}
function getAuthTokenSilent() {
	getAuthToken({
		'interactive': false,
		'callback': getAuthTokenCallback
	});
}
function getAuthTokenInteractive() {
	alert('signing in...');
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
		chrome.contextMenus.update('SignIn', { visible: false });
		chrome.contextMenus.update('RevokeToken', { visible: true });
		chrome.contextMenus.update('Send2Sheet', { visible: true });
		chrome.contextMenus.update('Go2Sheet', { visible: true });
		changeState(STATE_AUTHTOKEN_ACQUIRED);
	}
}
function executionAPIResponse(response) {
	var resp = JSON.stringify(response);
	alert(resp);
	var info;
	if (response.response.result.status == 'ok') {
		sendLog('Data has been entered into <a href="' + response.response
			.result
			.doc + '" target="_blank"><strong>this sheet</strong></a>');
	} else {
		sendLog('Error...');
	}
	sendLoad('off', '');
}
function revokeToken() {
	getAuthToken({
		'interactive': false,
		'callback': revokeAuthTokenCallback,
	});
}
function revokeAuthTokenCallback(current_token) {
	if (!chrome.runtime.lastError) {
		chrome.identity.removeCachedAuthToken({
			token: current_token
		}, function () { });
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
			current_token);
		xhr.send();
		changeState(STATE_START);
		sendLog(
			'Token revoked and removed from cache. chrome://identity-internals to confirm.'
		);
	}
	sendLoad('off', '');
}
//// POST FUNCTION
function post(options) {
	sendLog('posting');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// JSON response assumed. Other APIs may have different responses.
			options.callback(JSON.parse(xhr.responseText));
		} else if (xhr.readyState === 4 && xhr.status !== 200) {
			sendLog('post', xhr.readyState, xhr.status, xhr.responseText);
		}
	};
	xhr.open('POST', options.url, true);
	xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
	xhr.send(JSON.stringify(options.request));
}

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
	alert(key + ' onChange notification, now: ' + storageChange.newValue + 'namespace=' + namespace);
});

//chrome.tabs.onActivated.addListener(updateContent);
//chrome.tabs.onUpdated.addListener(updateContent);
/*
var key = "happyCount";
var obj = {};
obj[key] = someValueArray;
myArray.push(obj);
Update content when a new page is loaded into a tab.
*/

function updateContent() {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		lastTabId = tabs[0].id;
		chrome.tabs.sendMessage(lastTabId, state);
	});
}
function storageSet(titI, val) {
	//jobAppFields.uid = counter;
	jobAppFields[titI] = val;
	chrome.storage.local.set(['jobAppFields'], function (obj) {
		console.log(titI + ' is set to ' + val);
		return titI;
	});
}
function storageGet(titI) {
	chrome.storage.sync.get({ titI }, function (result) {
		return result;
	});
}

function saveVal(key, val) {
	jobAppFields[key] = val;
	chrome.storage.sync.set({
		jobAppFields
	}, function () {
		console.log(key + "is now set to " + val);
	});
	return val;
}

chrome.browserAction.setBadgeText({
	text: "ON"
});
console.log("Loaded.");

/*
		alert(url);
		var url = tabs[0].url;	
		jobAppFields.Url = url;
			chrome.storage.local.get(['jobAppFields'], function (storedVals) {
				alert('got job app fioelds ' + storedVals);
				jobAppFields = storedVals.jobAppFields;
				for (var s in jobAppFields) {
					if (jobAppFields.typeof !== 'undefined') {
						jobAppFields[s] = sin[s];
					} else {
						sin[s] = jobAppFields[s];
					}
				}
				sin.Url = url;
				chrome.storage.local.set({ sin });
			});
		}
	});
});
*/

chrome.runtime.onInstalled.addListener(function () {
	var parent = chrome.contextMenus.create({
		title: "autoSEEKr",
		id: "parent",
		contexts: ['all']
	});
	chrome.contextMenus.create({
		id: "SignIn",
		parentId: parent,
		title: "SignIn",
		contexts: ["all"]
	});
	chrome.contextMenus.create({
		id: "RevokeToken",
		parentId: parent,
		title: "RevokeToken",
		contexts: ["all"],
		visible: false
	});
	chrome.contextMenus.create({
		id: 's1', parentId: parent, type: 'separator', contexts: ['all']
	});
	chrome.contextMenus.create({
		id: "Send2Sheet",
		parentId: parent,
		title: "Send2Sheet",
		contexts: ["all"],
		visible: false
	});
	chrome.contextMenus.create({
		id: "Go2Sheet",
		parentId: parent,
		title: "Go2Sheet",
		contexts: ["all"],
		visible: false
	});
	chrome.contextMenus.create({
		id: 's2',
		parentId: parent,
		type: 'separator',
		contexts: ['all']
	});
	for (var k = 0; k < theTitles.length; k++) {
		var key = theTitles[k];
		chrome.contextMenus.create({
			id: key,
			parentId: parent,
			title: key,
			contexts: ['selection']
		});
	}
	chrome.contextMenus.create({
		id: "ResetFields",
		parentId: parent,
		title: "ResetFields",
		contexts: ['all'],
		visible: false
	});
	//	chrome.contextMenus.create({id: "Agency", parentId: parent,title: "Agency","contexts": ["all"],"type": "checkbox"});
});

chrome.contextMenus.onClicked.addListener(function (item, tab) {
	var url = tab.url;
	var theField = item.menuItemId;
	var theValue = item.selectionText;
	jobAppFields.Url = url;
	for (var c in jobAppFields) {
		var dis = jobAppFields[c];
		if (dis == theField) {
			jobAppFields[dis] = theValue;
			chrome.contextMenus.update(theField, { title: theField + ": *" + theValue + "*" });
			chrome.storage.local.set({ jobAppFields });
		}
	}
	if (theField == 'Send2Sheet') {
		sendVals();
	}
	else if (theField == 'SignIn') {
		chrome.tabs.create({ url: "popup.html", index: tab.index + 1 });
		getAuthTokenInteractive();
	}
	else if (theField == 'GoToSheet') {
		var url = "https://docs.google.com/spreadsheets/d/" + o1 + "/edit";
		chrome.tabs.create({ url: url, index: tab.index + 1 });
	}
	else if (theField == 'ResetFields') {
		resetIt();
	}
	else if (theField == 'RevokeToken') {
		revokeToken();
	}
	else {
		var n = url.search("seek.com.au");
		if (n !== "-1") {
			alert('yourre on seek!');


		}
	}
});
