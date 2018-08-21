"use strict";

var fpstate;
// fields
var jt, emp, con, num, u1, u2, u3, rec, email;
// buttons
var reset, goButton, optsButton, signin, revoke_button, returnTo, close, upIds;
// info divs
var exec_div, exec_info_div, exec_result;
var f1b, f2b, f4b, f3b, f5b, f6b, f7b;
var o1b, o2b, o3b;

var popupJsPort = browser.runtime.connect({
	name: "port-popup"
});

popupJsPort.onMessage.addListener(function (m) {
	var keys = Object.keys(m);
	for (var r in keys) {
		var key = keys[r];
		if (key == 'state') {
			fpstate = key.value;
		}
		else if (key == 'log') {
			exec_info_div.innerText += key.value;
		} else if (key == 'load') {
			var vall = key.value;
			if (vall == "on") {
				loadingOn();
			} else if (vall == "off") {
				loadingOff();
			}
		}
		console.log(key + "= " + key.value);
	}
}, recievedOK);

function recievedOK() {
	popupJsPort.postMessage({
		response: '1'
	});
}

function loadingOn() {
	var ele = document.querySelector('#loadspin');
	browser.extension.getBackgroundPage.displayDefault(ele);
}

function loadingOff() {
	var ele = document.querySelectorAll('#loadspin');
	for (var th in ele) {
		var itd = ele.th;
		browser.extension.getBackgroundPage.displayNone(itd);
	}
}


// on storage change
browser.storage.onChanged.addListener(function (changes, namespace) {
	for (var key in changes) {
		var storageChange = changes[key];
		exec_info_div.innerText += (key + ' onChange notification, now: ' + storageChange[key].value);
	}
});

popupJsPort.onMessage.addListener(function (m) {
	var keys = Object.keys(m);
	for (var r in keys) {
		var key = keys[r];
		var val = key.value;
		switch (key) {
			case 'load':
				if (val == 'on') {
					loadingOn();
				}
				else if (val == 'off') {
					loadingOff();
				}
				break;
			case 'log':
				exec_info_div.innerText += val;
				// 	browser.extension.getBackgroundPage.createTextNode(val,'exec_info_div');
				break;
			case 'state':
				changeState(val);
				break;
		}
	}
}, recievedOK);

function disableButton(button) {
	button.setAttribute('disabled', 'disabled');
}

function enableButton(button) {
	button.removeAttribute('disabled');
}

function changeState(newState) {
	var fun = browser.extension.getBackgroundPage();
	fpstate = newState;
	switch (fpstate) {
		case fun.STATE_START:
			enableButton(signin);
			disableButton(optsButton);
			disableButton(revoke_button);
			disableButton(returnTo);
			disableButton(close);
			disableButton(reset);
			disableButton(goButton);
			disableButton(upIds);
			break;
		case fun.STATE_ACQUIRING_AUTHTOKEN:
			sampleSupport.log('Acquiring token...');
			disableButton(signin);
			disableButton(revoke_button);
			break;
		case fun.STATE_AUTHTOKEN_ACQUIRED:
			disableButton(signin);
			enableButton(optsButton);
			enableButton(revoke_button);
			enableButton(returnTo);
			enableButton(close);
			enableButton(reset);
			enableButton(goButton);
			enableButton(upIds);
			break;
	}
}

