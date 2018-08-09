'use strict';
var sheetId,templateId,folderId="";
var theIds ={"sheetId":sheetId,
"templateId":templateId,
"folderId":folderId
};

function createOptionsForm() {
  chrome.storage.sync.get('theIds', function(list) {
    let form = document.getElementById('form');
    for (let key of Object.keys(theIds)) {
      let div = document.createElement('div');
      let checkbox = document.createElement('input');
      checkbox.type = 'text';
      checkbox.placeholder = theIds[key].value;
      checkbox.name = theIds[key].title;
      checkbox.value = "";
      let span = document.createElement('span');
      span.textContent = theIds[key];
      div.appendChild(checkbox);
      div.appendChild(span);
      form.appendChild(div);
    }
  });
}

createForm();

document.getElementById('optionsSubmit').onclick = function() {
  let checkboxes = document.getElementsByTagName('input');
  let changed = [];
  let newVal = [];
  let newArr ={};
  for (i=0; i<checkboxes.length; i++) {
    if (checkboxes[i].value != "") {
	  newArr.push([changed,newVal]);
	  }
}
chrome.storage.sync.set(newArr);
  //window.close();
}
  
var executionAPIExample = (function() {
	var SCRIPT_ID='1OyjlytEo2uEorwa12PyFanPBm549L9Koe2Fl5Mwkg-p-5V4k7k-KgDsc'; // Apps Script script id
	var STATE_START=1;
	var STATE_ACQUIRING_AUTHTOKEN=2;
	var STATE_AUTHTOKEN_ACQUIRED=3;
	var state = STATE_START;
	var gobutton, signin_button, xhr_button, revoke_button, exec_info_div, exec_data, exec_result;

		function disableField(field) {
			button.setAttribute('opacity', '0.6');
		}
		function enableField(field) {
			button.setAttribute('display', 'block');
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
	/**
	 * Get users access_token.
	 *
	 * @param {object} options
	 *   @value {boolean} interactive - If user is not authorized ext, should auth UI be displayed.
	 *   @value {function} callback - Async function to receive getAuthToken result.
	 */
	function getAuthToken(options) {
		chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
	}
	/**
	 * Get users access_token in background with now UI prompts.
	 */
	function getAuthTokenSilent() {
		getAuthToken({
			'interactive': false,
			'callback': getAuthTokenCallback,
		});
	}
	/**
	 * Get users access_token or show authorize UI if access has not been granted.
	 */
	function getAuthTokenInteractive() {
		getAuthToken({
			'interactive': true,
			'callback': getAuthTokenCallback,
		});
	}
	/**
	 * Handle response from authorization server.
	 *
	 * @param {string} token - Google access_token to authenticate request with.
	 */
	function getAuthTokenCallback(token) {
		// Catch chrome error if user is not authorized.
		if (chrome.runtime.lastError) {
			sampleSupport.log('No token aquired');
			changeState(STATE_START);
		} else {
			sampleSupport.log('Token acquired');
			changeState(STATE_AUTHTOKEN_ACQUIRED);
		}
	}



function sendDataToExecutionAPIOpts(){}
disableButton(xhr_button);
	xhr_button.className = 'loading';
		getAuthToken({
			'interactive': false,
			'callback': sendDataToExecutionAPICallbackOpts,
		});
	}
	function sendDataToExecutionAPICallbackOpts(token) {
		sampleSupport.log('Sending data to Execution API script');
		post({	'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
				'callback': executionAPIResponseOpts,
				'token': token,
				'request': {'function': 'options',
							'parameters': {JSON.parse(ids)}}
			});
	}

	function executionAPIResponseOpts(response){
	 sampleSupport.log(response);
	 enableButton(xhr_button);
	 xhr_button.classList.remove('loading');
	 var info;
	 if (response.response.result.status == 'ok'){
		 info = 'IDs set: Template @ <a href="'+response.response.result.template+'" target="_blank">Folder@ <a href="'+response.response.result.folder+'" target="_blank">Sheet @ <a href="'+response.response.result.sheet+'" target="_blank"><strong>.</strong></a>';
	 } else {
		 info = 'Error...';
	 }
	 exec_result.innerHTML = info;
	}


	/**
	 * Revoking the access token.
	 */
	function revokeToken() {
		exec_result.innerHTML='';
		getAuthToken({
			'interactive': false,
			'callback': revokeAuthTokenCallback,
		});
	}
	/**
	 * Revoking the access token callback
	 */
	function revokeAuthTokenCallback(current_token) {
		if (!chrome.runtime.lastError) {

			// Remove the local cached token
			chrome.identity.removeCachedAuthToken({ token: current_token }, function() {});

			// Make a request to revoke token in the server
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
				   current_token);
			xhr.send();

			// Update the user interface accordingly
			changeState(STATE_START);
			sampleSupport.log('Token revoked and removed from cache. '+
							'Check chrome://identity-internals to confirm.');
		}
	}
	/**
	 * Make an authenticated HTTP POST request.
	 *
	 * @param {object} options
	 *   @value {string} url - URL to make the request to. Must be whitelisted in manifest.json
	 *   @value {object} request - Execution API request object
	 *   @value {string} token - Google access_token to authenticate request with.
	 *   @value {function} callback - Function to receive response.
	 */
	function post(options) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				// JSON response assumed. Other APIs may have different responses.
				options.callback(JSON.parse(xhr.responseText));
			} else if(xhr.readyState === 4 && xhr.status !== 200) {
				sampleSupport.log('post', xhr.readyState, xhr.status, xhr.responseText);
			}
		};
		xhr.open('POST', options.url, true);
		xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
		xhr.send(JSON.stringify(options.request));
	}
	return {
		onload: function () {
			folderid = document.querySelector('#folderIdin');
			sheetid = document.querySelector('#sheetIdin');
			templateid = document.querySelector('#templateIdin');
			var shtid = document.getElementById('shtid');
			shtid.setAttribute('value',ids[0]);
			signin_button = document.querySelector('#signin');
			signin_button.addEventListener('click', getAuthTokenInteractive);
			xhr_button = document.querySelector('#getxhr');
			xhr_button.addEventListener('click', sendDataToExecutionAPIOpts.bind(xhr_button, true));
			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', revokeToken);
			exec_info_div = document.querySelector('#exec_info');
			exec_data = document.querySelector('#exec_data');
			exec_result = document.querySelector('#exec_result')
			getAuthTokenSilent();
		}
	};
})();

window.onload = executionAPIExample.onload;
