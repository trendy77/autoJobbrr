'use strict';
// LISTENERS...

var executionAPIpopup = (function () {
	var bk = browser.extension.getBackgroundPage();
	var bkJsPort = browser.runtime.connect({name:"port-popup"});
	var exec_info;
	var state = bk.state;
	// divs
	var jt, emp, con, num, u1, u2, u3, rec, email;
	// buttons
	var exec_div, exec_info_div, exec_result, reset, goButton, optsButton, signin, revoke_button, returnTo;
	var f1b, f2b, f4b, f3b, f5b, f6b, f7b, o1b, o2b, o3b;
	var popupJsPort = browser.runtime.connect( { name: "port-popup" } );

	popupJsPort.onMessage.addListener( function ( m ) {
		var keys = Object.keys( m );
		for ( var r in keys ) {
			var key = keys[r];
			var val = keys[r].value;
			
			
			
			
			
			
			
			
		}
	} );
	// on storage change
	browser.storage.onChanged.addListener(function (changes, namespace) {
		for (var key in changes) {
			var storageChange = changes[key];
			exec_info.innerHTML += (key + ' onChange notification, now: ' + storageChange[key].value);
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
	browser.storage.sync.get(['jobAppFields'], function (object) {
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
		var box = document.getElementById('idButtons');
		for (var key of theIds)) {
			var input = createElement('input');
			input.textContent = jobFields[key].value;
			var span = box.getElementsByTagName('span');
			span.textContent = theIds[key].value;
			box.appendChild(input);
		}
	});
}


function displayFs() {
	state = browser.extension.getBackgroundPage.state;
	o1b = enableEl('#sheeti', ,bk.o1);
		o2b = enableEl('#tplin', 'placeholder', bk.o2);
	o3b = enableEl('#fldin', 'placeholder', bk.o3);
	browser.storage.local.get('jobAppFields', function (object) {
		var theV = object.jobAppFields || [];
		jt = enableEl('#tit', 'placeholder', theV.JobTitle);
		emp = enableEl('#emp', 'placeholder', theV.Company);
		con = enableEl('#con', 'placeholder', theV.Contact);
		email = enableEl('#num', 'placeholder', theV.Number);
		rec = enableEl('#rec', 'placeholder', theV.Agency);
		u1 = enableEl('#u1', 'placeholder', theV.USP1);
		u3 = enableEl('#u3', 'placeholder', theV.USP2);
		u2 = enableEl('#u2', 'placeholder', theV.USP3);
		document.querySelector('#exec_data').innerHTML = browser.extension.getBackgroundPage.exec_Senddata;

	});
}

function disableButton(button) {
	button.setAttribute('disabled', 'disabled');
}
function enableButton(button) {
	button.removeAttribute('disabled');
}
function onError(error) {
	sampleSupport('error: ' + error);
}

function bkrevokeToken() {
	browser.extension.getBackgroundPage.revokeToken();
}
function bkresetIt() {
	browser.extension.getBackgroundPage.resetIt();
}
	
return {
	onload: function () {
		bk = browser.extension.getBackgroundPage();
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
		signin.addEventListener('click', browser.extension.getBackgroundPage.getAuthTokenInteractive);

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