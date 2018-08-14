'use strict';

var executionAPIpopup = (function() { 
	var bk, state;
	// divs
	var jt, emp, con, num, u1, u2, u3, rec;
	// buttons
	var exec_div, exec_info_div, exec_result, reset, goButton, optsButton, signin, revoke_button, returnTo;
	var f1b, f2b, f4b, f3b, f5b, f6b, f7b,o1b,o2b,o3b;

	var STATE_START = bk.STATE_START;
	var STATE_ACQUIRING_AUTHTOKEN = bk.STATE_ACQUIRING_AUTHTOKEN;
	var STATE_AUTHTOKEN_ACQUIRED = bk.STATE_AUTHTOKEN_ACQUIRED;
	
	function enableEl(eleid, attr, atval) {
		var ele = document.querySelector(eleid);
		var att1 = document.createAttributeNode(attr);
		att1.value = atval;
		ele.setAttributeNode(att1);
	}

	function displayFs() {
		state = bk.state;
		changeViewState(state);
		o1b = enableEl('#shtin','placeholder',bk.o1);
		o2b = enableEl('#tplin','placeholder',bk.o2);
		o3b= enableEl('#fldin','placeholder',bk.o3);
		
		chrome.storage.local.get(['theVals'], function (object) {
			var theV = object.theVals || [];
			jt = enableEl('#tit','placeholder',theV[0]);
			emp = enableEl('#emp','placeholder',theV[1]);
			con = enableEl('#con','placeholder',theV[2]);
			rec = enableEl('#rec','placeholder',theV[3]);
			u1 = enableEl('#u1','placeholder',theV[4]);
			u3 = enableEl('#u3','placeholder',theV[5]);
			u2 = enableEl('#u2','placeholder',theV[6]);
			document.querySelector('#exec_data').innerHTML = "[[\"JobTitle,\"Company\",\"Contact\",\"Number,\"USP1\",\"USP2\",\"USP3\"][\"" + theV[0] + "\",\"" + theV[1] + "\",\"" + theV[2] + "\",\"" + theV[3] + "\",\"" + theV[4] + "\",\"" + theV[5] + "\",\"" + theV[6] + "\"]]";
			
		});
	}

	function disableButton(button) {
		button.setAttribute('disabled', 'disabled');
	}
	function enableButton(button) {
		button.removeAttribute('disabled');
	}
	function onError(error) {
		console.log(`Error: ${error}`);
	}
	
	function changeViewState(theState) {
		switch (theState) {
			case STATE_START:
				enableButton(signin);
				disableButton(upIds);
				disableButton(goButton);
				enableButton(returnTo);
				enableButton(resetBut);
				disableButton(revoke_button);
				break;
			case STATE_ACQUIRING_AUTHTOKEN:
				alert('Acquiring token...');
				disableButton(signin);
				disableButton(returnTo);
				disableButton(revoke_button);
				break;
			case STATE_AUTHTOKEN_ACQUIRED:
				disableButton(signin);
				enableButton(goButton);
				enableButton(upIds);
				enableButton(returnTo);
				enableButton(reset);
				enableButton(revoke_button);
				break;
		}
	}

	return {
		onload: function () {
			var bk = chrome.extension.getBackgroundPage();
			state = bk.getState();
			changeViewState(state);
			displayFs();
			
			exec_info_div = document.querySelector('#exec_info');
			
			goButton = document.querySelector('#go');
			goButton.addEventListener('click', bk.sendVals.bind(goButton, true));		///getAuthTokenInteractive);

			signin = document.querySelector('#signin');
			signin.addEventListener('click', bk.getAuthTokenInteractive);

			returnTo = document.querySelector('#returnTo');
			returnTo.addEventListener('click', bk.close);

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', bk.revokeToken);

			exec_result = document.querySelector('#exec_result');

			reset = document.querySelector('#reset');
			reset.addEventListener('click', bk.resetIt.bind(reset, true));
			getAuthTokenSilent();
		}
	};

})();

window.onload = executionAPIpopup.onload;