// ONLOAD FUNCTION....
var executionAPIpopup = (function () {

	function disableButton(button) {
		button.setAttribute('disabled', 'disabled');
	}

	function enableButton(button) {
		button.removeAttribute('disabled');
	}

	function createFields() {
		browser.storage.local.get(['jobAppFields'], function (object) {
			var jobFields = object.jobAppFields;
			for (var key in jobFields) {

				var box = document.getElementById(key);
				var input = box.getElementsByClassName('flows');
				input.textContent = jobFields[key].value;
				var span = document.createElement('span');
				span.textContent = 'IS:' + jobFields[key].value;
				box.appendChild(span);
			}
		});
	}

	function createOpts() {
		browser.storage.sync.get(['theIds'], function (object) {
			var theIds = object.theIds || [];
			var box = document.querySelector('#idButtons');
			for (var key in theIds) {
				var input = document.createElement('input');
				input.innerText = jobFields[key].value;
				var span = box.getElementsByTagName('span');
				span.textContent = theIds[key].value;
				box.appendChild(input);
			}
		});
	}

	function getNewIds() {
		var s = document.getElementById('shtin').value.trim();
		var t = document.getElementById('fldin').value.trim();
		var f = document.getElementById('tplin').value.trim();
		var theNewIds = [s, t, f];
		return theNewIds;
	}

	function displayFs() {
		var bk = browser.extension.getBackgroundPage();
		browser.storage.sync.get(['theIds'], function (object) {
			var theV = object.theIds || [];
			bk.domSetAttribute('#shtin', 'placeholder', theV[0]);
			bk.domSetAttribute('#tplin', 'placeholder', theV[1]);
			bk.domSetAttribute('#fldin', 'placeholder', theV[2]);
		});
		browser.storage.local.get(['jobAppFields'], function (object) {
			var theV = object.jobAppFields || [];
			jt = bk.domSetAttribute('#tit', 'placeholder', theV.JobTitle.value || "");
			emp = bk.domSetAttribute('#emp', 'placeholder', theV.Company.value || "");
			con = bk.domSetAttribute('#con', 'placeholder', theV.Contact.value || "");
			email = bk.domSetAttribute('#num', 'placeholder', theV.Number.value || "");
			rec = bk.domSetAttribute('#rec', 'placeholder', theV.Agency.value || "");
			u1 = bk.domSetAttribute('#u1', 'placeholder', theV.USP1.value || "");
			u3 = bk.domSetAttribute('#u3', 'placeholder', theV.USP2.value || "");
			u2 = bk.domSetAttribute('#u2', 'placeholder', theV.USP3.value || "");
			document.querySelector('#exec_data').innerText = theV;
		});
	}


	function bkrevokeToken() {
		browser.extension.getBackgroundPage.revokeToken();
	}

	function bkresetIt() {
		browser.extension.getBackgroundPage.resetIt();
	}

	function bkSignin() {
		browser.extension.getBackgroundPage.getAuthTokenInteractive();
	}

	function bksendVals() {
		browser.extension.getBackgroundPage.sendVals();
	}

	function bksendOpts() {
		var theNewIds = getNewIds();
		browser.extension.getBackgroundPage.sendOpts(theNewIds);
	}

	function bkClose() {
		browser.extension.getBackgroundPage.closeWindow();
	}
	return {
		onload: function () {
			M.AutoInit();
			var fstate = browser.extension.getBackgroundPage.fstate();
			var sidenavs = document.querySelectorAll('.sidenav')
			for (var i = 0; i < sidenavs.length; i++) {
				M.Sidenav.init(sidenavs[i]);
			}
			var dropdowns = document.querySelectorAll('.dropdown-trigger')
			for (i = 0; i < dropdowns.length; i++) {
				M.Dropdown.init(dropdowns[i]);
			}
			var collapsibles = document.querySelectorAll('.collapsible')
			for (i = 0; i < collapsibles.length; i++) {
				M.Collapsible.init(collapsibles[i]);
			}
			var featureDiscoveries = document.querySelectorAll('.tap-target')
			for (i = 0; i < featureDiscoveries.length; i++) {
				M.FeatureDiscovery.init(featureDiscoveries[i]);
			}
			var materialboxes = document.querySelectorAll('.materialboxed');
			for (i = 0; i < materialboxes.length; i++) {
				M.Materialbox.init(materialboxes[i]);
			}
			var modals = document.querySelectorAll('.modal');
			for (i = 0; i < modals.length; i++) {
				M.Modal.init(modals[i]);
			}
			var parallax = document.querySelectorAll('.parallax');
			for (i = 0; i < parallax.length; i++) {
				M.Parallax.init(parallax[i]);
			}
			var scrollspies = document.querySelectorAll('.scrollspy');
			for (i = 0; i < scrollspies.length; i++) {
				M.ScrollSpy.init(scrollspies[i]);
			}
			var tabs = document.querySelectorAll('.tabs');
			for (i = 0; i < tabs.length; i++) {
				M.Tabs.init(tabs[i]);
			}
			var tooltips = document.querySelectorAll('.tooltipped');
			for (i = 0; i < tooltips.length; i++) {
				M.Tooltip.init(tooltips[i]);
			}
			exec_info_div = document.querySelector('#exec_info');

			optsButton = document.querySelector('#optsButton');
			optsButton.addEventListener('click', getNewIds);

			upIds = document.querySelector('#upIds');
			upIds.addEventListener('click', bksendOpts);

			goButton = document.querySelector('#go');
			goButton.addEventListener('click', bksendVals.bind(goButton, true));

			signin = document.querySelector('#signin');
			signin.addEventListener('click', bkgetAuthTokenInteractive);

			close = document.querySelector('#close');
			close.addEventListener('click', bkclose);

			returnTo = document.querySelector('#returnTo');
			returnTo.addEventListener('click', bkclose);

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', bkrevokeToken);

			exec_result = document.querySelector('#exec_result');

			reset = document.querySelector('#reset');
			reset.addEventListener('click', bkresetIt.bind(reset, true));

			createFields();
			displayFs();

		}
	};

})();

window.onload = executionAPIpopup.onload;
