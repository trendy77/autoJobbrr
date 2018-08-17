<<<<<<< HEAD
var f1, f2, f3, f4, f5, f6, f7, f8;
var jobAppFields = {
	"JobTitle": f1,
	"Company": f2,
	"Agency": f8,
	"Contact": f3,
	"Phone-Email": f4,
	"USP1": f5,
	"USP2": f6,
	"USP3": f7
};
var SCRIPT_ID = '1OyjlytEo2uEorwa12PyFanPBm549L9Koe2Fl5Mwkg-p-5V4k7k-KgDsc';
var o1="a";
var o2="t";
var o3="o";
var exec_Optsdata = [o1, o2, o3];
//var theTitz = ["JobTitle", "Company", "Contact", "Number", "USP1", "USP2", "USP3"];
//var theVals = [f1, f2, f3, f4, f5, f6, f7];
var exec_Senddata = {};
var popupJsPort=chrome.runtime.connect({name:"port-popup"});
var contentJsPort = chrome.runtime.connect({ name: "port-content" });

var STATE_START = 1;
var STATE_ACQUIRING_AUTHTOKEN = 2;
var STATE_AUTHTOKEN_ACQUIRED = 3;
var state = STATE_START;



// LISTENERS...
popupJsPort.onMessage.addListener(function(m) {
	var keys = Object.keys(m);
	for (var r in keys){
		console.log(keys[r]+"  "+ keys[r].value);
   }
	 });
	 
contentJsPort.onMessage.addListener(function (m) {
	var keys = Object.keys(m);
	for (var r in keys) {
		console.log(keys[r] + "  " + keys[r].value);
	}
});

// on install.
chrome.runtime.onInstalled.addListener(function () {
	var parent = chrome.contextMenus.create({ title: "autoSEEKr", id: "parent", contexts: ['all'] });
	for (var key in Object.keys(jobAppFields)) {
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

//chrome.runtime.onConnect.addListener(conListener);
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
		chrome.tabs.create({url:chrome.extension.getURL("tabs_api.html")});
	} else if (tit == 'Reset') {
		resetIt();
	} else {
		chrome.storage.local.get(['jobAppFields'], function (object) {
			var fields = object.jobAppFields;
			fields[tit] = sel2;
			chrome.storage.local.set({ jobAppFields: fields }, function () {

			});
		});
	}
});

// on storage change
chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (var key in changes) {
		var storageChange = changes[key];
		if(key == 'jobAppFields'){
			var changedKeys=Object.keys(storageChange);
			for (var fkey in changedKeys) {
				var fieldChg = changedKeys.fkey.value;
				var newKey = changedKeys.fkey;
				chrome.contextMenus.update(newKey, { title: newKey+'= '+fieldChg  });		
		}
	}
		console.log('Storage key "%s" in namespace "%s" changed. ' +
			'Old value was "%s", new value is "%s".',
			key,namespace,storageChange.oldValue,storageChange.newValue);
		
	}
});



