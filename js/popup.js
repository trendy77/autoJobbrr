'use strict';

var fpstate;
// fields
var jt, emp, con, num, u1, u2, u3, rec, email;
// buttons
var reset, goButton, optsButton, signin, revoke_button, returnTo, close, upIds;
// info divs
var exec_div, exec_info_div, exec_result;
var f1b, f2b, f4b, f3b, f5b, f6b, f7b;
var o1b, o2b, o3b;

var popupJsPort = chrome.runtime.connect({
	name: "port-popup"
});

popupJsPort.onMessage.addListener(function(m) {
	var keys = Object.keys(m);
	for (var r in keys) {
		var key = keys[r];
		if (key == 'state') {
			fpstate = key.value;
		} else if (key == 'log') {
			exec_info.innerText += key.value;
		}
		console.log(key + "= " + key.value);
	}
}, recievedOK);

function recievedOK() {
	popupJsPort.postMessage({
		response: '1'
	});
}

// on storage change
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (var key in changes) {
		var storageChange = changes[key];
		exec_info.innerHTML += (key + ' onChange notification, now: ' +
			storageChange[key].value);
	}
});


popupJsPort.onMessage.addListener(function(m) {
	var keys = Object.keys(m);
	for (var r in keys) {
		var key = keys[r];
		var val = keys[r].value;
		switch (key) {
			case 'load':
				if (val == 'on') {
					loadingOn();
				} else if (val == 'off') {
					loadingOff();
				}
				break;
			case 'log':
				exec_info_div.innerText += val;
				break;
			case 'state':
				break;
		}
	}
});


// ONLOAD FUNCTION....
//
var executionAPIpopup = (function() {
	function bksendVals() {
		enableButton('#loadspin');
		chrome.extension.getBackgroundPage.sendVals();
	}

	function enableEl(eleid, attr, atval) {
		var ele = document.querySelector(eleid);
		chrome.extension.getBackgroundPage.domSetAttribute(ele, attr, atval);
	}

	function createFields() {
		chrome.storage.local.get(['jobAppFields'], function(object) {
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
		chrome.storage.sync.get(['theIds'], function(object) {
			var theIds = object.theIds || [];
			var box = document.querySelector('#idButtons');
			for (var key of theIds) {
				var input = document.createElement('input');
				input.innerText = jobFields[key].value;
				var span = box.getElementsByTagName('span');
				span.textContent = theIds[key].value;
				box.appendChild(input);
			}
		});
	}


	function displayFs() {
		chrome.storage.sync.get(['theIds'], function(object) {
			var theV = object.theIds || [];
			o1b = enableEl('#shtin', 'placeholder', theV[0]);
			o2b = enableEl('#tplin', 'placeholder', theV[1]);
			o3b = enableEl('#fldin', 'placeholder', theV[2]);
		});
		chrome.storage.local.get(['jobAppFields'], function(object) {
			var theV = object.jobAppFields || [];
			jt = enableEl('#tit', 'placeholder', theV.JobTitle.value || "");
			emp = enableEl('#emp', 'placeholder', theV.Company.value || "");
			con = enableEl('#con', 'placeholder', theV.Contact.value || "");
			email = enableEl('#num', 'placeholder', theV.Number.value || "");
			rec = enableEl('#rec', 'placeholder', theV.Agency.value || "");
			u1 = enableEl('#u1', 'placeholder', theV.USP1.value || "");
			u3 = enableEl('#u3', 'placeholder', theV.USP2.value || "");
			u2 = enableEl('#u2', 'placeholder', theV.USP3.value || "");
			document.querySelector('#exec_data').innerText = theV;
		});
	}

	function disableButton(button) {
		button.setAttribute('disabled', 'disabled');
	}

	function enableButton(button) {
		button.removeAttribute('disabled');
	}

	function bkrevokeToken() {
		chrome.extension.getBackgroundPage.revokeToken();
	}

	function bkresetIt() {
		chrome.extension.getBackgroundPage.resetIt();
	}

	function bkSignin() {
		chrome.extension.getBackgroundPage.getAuthTokenInteractive();
	}

	function bksendVals() {
		chrome.extension.getBackgroundPage.sendVals();
	}

	function bkClose() {
		chrome.extension.getBackgroundPage.closeWindow();
	}

	return {
		onload: function() {
			var fstate = chrome.extension.getBackgroundPage.fstate;
			createFields();

			var sidenavs = document.querySelectorAll('.sidenav')
			for (var i = 0; i < sidenavs.length; i++) {
				M.Sidenav.init(sidenavs[i]);
			}
			var dropdowns = document.querySelectorAll('.dropdown-trigger')
			for (var i = 0; i < dropdowns.length; i++) {
				M.Dropdown.init(dropdowns[i]);
			}
			var collapsibles = document.querySelectorAll('.collapsible')
			for (var i = 0; i < collapsibles.length; i++) {
				M.Collapsible.init(collapsibles[i]);
			}
			var featureDiscoveries = document.querySelectorAll('.tap-target')
			for (var i = 0; i < featureDiscoveries.length; i++) {
				M.FeatureDiscovery.init(featureDiscoveries[i]);
			}
			var materialboxes = document.querySelectorAll('.materialboxed')
			for (var i = 0; i < materialboxes.length; i++) {
				M.Materialbox.init(materialboxes[i]);
			}
			var modals = document.querySelectorAll('.modal')
			for (var i = 0; i < modals.length; i++) {
				M.Modal.init(modals[i]);
			}
			var parallax = document.querySelectorAll('.parallax')
			for (var i = 0; i < parallax.length; i++) {
				M.Parallax.init(parallax[i]);
			}
			var scrollspies = document.querySelectorAll('.scrollspy')
			for (var i = 0; i < scrollspies.length; i++) {
				M.ScrollSpy.init(scrollspies[i]);
			}
			var tabs = document.querySelectorAll('.tabs')
			for (var i = 0; i < tabs.length; i++) {
				M.Tabs.init(tabs[i]);
			}
			var tooltips = document.querySelectorAll('.tooltipped')
			for (var i = 0; i < tooltips.length; i++) {
				M.Tooltip.init(tooltips[i]);
			}
			exec_info_div = document.querySelector('#exec_info');

			optsButton = document.querySelector('#optsButton');
			optsButton.addEventListener('click', createOpts);

			goButton = document.querySelector('#go');
			goButton.addEventListener('click', bksendVals.bind(goButton, true));

			signin = document.querySelector('#signin');
			signin.addEventListener('click', bkgetAuthTokenInteractive);

			returnTo = document.querySelector('#returnTo');
			returnTo.addEventListener('click', bkcloseWindow);

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', bkrevokeToken);

			exec_result = document.querySelector('#exec_result');

			reset = document.querySelector('#reset');
			reset.addEventListener('click', bkresetIt.bind(reset, true));
			displayFs();
			createOpts();
		}
	};

})();

window.onload = executionAPIpopup.onload;
