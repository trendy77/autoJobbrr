// https://script.google.com/macros/s/AKfycbxB5hPATZclDz6hwe-HKi5o-g9bXtnug6x9nNT5zyBlyeY0pB0/exec
//
//API Key		MXmsJN0_nH3qsA5u644e9P8lvjbIvZS7r

var jobAppFields = {
	"JobTitle": "",
	"Company": "insert",
	"Agency": "insert",
	"Contact": "insert",
	"Phone-Email": "insert",
	"USP1": "insert",
	"USP2": "insert",
	"USP3": "insert",
};
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

/*
Update content when a new tab becomes active.
*/
chrome.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
chrome.tabs.onUpdated.addListener(updateContent);

function updateContent() {
	chrome.windows.getCurrent({ populate: true }, function (windowInfo) {
		var myWindowId = windowInfo.id;
		chrome.tabs.query({ windowId: myWindowId, active: true }, function (tabs) {
			var url = tabs[0].url || "";
			var n = url.search("seek.com.au/job/");
			if (n !== "-1") {
				var info = { url: jobAppFields };
				chrome.storage.local.get([info], function (storedVals) {
					var sin = storedVals.info;
					if (sin !== 'undefined') {
						for (var s in sin) {
							jobAppFields[s] = sin[s];
						}
					} else {
						for (var s in sin) {
							sin[s] = jobAppFields[s];
						}
					}
					info[url] = sin;
					chrome.storage.local.set([info]);
				});
			}
		});
	});
}


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
	var sel2 = item.selectionText;
	var title = item.menuItemId;
	var n = url.search("seek.com.au");
	if (n !== "-1") {
		chrome.storage.local.get([url], function (storedInfo) {
			var savedVals = Object.entries(storedInfo);
			var savedTitles = Object.keys(storedInfo);
			for (var k = 0; k < theTitles.length; k++) {
				if (savedTitles[k] == title) {
					savedVals[k] = sel2;
				}
				chrome.contextMenus.update(theTitles[k], { title: theTitles[k] + ": *" + theVals[k] + "* " });
				theVals[k] = savedVals[k];
			}
			var toStore = {};
			toStore[url] = savedVals;
			chrome.storage.local.set({ toStore });
		});
	}
	else if (title == 'Send2Sheet') {
		sendVals();
	}
	else if (title == 'SignIn') {
		chrome.tabs.create({ url: "popup.html", index: tab.index + 1 });
		getAuthTokenInteractive();
	}
	else if (title == 'GoToSheet') {
		var url = "https://docs.google.com/spreadsheets/d/" + o1 + "/edit";
		chrome.tabs.create({ url: url, index: tab.index + 1 });
	}
	else if (title == 'ResetFields') {
		resetIt();
	}
	else if (title == 'RevokeToken') {
		revokeToken();
	}
});

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
			badgeOpts.text = opt_badgeObj.text;
		}
		chrome.chromeAction.setBadgeText(badgeOpts);
	}
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

function sendStateChg(msg) {
	chrome.runtime.sendMessage({
		msg: 'state',
		state: msg
	});
}

function getSet() {
	chrome.tabs.query({ active: true }, function (tabs) {
		var info = tabs[0].url;
		chrome.storage.local.get([info], function (obj) {
			var fields = obj.info.jobAppFields || {};
			return fields;
		});
	});
}
function setSet(fields) {
	chrome.tabs.query({ active: true }, function (tabs) {
		var info = tabs[0].url;
		chrome.storage.local.get([info], function (obj) {
			var oldField = obj.info.jobAppFields || {};
			for (var k in fields) {
				oldField[k] = fields.k
			}
			//chrome.storage.local.set([info: ], function(obj){
		});
	});
}

function changeState(newState) {
	fstate = newState;
	sendStateChg(fstate);
	switch (fstate) {
		case STATE_START:
			authd = false;
			chrome.contextMenus.update('SignIn', { visible: true });
			chrome.contextMenus.update('Revoke', { visible: false });
			chrome.contextMenus.update('SendToSheet', { visible: false });
			chrome.contextMenus.update('GoToSheet', { visible: false });

			break;
		case STATE_ACQUIRING_AUTHTOKEN:
			sendLog('Acquiring token...');
			chrome.contextMenus.update('SignIn', { title: "SIGNING IN..." });
			sendLoad('on', 'auth');
			break;
		case STATE_AUTHTOKEN_ACQUIRED:
			sendLoad('off', '');
			authd = true;
			break;
	}
}

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

function resetIt() {
	chrome.storage.local.clear();

}