function closeWindow() {
	window.close();
}
function setIcon(opt_badgeObj) {
	if (opt_badgeObj) {
		var badgeOpts = {};
		if (opt_badgeObj && opt_badgeObj.text != undefined) {
			badgeOpts.text = opt_badgeObj.text;
=======

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
		case ST_AWAIT:
			enableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
		case ST1:
			sampleSupport.log('Acquiring token...');
			disableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
		case ST2:
			disableButton(signin_button);
			enableButton(xhr_button);
			enableButton(revoke_button);
			break;
			case ST3:
			enableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
			case ST4:
			sampleSupport.log('Acquiring token...');
			disableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
			case ST5:
			disableButton(signin_button);
			enableButton(xhr_button);
			enableButton(revoke_button);
			break;
			case ST6:
			disableButton(signin_button);
			enableButton(xhr_button);
			enableButton(revoke_button);
			break;
			case ST7:
			enableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
			case STEND:
			sampleSupport.log('Sending Job Specs...');
			disableButton(optsButton);
			disableButton(goButton);
			disableButton(opt);
			break;
		}
}
function closeWindow() {
		window.close();
}
function setIcon(opt_badgeObj) {
	if (opt_badgeObj) {
		let badgeOpts = {};
		if (opt_badgeObj && opt_badgeObj.text != undefined) {
			badgeOpts['text'] = opt_badgeObj.text;
>>>>>>> master
		}
		chrome.browserAction.setBadgeText(badgeOpts);
	}
}
<<<<<<< HEAD
function sendLog(key,msg){
	if(key=='log'){
		popupJsPort.postMessage({ 'log': msg });	
	}
	if (key == 'state') {
		popupJsPort.postMessage({ 'state': msg });	
	}
	if (key == 'load') {
		popupJsPort.postMessage({ 'load': msg });
	}
}

function changeState(newState) {
	state = newState;
	sendLog('state',state);
	switch (state) {
		
		case STATE_START:				var text = "go!"; var obj.text=text; setIcon(obj);	break;
		case STATE_ACQUIRING_AUTHTOKEN:		sendLog('log','Acquiring token...');		break;
		case STATE_AUTHTOKEN_ACQUIRED:
			chrome.contextMenus.update('RevokeToken', { visible: true });
			chrome.contextMenus.update('SignIn', { visible: false });
			chrome.contextMenus.update('ResetFields', { visible: true });
			chrome.contextMenus.update('Send2Sheet', { visible: true });
			break;
	}
}



// SENDING./..

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

function sendOptsToSheet(token) {
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'setIds',
			'parameters': { 'theIds': JSON.parse(exec_Optsdata.value) }
		}
	});
}
function sendDataToExecutionAPI() {
	getAuthToken({
		'interactive': false,
		'callback': sendDataToExecutionAPICallback,
	});
}
function sendDataToSheet(token) {
	sendLog('log','sending Vals to Sheet');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponse,
		'token': token,
		'request': {
			'function': 'process1',
			'parameters': { 'jobAppFields': JSON.parse(execSend_data.value) }
		}
	});
}
function sendData() {
	sendLog('loadspin','on');	
	chrome.storage.local.get(['jobAppFields'], function (object) {
		var thedat = object.jobAppFields;
		exec_Senddata = thedat;
		//"[" + viObj[0] + "\,\"" + viObj[1] + "\",\"" + viObj[2] + "\",\"" + viObj[3] + "\",\"" + viObj[4] + "\",\"" + viObj[5] + "\",\"" + viObj[6] + "\"]]";
		getAuthToken({
			'interactive': false,
			'callback': sendValsToSheet
		});
	});
}

// AUTH

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
function executionAPIResponse(response) {
	console.log(JSON.stringify(response));
	sendLog('loadspin', 'off');	
	
	if (response.response.result.status == 'ok') {
		var info = 'Data has been entered into <a href="' + response.response.result.doc + '" target="_blank"><strong>this sheet</strong></a>';
		sendLog('log',info);
	} else {
		var info = 'Error...'
		sendLog('log','info');
	}
	chrome.windows.getCurrent(function (currentWindow) {
		currentWindow.document.querySelector('#exec_result').innerHTML = info;
	});
}
function revokeToken() {
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
=======
function upJobForm(field) {	
	for (let i = 0; i < theFields.length; i++) {
		let theField = theFields[i];
		if (field.title == theField.title){
			theField.value = field.value;
			chrome.storage.sync.set({title:theField.value}, function (list) {
		let div = document.getElementById(theField.domid);
		editJobField(theField);
		});
	}
}
}
function editJobField(theField) {
	let div1 = document.getElementById(theField.domid);
	div1.setAttribute('value', theField.value);
		//let div2 = document.createElement('div');
	//div2.setAttribute('class', 'card blue-grey darken-1');
	let div3 = document.createElement('div');
	//div3.setAttribute('class', 'card-content white-text');
	let span = document.createElement('span');
	span.setAttribute('class', 'card-title');
	let title = document.getElementById(theField.title);
	title.innerText = theField.title;
//	span.appendChild(title);
//	div3.appendChild(span);
//	div2.appendChild(div3);
	let infield = document.getElementById(theField.domid);
infield.setAttribute('placeholder', theField.value);
	infield.setAttribute('type', 'text');
//div2.appendChild(infield);
//	div1.appendChild(div2);
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
	let theVals = [theFields[0].value, theFields[1].value, theFields[5].value, theFields[7].value, theFields[8].value, theFields[9].value];
	sampleSupport.log('Sending data to Execution API script');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponseData,
		'token': token,
		'request': {
			'function': 'process1',
			'parameters': {
				'title':theVals[0],
				'company':theVals[1],
				//recruiter:theVals[2],
				'contact':theVals[2],
				'usp1':theVals[3],
				'usp2':theVals[4],
				'usp3':theVals[5]
			}
		}
	});
}
function post(options) {
	let xhr = new XMLHttpRequest();
>>>>>>> master
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// JSON response assumed. Other APIs may have different responses.
			options.callback(JSON.parse(xhr.responseText));
		} else if (xhr.readyState === 4 && xhr.status !== 200) {
<<<<<<< HEAD
			sampleSupport('post', xhr.readyState, xhr.status, xhr.responseText);
=======
			sampleSupport.log('post', xhr.readyState, xhr.status, xhr.responseText);
>>>>>>> master
		}
	};
	xhr.open('POST', options.url, true);
	xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
	xhr.send(JSON.stringify(options.request));
}
<<<<<<< HEAD
function resetIt() {
	chrome.storage.local.get(['theVals'], function (object) {
		var tiObj = object.theVals;
		for (var w in theTitz) {
			chrome.contextMenus.update(theTitz[w], { "title": theTitz[w] });
		}
		chrome.storage.local.clear();
	});
}











