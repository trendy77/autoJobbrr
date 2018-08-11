'use strict';

var executionAPIOpts = (function() {
	var o1b,o2b,o3b;
	
	function setElVal(ele,val) {
		ele.innerHTML = val;
	}

	function getOFields() {
	var o1b = document.querySelector('#shtin');
	fz = o1b.innerHTML;
	if(fz!=""){
	o1=fz;	
	}
	var o2b = document.querySelector('#tplin').innerHTML;
	fz = o2b.innerHTML;
	if(fz!=""){
	o2=fz;	
	}
	var o3b = document.querySelector('#fldin').value;
	fz = o3b.innerHTML;
	if(fz!=""){
	o3=fz;
	}
	}

	return {
		onload: function () {
			getFields();
			exec_SendOpts = "[[\"sheetId\",\"templateId\",\"folderId\"],[\"" + o1 + "\",\"" + o2 + "\",\"" + o3 + "\"]]";
			exec_info_div = document.querySelector('#exec_info');
			exec_info_div.innerHTML = exec_Senddata;
			signin_button = document.querySelector('#signin');
			signin_button.addEventListener('click', getAuthTokenInteractive);
			goButton = document.querySelector('#go');
			goButton.addEventListener('click', sendDataToExecutionAPI.bind(goButton,true));		///getAuthTokenInteractive);
			opts = document.querySelector('#optButton');
			opts.addEventListener('click', chrome.openOptionsPage.bind(opts, true));			
			reset = document.querySelector('#resetBut');
			reset.addEventListener('click', reset);
			exec_info_div = document.querySelector('#exec_info');
			

			xhr_button = document.querySelector('#getxhr');
			xhr_button.addEventListener('click', sendDataToExecutionAPI.bind(xhr_button, true));

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', revokeToken);

			exec_data = document.querySelector('#exec_data');
			exec_result = document.querySelector('#exec_result')
			getAuthTokenSilent();
		}
	};

})();

window.onload = executionAPIOpts.onload;