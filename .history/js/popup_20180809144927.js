'use strict';


function createJobForm(){
	chrome.storage.sync.get('theFields', function(list) {
	let div = document.getElementById('form');
			for (var i=0;i<list.length;i++){
			let theField = theFields[i];
			let domid = theField.domid;
			let form = document.getElementById(domid);
		let field = createJobField(theField);
	if(theField.done==false){
	field.setAttribute('opacity','0.7');
	}else{
	field.setAttribute('opacity,'1');
	}	
		
div.appendChild(form);
}
}


function createJobField(theField) {
	let div1 = document.createElement('div');
	 div1.setAttribute('class','container');
	 let div2 = document.createElement('div');
	 div2.setAttribute('class','card blue-grey darken-1');
	 let div3 = document.createElement('div');
	 div3.setAttribute('class','card-content white-text');
	 let span = document.createElement('span');
	 span.setAttribute('class','card-title');
	 let title = document.createElement('h6');
	 title.innerText = theField.title;
	 span.appendChild(title);
	 div3.appendChild(span);
	 div2.appendChild(div3);
	 let infield = document.createElement('input');
	 infield.setAttribute('placeholder',theField.value);
	 infield.setAttribute('type','text');
	 div2.appendChild(infield);
	 div1.appendChild(div2);
	 return div1;
	}


	 for (let key of Object.keys(list[i])) {
		 let checkbox = document.createElement('input');
		 checkbox.type = 'text';
		 checkbox.placeholder = list[key].value;
		 checkbox.name = list[key].title;
		 checkbox.value = "";
		 div.appendChild(checkbox);
	 }
	 form.appendChild(div);
 }
 });
}

createJobForm();

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
	var optsButton, gobutton, signin_button, xhr_button, revoke_button, exec_info_div, exec_data, exec_result;
  var theFields = [
    {
      "title":"JobTitle",
      "id": 1,
      "domid": "tit",
      "value":undefined,
      "done":false
    },
    {
      "title":"Company",
      "id": 2,
      "domid": "employ",
      "value":undefined,
      "done":false
    },
    {
      "title":"Contact",
      "id": 3,
      "domid":"cont",
      "value":undefined,
      "done":false
    },
    {
      "title":"USP1",
      "id": 4,
      "domid":"uspi",
      "value":undefined,
      "done":false
    },
      {
        "title":"USP2",
      "id": 5,
      "domid":"uspii",
      "value":undefined,
      "done":false
    },
    {
      "title":"USP3",
      "id": 6,
      "domid":"uspiii",
      "value":undefined,
      "done":false
		},
		{
      "title":"umm7",
      "id": 7,
      "domid":"umm7",
      "value":undefined,
      "done":false
		},
		{
      "title":"umm8",
      "id": 8,
      "domid":"umm8",
      "value":undefined,
      "done":false
		},
		{
      "title":"umm",
      "id": 9,
      "domid":"umm9",
      "value":undefined,
      "done":false
    }];
var theVals = [theFields[0].value,theFields[1].value,theFields[5].value,theFields[7].value,theFields[8].value,theFields[9].value];

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
theFields[1].value = document.querySelector('#emp');
theFields[2].value = document.querySelector('#conta');
theFields[3].value = document.querySelector('#uspi');
theFields[4].value = document.querySelector('#uspii');
theFields[5].value = document.querySelector('#uspiii');
			gobutton = document.querySelector('#gobutton');
			gobutton.addEventListener('click', sendDataToExecutionAPIData.bind(gobutton, true));
			optsButton.addEventListener('click', openOptions.bind(optsButton, true));
			var jobTitle = document.querySelector('#tit');
			jobTitle.addEventListener('change', 'process');
			var company = document.querySelector('#emp');
			company.addEventListener('change', 'process');
			var contact = document.querySelector('#conta');
			contact.addEventListener('change', 'process');
			exec_result = document.querySelector('#exec_result');
			getAuthTokenSilent();
		}
	};
}

window.onload = executionAPIExample.onload;