//chrome.tabs.executeScript({
  //  code: 'document.body.style.backgroundColor="red"'
	//OR /	file: 
	// runAt:	enum of "document_start", "document_end", or "document_idle"
 //});

//  chrome.tabs.insertCSS(integer tabId, object details, function callback) 

//Code for displaying <extensionDir>/images/myimage.png:
  //var imgURL = chrome.runtime.getURL("images/myimage.png");
  //document.getElementById("someImage").src = imgURL;
  
//// tabs API
//chrome.browserAction.onClicked.addListener(function(tab) {
//	chrome.tabs.create({url:chrome.extension.getURL("tabs_api.html")});
//  });

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
function createElement(tagName, owner, opt_position, opt_size, opt_noAppend) {
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
  function createTextNode(value, owner) {
	var element = ownerDocument(owner).createTextNode(value);
	if (owner) {
	  appendChild(owner, element);
	}
	return element;
  }
  /**
   * Returns the document owner of the given element. In particular,
   * returns window.document if node is null or the browser does not
   * support ownerDocument.
   *
   * @param {Node} node  The node whose ownerDocument is required.
   * @returns {Document|Null}  The owner document or null if unsupported.
   */
  function ownerDocument(node) {
	return (node ? node.ownerDocument : null) || document;
  }
  /**
   * Wrapper function to create CSS units (pixels) string
   *
   * @param {Number} numPixels  Number of pixels, may be floating point.
   * @returns {String}  Corresponding CSS units string.
   */
  function px(numPixels) {
	return round(numPixels) + "px";
  }
  /**
   * Sets the left and top of the given element to the given point.
   *
   * @param {Element} element  The dom element to manipulate.
   * @param {Point} point  The desired position.
   */
  function setPosition(element, point) {
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
  function setSize(element, size) {
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
  function displayNone(node) {
	node.style.display = 'none';
  }
  /**
   * Sets display to default.
   *
   * @param {Element} node  The dom element to manipulate.
   */
  function displayDefault(node) {
	node.style.display = '';
  }
  /**
   * Appends the given child to the given parent in the DOM
   *
   * @param {Element} parent  The parent dom element.
   * @param {Node} child  The new child dom node.
   */
  function appendChild(parent, child) {
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
function nodeGetElementById(node, elemId) {
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
function domGetAttribute(node, name) {
  return node.getAttribute(name);
}
/**
 * Set an attribute in the DOM.  Simple redirect to compress code.
 *
 * @param {Element} node  Element to interrogate.
 * @param {String} name  Name of parameter to set.
 * @param {String} value  Set attribute to this value.
 */
function domSetAttribute(node, name, value) {
  node.setAttribute(name, value);
}
/**
 * Remove an attribute from the DOM.  Simple redirect to compress code.
 *
 * @param {Element} node  Element to interrogate.
 * @param {String} name  Name of parameter to remove.
 */
function domRemoveAttribute(node, name) {
  node.removeAttribute(name);
}
/**
 * Clone a node in the DOM.
 *
 * @param {Node} node  Node to clone.
 * @return {Node}  Cloned node.
 */
function domCloneNode(node) {
  return node.cloneNode(true);
}
/**
 * Return a safe string for the className of a node.
 * If className is not a string, returns "".
 *
 * @param {Element} node  DOM element to query.
 * @return {String}
 */
function domClassName(node) {
  return node.className ? "" + node.className : "";
}
/**
 * Adds a class name to the class attribute of the given node.
 *
 * @param {Element} node  DOM element to modify.
 * @param {String} className  Class name to add.
 */
function domAddClass(node, className) {
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
function domRemoveClass(node, className) {
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
function domTestClass(node, className) {
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
function domInsertBefore(newChild, oldChild) {
  return oldChild.parentNode.insertBefore(newChild, oldChild);
}
/**
 * Appends a new child to the specified (parent) node.
 *
 * @param {Element} node  Parent element.
 * @param {Node} child  Child node to append.
 * @return {Node}  Newly appended node.
 */
function domAppendChild(node, child) {
  return node.appendChild(child);
}
/**
 * Remove a new child from the specified (parent) node.
 *
 * @param {Element} node  Parent element.
 * @param {Node} child  Child node to remove.
 * @return {Node}  Removed node.
 */
function domRemoveChild(node, child) {
  return node.removeChild(child);
}
/**
 * Replaces an old child node with a new child node.
 *
 * @param {Node} newChild  New child to append.
 * @param {Node} oldChild  Old child to remove.
 * @return {Node}  Replaced node.
 */
function domReplaceChild(newChild, oldChild) {
  return oldChild.parentNode.replaceChild(newChild, oldChild);
}
/**
 * Removes a node from the DOM.
 *
 * @param {Node} node  The node to remove.
 * @return {Node}  The removed node.
 */
function domRemoveNode(node) {
  return domRemoveChild(node.parentNode, node);
}
/**
 * Creates a new text node in the given document.
 *
 * @param {Document} doc  Target document.
 * @param {String} text  Text composing new text node.
 * @return {Text}  Newly constructed text node.
 */
function domCreateTextNode(doc, text) {
  return doc.createTextNode(text);
}
/**
 * Creates a new node in the given document
 *
 * @param {Document} doc  Target document.
 * @param {String} name  Name of new element (i.e. the tag name)..
 * @return {Element}  Newly constructed element.
 */
function domCreateElement(doc, name) {
  return doc.createElement(name);
}
/**
 * Creates a new attribute in the given document.
 *
 * @param {Document} doc  Target document.
 * @param {String} name  Name of new attribute.
 * @return {Attr}  Newly constructed attribute.
 */
function domCreateAttribute(doc, name) {
  return doc.createAttribute(name);
}
/**
 * Creates a new comment in the given document.
 *
 * @param {Document} doc  Target document.
 * @param {String} text  Comment text.
 * @return {Comment}  Newly constructed comment.
 */
function domCreateComment(doc, text) {
  return doc.createComment(text);
}
/**
 * Creates a document fragment.
 *
 * @param {Document} doc  Target document.
 * @return {DocumentFragment}  Resulting document fragment node.
 */
function domCreateDocumentFragment(doc) {
  return doc.createDocumentFragment();
}
/**
 * Redirect to document.getElementById
 *
 * @param {Document} doc  Target document.
 * @param {String} id  Id of requested node.
 * @return {Element|Null}  Resulting element.
 */
function domGetElementById(doc, id) {
  return doc.getElementById(id);
}
/**
 * Redirect to window.setInterval
 *
 * @param {Window} win  Target window.
 * @param {Function} fun  Callback function.
 * @param {Number} time  Time in milliseconds.
 * @return {Object}  Contract id.
 */
function windowSetInterval(win, fun, time) {
  return win.setInterval(fun, time);
}
/**
 * Redirect to window.clearInterval
 *
 * @param {Window} win  Target window.
 * @param {object} id  Contract id.
 * @return {any}  NOTE: Return type unknown?
 */
function windowClearInterval(win, id) {
  return win.clearInterval(id);
}
/**
 * Determines whether one node is recursively contained in another.
 * @param parent The parent node.
 * @param child The node to look for in parent.
 * @return parent recursively contains child
 */
function containsNode(parent, child) {
  while (parent != child && child.parentNode) {
    child = child.parentNode;
  }
  return parent == child;
};
=======
function setContext(){
	let parent = chrome.contextMenus.create({"id":"parent","title":"JobAdder"});
	for(let t=0;t<=(sizeOf(theFields));++t){
		let disOne=theFields[t];
		chrome.contextMenus.create({
			parentId: parent,
			id: disOne.title,
			title: disOne.title,
			type: 'normal',
			theTitles: ['selection']
			});
		}
	}
function upContext(info, tab){
		for(let t=0;t<theTitles.length;++t){
		let thisGuy = theTitles[t];
		if(info.menuItemId==thisGuy){		
		chrome.contextMenus.update(info.menuItemId,{
			title: theTitles[t]+': '+info.selectionText
			});
			let inf=info.menuItemId;
			chrome.storage.sync.get(inf,function(cb){
				let infot=info.selectionText;
				let svedData =cb.value;
			if (infot != svedData){
				chrome.storage.sync.set({inf:infot},function(result){
					upJobForm(result)
					chrome.tabs.create({url: "popup.html", index: tab.index + 1});
				});
			}
		});	
	}
}
}
chrome.runtime.onStartup.addListener(function (e,n){	
	setIcon();	
});


chrome.contextMenus.onClicked.addListener(function(item, tab) {
	process(item,tab);
});

>>>>>>> master
