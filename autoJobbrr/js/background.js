var f1, f2, f3, f4, f5, f6, f7, f8;
var jobAppFields = {
	"JobTitle": f1,
	"Company": f2,
	"Agency": f8,
	"Contact": f3,
	"Phone-Email": f4,
	"USP1": f5,
	"USP2": f6,
	"USP3": f7,
	"JobUrl": ""
};
var theTitz = Object.keys(jobAppFields);
var theVals = Object.values(jobAppFields);
var entries = Object.entries(jobAppFields);
var SCRIPTID = "1OyjlytEo2uEorwa12PyFanPBm549L9Koe2Fl5Mwkg-p-5V4k7k-KgDsc";
/// https://script.google.com/macros/s/AKfycbxB5hPATZclDz6hwe-HKi5o-g9bXtnug6x9nNT5zyBlyeY0pB0/exec


//// !!! ONLY FOR TESTING....!
var o1 = "1TBqN2KpOMse7_pyKDSZW1QIFii1-5VAL9Zbz2np_TUM";
var o2 = "14850XpEs5bNWo8RttAMgUdvA4LE1UK2mFEhPpI9wk18";
var o3 = "1yOQqQ2Nwae5xvS2tuGbUNGUIRqGwqhWw";
////////////////////

var eOdata = [o1, o2, o3];
var iconText = "!";

// s/t msg
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse)
	{
		alert(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
		if (request.msg == "getVals") {
			var url = request.url;
			var toget = [url];
			//alert(url);
			//	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs){
			//	var theTab = tabs[0].id;
			//	var theUrl = tabs[0].url;
			chrome.storage.local.get(toget, function (storedInfo)
			{
				var info = storedInfo.jobAppFields || jobAppFields;
				alert(JSON.stringify(storedInfo));
				sendResponse({ msg: "theVals", vals: info });
			});
			//	chrome.tabs.sendMessage(tabs[0].id, { vals: theVals }, function (response){
		}
	});


/*
Update content when a new tab becomes active.
*/
chrome.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
chrome.tabs.onUpdated.addListener(updateContent);

function updateContent()
{
	chrome.windows.getCurrent({ populate: true }, function (windowInfo)
	{
		var myWindowId = windowInfo.id;
		chrome.tabs.query({ windowId: myWindowId, active: true }, function (tabs)
		{
			var toget = [tabs[0].url];
			chrome.storage.local.get(toget, function (storedInfo)
			{
				var theFields = storedInfo.jobAppFields || jobAppFields;
				theFields.JobUrl = toget;
				chrome.storage.local.set({ toget: jobAppFields });
			});
		});
	});
}

