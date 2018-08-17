'use strict';

var executionAPIpopup = (function () {
	var bk = chrome.extension.getBackgroundPage();
	var bkJsPort = chrome.runtime.connect({name:"port-popup"});
	var exec_info;
	var state = bk.state;
	// divs
	var jt, emp, con, num, u1, u2, u3, rec, email;
	// buttons
	var exec_div, exec_info_div, exec_result, reset, goButton, optsButton, signin, revoke_button, returnTo;
	var f1b, f2b, f4b, f3b, f5b, f6b, f7b, o1b, o2b, o3b;
	
	// on storage change
	chrome.storage.onChanged.addListener(function (changes, namespace) {
		for (var key in changes) {
			var storageChange = changes[key];
			exec_info.innerHTML += (key + ' onChange notification, now: ' + storageChange.value);
		}
	});


	bkJsPort.onMessage.addListener(function (m) {
		var keys = Object.keys(m);
		for (var r in keys){
			var key=keys[r];
			var val= keys[r].value;
			switch (key) {
				case 'loadoff':
				bk.displayNone('loadspin');
					break;
				case 'loadin':
					bk.domRemoveAttribute('loadspin','display');
					break;
				case 'log':
				exec_info.innerText += val;
					break;
}
}
	});

function bksendVals() {
	enableButton('#loadspin');
	bk.sendVals();
}
function enableEl(eleid, attr, atval) {
	var ele = document.querySelector(eleid);
	var att1 = document.setAttribute(attr);
	att1.value = atval;
	ele.setAttributeNode(att1);
}

function createFields() {
	chrome.storage.sync.get(['jobAppFields'], function (object) {
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
	chrome.storage.sync.get(['theIds'], function (object) {
		var theIds = object.theIds || [];
		var box = document.getElementById('idButtons');
		for (var key in theIds) {
			var input =document.createElement('input');
			input.textContent = theIds[key].value;
			var span = box.getElementsByTagName('span');
			span.textContent = theIds[key].value;
			box.appendChild(input);
		}
	});
}


function displayFs() {
	var ids = chrome.extension.getBackgroundPage.exec_Optsdata || [];
	o1b = enableEl('#sheetin','placeholder' ,ids[0]);
		o2b = enableEl('#tplin', 'placeholder', ids[1]);
	o3b = enableEl('#fldin', 'placeholder', ids[2]);
	chrome.storage.local.get('jobAppFields', function (object) {
		var theV = object.jobAppFields || [];
		jt = enableEl('#tit', 'placeholder', theV.JobTitle);
		emp = enableEl('#emp', 'placeholder', theV.Company);
		con = enableEl('#con', 'placeholder', theV.Contact);
		email = enableEl('#num', 'placeholder', theV.Number);
		rec = enableEl('#rec', 'placeholder', theV.Agency);
		u1 = enableEl('#u1', 'placeholder', theV.USP1);
		u3 = enableEl('#u3', 'placeholder', theV.USP2);
		u2 = enableEl('#u2', 'placeholder', theV.USP3);
		document.querySelector('#exec_data').innerHTML = chrome.extension.getBackgroundPage.exec_Senddata;

	});
}

function disableButton(button) {
	button.setAttribute('disabled', 'disabled');
}
function enableButton(button) {
	button.removeAttribute('disabled');
}
function onError(error) {
	support_sample('error: ' + error);
}

function bkrevokeToken() {
	chrome.extension.getBackgroundPage.revokeToken();
}
function bkresetIt() {
	chrome.extension.getBackgroundPage.resetIt();
}

return {
	onload: function () {
		bk = chrome.extension.getBackgroundPage();
		state = bk.getState;
createFields();
		var sidenavs = document.querySelectorAll('.sidenav')
for (var i = 0; i < sidenavs.length; i++){
	M.Sidenav.init(sidenavs[i]);
}
var dropdowns = document.querySelectorAll('.dropdown-trigger')
for (var i = 0; i < dropdowns.length; i++){
	M.Dropdown.init(dropdowns[i]);
}
var collapsibles = document.querySelectorAll('.collapsible')
for (var i = 0; i < collapsibles.length; i++){
	M.Collapsible.init(collapsibles[i]);
}
var featureDiscoveries = document.querySelectorAll('.tap-target')
for (var i = 0; i < featureDiscoveries.length; i++){
	M.FeatureDiscovery.init(featureDiscoveries[i]);
}
var materialboxes = document.querySelectorAll('.materialboxed')
for (var i = 0; i < materialboxes.length; i++){
	M.Materialbox.init(materialboxes[i]);
}
var modals = document.querySelectorAll('.modal')
for (var i = 0; i < modals.length; i++){
	M.Modal.init(modals[i]);
}
var parallax = document.querySelectorAll('.parallax')
for (var i = 0; i < parallax.length; i++){
	M.Parallax.init(parallax[i]);
}
var scrollspies = document.querySelectorAll('.scrollspy')
for (var i = 0; i < scrollspies.length; i++){
	M.ScrollSpy.init(scrollspies[i]);
}
var tabs = document.querySelectorAll('.tabs')
for (var i = 0; i < tabs.length; i++){
	M.Tabs.init(tabs[i]);
}
var tooltips = document.querySelectorAll('.tooltipped')
for (var i = 0; i < tooltips.length; i++){
	M.Tooltip.init(tooltips[i]);
}
exec_info_div = document.querySelector('#exec_info');
createOpts();
		goButton = document.querySelector('#go');
		goButton.addEventListener('click', bksendVals.bind(goButton, true));		///getAuthTokenInteractive);

		signin = document.querySelector('#signin');
		signin.addEventListener('click', chrome.extension.getBackgroundPage.getAuthTokenInteractive);

		returnTo = document.querySelector('#returnTo');
		returnTo.addEventListener('click', bk.closeWindow);

		revoke_button = document.querySelector('#revoke');
		revoke_button.addEventListener('click', bkrevokeToken);

		exec_result = document.querySelector('#exec_result');

		reset = document.querySelector('#reset');
		reset.addEventListener('click', bkresetIt.bind(reset, true));
		displayFs();
		bk.getAuthTokenSilent();
	}
};

}) ();

window.onload = executionAPIpopup.onload;
