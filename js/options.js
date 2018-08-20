'use strict';
var bk = browser.runtime.getBackgroundPage();

var exec_info_div, exec_data, exec_result;
var o1b, o2b, o3b;
var theOpts = [o1, o2, o3];
var signin_button, revoke_button, returnTo, upIds;

function displayIds() {
	browser.storage.local.get(['theIds'], function(object) {
		var newIds = object.theIds;
		o1 = newIds.sheetId || getNewIds();
		o2 = newIds[1];
		o3 = newIds[2];
		var sht = document.getElementById('shtin');
		var att1 = document.createAttribute('placeholder');
		att1.value = o1;
		sht.setAttributeNode(att1);
		var o2b = document.querySelector('#tplin');
		var att2 = document.createAttribute('placeholder');
		att2.value = o2;
		o2b.setAttributeNode(att2);
		var o3b = document.querySelector('#fldin');
		var att3 = document.createAttribute('placeholder');
		att3.value = o3;
		o3b.setAttributeNode(att3);
	});
}
displayIds


var executionAPIExample = (function() {


	function sendOpts() {

		if (s != "") {
			var newIds = [s, t, f];
			browser.storage.local.set({
				theIds: newIds
			});
			exec_Optsdata = "[[\"sheetId,\"templateId\",\"folderId\"][\"" + s +
				"\",\"" + t + "\",\"" + f + "\"]]";
		} else {
			exec_Optsdata = "[[\"sheetId,\"templateId\",\"folderId\"][\"" + o1 +
				"\",\"" + o2 + "\",\"" + o3 + "\"]]";
		}
		getAuthToken({
			'interactive': false,
			'callback': sendOptsToSheet,
		});
	}
	disableButton(upIds);

	function sendOptsToExecutionAPI() {
		disableButton(upIds);
		upIds.className = 'loading';
		getAuthToken({
			'interactive': false,
			'callback': sendDataToExecutionAPICallback,
		});
	}

	function sendOptsToExecutionAPICallback(token) {
		sampleSupport.log('Sending data to Execution API script');
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': executionOptsAPIResponse,
			'token': token,
			'request': {
				'function': 'sendOpts',
				'parameters': {
					'data': JSON.parse(exec_data.value)
				}
			}
		});
	}

	function executionOptsAPIResponse(response) {
		sampleSupport.log(response);
		enableButton(upIds);
		upIds.classList.remove('loading');
		var info;
		if (response.response.result.status == 'ok') {
			info = 'IDs have been entered into <a href="' + response.response.result.doc +
				'" target="_blank"><strong>this sheet</strong></a>';
		} else {
			info = 'Error...';
		}
		exec_result.innerHTML = info;
	}

	function sendOptsToSheet(token) {
		alert('Sending data to Execution API script');
		post({
			'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
			'callback': executionAPIResponse,
			'token': token,
			'request': {
				'function': 'setIds',
				'parameters': {
					'data': JSON.parse(exec_Optsdata.value),
					'sheetId': 'itWorks!'
				}
			}
		});
	}



	return {
		onload: function() {
			getOptsFields();
			exec_data = document.querySelector('#exec_data');
			var att4 = document.createAttribute("value");
			exec_Optsdata.innerHTML = exec_Optsdata;

			exec_info_div = document.querySelector('#exec_info');

			signin_button = document.querySelector('#signin');
			signin_button.addEventListener('onClick', getAuthTokenInteractive);

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', revokeToken);

			upIds = document.querySelector('#upIds');
			upIds.addEventListener('clicked', sendOpts);

			exec_result = document.querySelector('#exec_result');
			getAuthTokenSilent();
		}
	};

})();

window.onload = executionAPIExample.onload;
