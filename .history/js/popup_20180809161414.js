'use strict';
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
function getData()

createJobForm();



var executionAPIExample = (function() {
	var optsButton,goButton,exec_info_div, exec_data, exec_result; 
	document.querySelector('#optsButton').addEventListener(function () {
		// INSTEAD OF : document.getElementById('').onclick = function() {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	});
	document.querySelector('#begin').addEventListener(function () {
				//document.getElementById('begin').onclick = function() {
				let checkboxes = document.getElementsByTagName('input');
				for (i = 0; i < checkboxes.length; i++) {
					let disBox = checkboxes[i];
					if (checkboxes[i].value != "") {
						newArr[i].value = checkboxes[i].value;
					} else {
						alert('forgot :' + newArr[i].title);
					}
				}
				sendDataToExecutionAPIData();
				// popup results?
				//window.close();
	});
});
window.onload = executionAPIExample.onload;