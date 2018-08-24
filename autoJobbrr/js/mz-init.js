"use strict";
// ONLOAD FUNCTION....
// buttons
var signin, revoke_button, close, upIds;
var contentBox, test, reset, goButton;
// info divs
var exec_info_div, exec_result;

var jobAppFields = chrome.extension.getBackgroundPage.jobAppFields;
for (var t in jobAppFields) {
	var f = jobAppFields[t];
	var val = f.value;
	setContentField(f, val);
}


chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse)
	{
		if (request.msg == "theVals") {

		}
		else if (request.msg == 'log') {
			exec_info_div.innerText += request.log.value;
		} else if (request.msg == 'load') {
			var vall = request.load.value;
			if (vall == "on") {
				loadingOn();
			} else if (vall == "off") {
				loadingOff();
			}
		}
		console.log(key + "= " + key.value);
	});

function setContentField(key, val)
{
	var box = document.getElementById(key);
	box.setAttribute('data-tooltip', val);
	box.setAttribute('placeholder', val);
}

function loadingOn()
{
	var ele = document.querySelector('.loadspin');
	ele.display = 'block';
}
function loadingOff()
{
	var ele = document.querySelector('.loadspin');
	ele.display.value = 'none';
}

function bkclose()
{
	chrome.extension.getBackgroundPage.closeWindow();
}

function bkrevokeToken()
{
	chrome.extension.getBackgroundPage.revokeToken();
}
function bkSignin()
{
	chrome.extension.getBackgroundPage.getAuthTokenInteractive();
}


document.addEventListener('DOMContentLoaded', function ()
{

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

	// auth?
	signin = document.querySelector('#signin');
	signin.addEventListener('click', bkSignin);
	revoke_button = document.querySelector('#revoke');
	revoke_button.addEventListener('click', bkrevokeToken);
	// nav?
	close = document.querySelector('#close');
	close.addEventListener('click', bkclose);
	// logs?
	exec_result = document.querySelector('#exec_result');
	exec_info_div = document.querySelector('#exec_info');

});


			// in fields....
			//	goButton = document.querySelector('#go');
			//	goButton.addEventListener('click', bksendVals.bind(goButton, true));
			//	reset = document.querySelector('#reset');
			//	reset.addEventListener('click', bkresetIt.bind(reset, true));
			// in options...
			//	upIds = document.querySelector('#upIds');
			//	upIds.addEventListener('click', inTestInput);

