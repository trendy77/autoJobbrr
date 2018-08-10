'use strict';

 var parent = chrome.contextMenus.create({"title": "JobAdder"});
	    chrome.contextMenus.create({
	    "id": String(1),
	    "title": theFields[0].title,
	    "contexts": ["selection"],
	    "parentId":parent
	  },'process');
	  for(var t=1;t<theFields.length;++t){
    var disOne=theFields[t];
    chrome.contextMenus.create({"id":String(disOne.id),"title": disOne.title, "parentId": parent,"contexts": ["selection"]},'process');
    }


	function process(e) {
	if (e.selectionText){
	  var text =e.selectionText;
	  var id =e.menuItemId;
	  for (let t = 0; t < idz.length; t++) {
		  const ele = idz[t];
		  if(ele==id){
			theVals[t]=text;
			chrome.contextMenus.update(id,{"title": thatits[t] +": "+text });
			return ;  
		  }
	  }
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

function sendDataToExecutionAPIData() {
disableButton(gobutton);
gobutton.className = 'loading';
getAuthToken({
	'interactive': false,
	'callback': sendDataToExecutionAPICallbackData,
});
}

	/**
	 * Calling the Execution API script callback.
	 * @param {string} token - Google access_token to authenticate request with.
	 */
	function sendDataToExecutionAPICallbackData(token) {
		sampleSupport.log('Sending data to Execution API script');
		post({	'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
				'callback': executionAPIResponseData,
				'token': token,
				'request': {'function': 'process1',
							'parameters': {JSON.parse(theVals)}}
			});
	}

	function executionAPIResponseData(response){
		sampleSupport.log(response);
		enableButton(gobutton);
		xhr_button.classList.remove('loading');
		var info;
		if (response.response.result.status == 'ok'){
			info = 'Cover Letter is here: <a href="'+response.response.result.coverletter+'" target="_blank"><strong>.';
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
	 function openOptions(){
	 chrome.runtime.openOptionsPage();
	 }
	 
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
theFields[0].value = document.querySelector('#tit');
theFields[1].value = document.querySelector('#employ');
theFields[2].value = document.querySelector('#cont');
theFields[3].value = document.querySelector('#uspi');
theFields[4].value = document.querySelector('#uspii');
theFields[5].value = document.querySelector('#uspiii');
			gobutton = document.querySelector('#gobutton');
			gobutton.addEventListener('click', sendDataToExecutionAPIData.bind(gobutton, true));
			optsButton.addEventListener('click', openOptions.bind(optsButton, true));
			var jobTitle = document.querySelector('#tit');
			jobTitle.addEventListener('change', 'process');
			var company = document.querySelector('#comp');
			company.addEventListener('change', 'process');
			var contact = document.querySelector('#conta');
			contact.addEventListener('change', 'process');
			exec_result = document.querySelector('#exec_result')
			getAuthTokenSilent();
		}
	};
})();

window.onload = executionAPIExample.onload;