chrome.runtime.onInstalled.addListener(function ()
{
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
	for (var k = 0; k < theTitz.length; k++) {
		var key = theTitz[k];
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

chrome.contextMenus.onClicked.addListener(function (item, tab)
{
	var sel2 = item.selectionText;
	var tit = item.menuItemId;
	if (tit == 'Send2Sheet') {
		sendVals();
	}
	else if (tit == 'SignIn') {
		getAuthTokenInteractive();
	}
	else if (tit == 'GoToSheet') {
		var url = "https://docs.google.com/spreadsheets/d/" + o1 + "/edit";
		chrome.tabs.create({ url: url, index: tab.index + 1 });
	}
	else if (tit == 'ResetFields') {
		resetIt();
	}
	else if (tit == 'RevokeToken') {
		revokeToken();
	}
	else {
		chrome.tabs.query({ active: true }, function (tabs)
		{
			var this1 = tabs[0].url;
			chrome.storage.local.get([this1], function (object)
			{
				var fields = object.jobAppFields || {};
				fields[tit] = sel2;
				var toStore = {};
				toStore[this1] = fields;
				chrome.storage.local.set({ toStore });
				chrome.contextMenus.update(tit, { title: tit + ":" + sel2 });
			});
		});
	}
});

function closeWindow()
{
	window.close();
}
function disableButton(button)
{
	button.setAttribute('disabled', 'disabled');
}
function enableButton(button)
{
	button.removeAttribute('disabled');
}
function iconTit(text)
{
	var opt_badgeObj = {};
	var textArr = text;
	opt_badgeObj.text = textArr;
	setIcon(opt_badgeObj);
}
function setIcon(opt_badgeObj)
{
	if (opt_badgeObj) {
		var badgeOpts = {};
		if (opt_badgeObj && opt_badgeObj.text != undefined) {
			badgeOpts.text = opt_badgeObj.text;
		}
		chrome.chromeAction.setBadgeText(badgeOpts);
	}
}
function sendLoad(msg, which)
{
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

function sendLog(msg)
{
	chrome.runtime.sendMessage({
		msg: 'log',
		log: msg
	});
}

function sendStateChg(msg)
{
	chrome.runtime.sendMessage({
		msg: 'state',
		state: msg
	});
}

function getSet()
{
	chrome.tabs.query({ active: true }, function (tabs)
	{
		var info = tabs[0].url;
		chrome.storage.local.get([info], function (obj)
		{
			var fields = obj.info.jobAppFields || {};
			return fields;
		});
	});
}

function setSet(fields)
{
	chrome.tabs.query({ active: true }, function (tabs)
	{
		var info = tabs[0].url;
		chrome.storage.local.get([info], function (obj)
		{
			var oldField = obj.info.jobAppFields || {};
			for (var k in fields) {
				oldField[k] = fields.k
			}
			//chrome.storage.local.set([info: ], function(obj){
		});
	});
}

function changeState(newState)
{
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

// SENDING./..
var newIds;

function sendOpts(theOpts)
{
	newIds = theOpts
	sendLoad('on', 'upIds');
	getAuthToken({
		'interactive': false,
		'callback': sendOptsToSheet
	});
}

function sendOptsToSheet(token)
{
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

function sendDataToSheet(token)
{
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

function sendVals()
{
	var dat = getSet();
	var thedat = object.jobAppFields;
	jobAppFields = thedat;
	//"[" + viObj[0] + "\,\"" + viObj[1] + "\",\"" + viObj[2] + "\",\"" + viObj[3] + "\",\"" + viObj[4] + "\",\"" + viObj[5] + "\",\"" + viObj[6] + "\"]]";
	getAuthToken({
		'interactive': false,
		'callback': sendValsToSheet
	});
}

// AUTH

function getAuthToken(options)
{
	chrome.identity.getAuthToken({
		'interactive': options.interactive
	}, options.callback);
}

function getAuthTokenSilent()
{
	getAuthToken({
		'interactive': false,
		'callback': getAuthTokenCallback
	});
}

function getAuthTokenInteractive()
{
	alert('signing in...');
	getAuthToken({
		'interactive': true,
		'callback': getAuthTokenCallback
	});
}

function getAuthTokenCallback(token)
{
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

function executionAPIResponse(response)
{
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

function revokeToken()
{
	getAuthToken({
		'interactive': false,
		'callback': revokeAuthTokenCallback,
	});
}

function revokeAuthTokenCallback(current_token)
{
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

function post(options)
{
	sendLog('posting');
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function ()
	{
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

function resetIt()
{
	chrome.storage.local.clear();

}

// code: 'document.body.style.backgroundColor="red"'

/**
 * Creates a DOM element with the given tag name in the document of the
 * owner element.
 *
 * @param {String} tagName  The name of the tag to create.
 * @param {Element} owner The intended owner (i.e., parent element) of
 * the created element.
 * @param {Point} opt_position  The top-left corner of the created element.
 * @param {Size} opt_size  The size of the created element.
 * @param {Boolean} opt_noAppend Do not append the new element to the owner.
 * @return {Element}  The newly created element node.
 */
function createElement(tagName, owner, opt_position, opt_size, opt_noAppend)
{
	var element = ownerDocument(owner).createElement(tagName);
	if (opt_position) {
		setPosition(element, opt_position);
	}
	if (opt_size) {
		setSize(element, opt_size);
	}
	if (owner && !opt_noAppend) {
		appendChild(owner, element);
	}
	return element;
}
/**
 * Creates a text node with the given value.
 * @param {String} value  The text to place in the new node.
 * @param {Element} owner The owner (i.e., parent element) of the new
 * text node.
 * @return {Text}  The newly created text node.
 */
function createTextNode(value, owner)
{
	var element = ownerDocument(owner).createTextNode(value);
	if (owner) {
		appendChild(owner, element);
	}
	return element;
}
/**
 * Returns the document owner of the given element. In particular,
 * returns window.document if node is null or the chrome does not
 * support ownerDocument.
 *
 * @param {Node} node  The node whose ownerDocument is required.
 * @returns {Document|Null}  The owner document or null if unsupported.
 */
function ownerDocument(node)
{
	return (node ? node.ownerDocument : null) || document;
}
/**
 * Wrapper function to create CSS units (pixels) string
 *
 * @param {Number} numPixels  Number of pixels, may be floating point.
 * @returns {String}  Corresponding CSS units string.
 */
function px(numPixels)
{
	return round(numPixels) + "px";
}
/**
 * Sets the left and top of the given element to the given point.
 *
 * @param {Element} element  The dom element to manipulate.
 * @param {Point} point  The desired position.
 */
function setPosition(element, point)
{
	var style = element.style;
	style.position = "absolute";
	style.left = px(point.x);
	style.top = px(point.y);
}
/**
 * Sets the width and height style attributes to the given size.
 *
 * @param {Element} element  The dom element to manipulate.
 * @param {Size} size  The desired size.
 */
function setSize(element, size)
{
	var style = element.style;
	style.width = px(size.width);
	style.height = px(size.height);
}
/**
 * Sets display to none. Doing this as a function saves a few bytes for
 * the 'style.display' property and the 'none' literal.
 *
 * @param {Element} node  The dom element to manipulate.
 */
function displayNone(node)
{
	node.style.display = 'none';
}
/**
 * Sets display to default.
 *
 * @param {Element} node  The dom element to manipulate.
 */
function displayDefault(node)
{
	node.style.display = '';
}

function displayHalf(node)
{
	node.style.opacity = '0.5';
}
/**
 * Appends the given child to the given parent in the DOM
 *
 * @param {Element} parent  The parent dom element.
 * @param {Node} child  The new child dom node.
 */
function appendChild(parent, child)
{
	parent.appendChild(child);
}

var DOM_ELEMENT_NODE = 1;
var DOM_ATTRIBUTE_NODE = 2;
var DOM_TEXT_NODE = 3;
var DOM_CDATA_SECTION_NODE = 4;
var DOM_ENTITY_REFERENCE_NODE = 5;
var DOM_ENTITY_NODE = 6;
var DOM_PROCESSING_INSTRUCTION_NODE = 7;
var DOM_COMMENT_NODE = 8;
var DOM_DOCUMENT_NODE = 9;
var DOM_DOCUMENT_TYPE_NODE = 10;
var DOM_DOCUMENT_FRAGMENT_NODE = 11;
var DOM_NOTATION_NODE = 12;
/**
 * Traverses the element nodes in the DOM tree underneath the given
 * node and finds the first node with elemId, or null if there is no such
 * element.  Traversal is in depth-first order.
 *
 * NOTE: The reason this is not combined with the elem() function is
 * that the implementations are different.
 * elem() is a wrapper for the built-in document.getElementById() function,
 * whereas this function performs the traversal itself.
 * Modifying elem() to take an optional root node is a possibility,
 * but the in-built function would perform better than using our own traversal.
 *
 * @param {Element} node Root element of subtree to traverse.
 * @param {String} elemId The id of the element to search for.
 * @return {Element|Null} The corresponding element, or null if not found.
 */
function nodeGetElementById(node, elemId)
{
	for (var c = node.firstChild; c; c = c.nextSibling) {
		if (c.id == elemId) {
			return c;
		}
		if (c.nodeType == DOM_ELEMENT_NODE) {
			var n = arguments.callee.call(this, c, elemId);
			if (n) {
				return n;
			}
		}
	}
	return null;
}
/**
 * Get an attribute from the DOM.  Simple redirect, exists to compress code.
 *
 * @param {Element} node  Element to interrogate.
 * @param {String} name  Name of parameter to extract.
 * @return {String}  Resulting attribute.
 */
function domGetAttribute(node, name)
{
	return node.getAttribute(name);
}
/**
 * Set an attribute in the DOM.  Simple redirect to compress code.
 *
 * @param {Element} node  Element to interrogate.
 * @param {String} name  Name of parameter to set.
 * @param {String} value  Set attribute to this value.
 */
function domSetAttribute(node, name, value)
{
	node.setAttribute(name, value);
}
/**
 * Remove an attribute from the DOM.  Simple redirect to compress code.
 *
 * @param {Element} node  Element to interrogate.
 * @param {String} name  Name of parameter to remove.
 */
function domRemoveAttribute(node, name)
{
	node.removeAttribute(name);
}
/**
 * Clone a node in the DOM.
 *
 * @param {Node} node  Node to clone.
 * @return {Node}  Cloned node.
 */
function domCloneNode(node)
{
	return node.cloneNode(true);
}
/**
 * Return a safe string for the className of a node.
 * If className is not a string, returns "".
 *
 * @param {Element} node  DOM element to query.
 * @return {String}
 */
function domClassName(node)
{
	return node.className ? "" + node.className : "";
}
/**
 * Adds a class name to the class attribute of the given node.
 *
 * @param {Element} node  DOM element to modify.
 * @param {String} className  Class name to add.
 */
function domAddClass(node, className)
{
	var name = domClassName(node);
	if (name) {
		var cn = name.split(/\s+/);
		var found = false;
		for (var i = 0; i < jsLength(cn); ++i) {
			if (cn[i] == className) {
				found = true;
				break;
			}
		}
		if (!found) {
			cn.push(className);
		}
		node.className = cn.join(' ');
	} else {
		node.className = className;
	}
}
/**
 * Removes a class name from the class attribute of the given node.
 *
 * @param {Element} node  DOM element to modify.
 * @param {String} className  Class name to remove.
 */
function domRemoveClass(node, className)
{
	var c = domClassName(node);
	if (!c || c.indexOf(className) == -1) {
		return;
	}
	var cn = c.split(/\s+/);
	for (var i = 0; i < jsLength(cn); ++i) {
		if (cn[i] == className) {
			cn.splice(i--, 1);
		}
	}
	node.className = cn.join(' ');
}
/**
 * Checks if a node belongs to a style class.
 *
 * @param {Element} node  DOM element to test.
 * @param {String} className  Class name to check for.
 * @return {Boolean}  Node belongs to style class.
 */
function domTestClass(node, className)
{
	var cn = domClassName(node).split(/\s+/);
	for (var i = 0; i < jsLength(cn); ++i) {
		if (cn[i] == className) {
			return true;
		}
	}
	return false;
}
/**
 * Inserts a new child before a given sibling.
 *
 * @param {Node} newChild  Node to insert.
 * @param {Node} oldChild  Sibling node.
 * @return {Node}  Reference to new child.
 */
function domInsertBefore(newChild, oldChild)
{
	return oldChild.parentNode.insertBefore(newChild, oldChild);
}
/**
 * Appends a new child to the specified (parent) node.
 *
 * @param {Element} node  Parent element.
 * @param {Node} child  Child node to append.
 * @return {Node}  Newly appended node.
 */
function domAppendChild(node, child)
{
	return node.appendChild(child);
}
/**
 * Remove a new child from the specified (parent) node.
 *
 * @param {Element} node  Parent element.
 * @param {Node} child  Child node to remove.
 * @return {Node}  Removed node.
 */
function domRemoveChild(node, child)
{
	return node.removeChild(child);
}
/**
 * Replaces an old child node with a new child node.
 *
 * @param {Node} newChild  New child to append.
 * @param {Node} oldChild  Old child to remove.
 * @return {Node}  Replaced node.
 */
function domReplaceChild(newChild, oldChild)
{
	return oldChild.parentNode.replaceChild(newChild, oldChild);
}
/**
 * Removes a node from the DOM.
 *
 * @param {Node} node  The node to remove.
 * @return {Node}  The removed node.
 */
function domRemoveNode(node)
{
	return domRemoveChild(node.parentNode, node);
}
/**
 * Creates a new text node in the given document.
 *
 * @param {Document} doc  Target document.
 * @param {String} text  Text composing new text node.
 * @return {Text}  Newly constructed text node.
 */
function domCreateTextNode(doc, text)
{
	return doc.createTextNode(text);
}
/**
 * Creates a new node in the given document
 *
 * @param {Document} doc  Target document.
 * @param {String} name  Name of new element (i.e. the tag name)..
 * @return {Element}  Newly constructed element.
 */
function domCreateElement(doc, name)
{
	return doc.createElement(name);
}
/**
 * Creates a new attribute in the given document.
 *
 * @param {Document} doc  Target document.
 * @param {String} name  Name of new attribute.
 * @return {Attr}  Newly constructed attribute.
 */
function domCreateAttribute(doc, name)
{
	return doc.createAttribute(name);
}
