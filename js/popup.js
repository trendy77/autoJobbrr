'use strict';

var executionAPIpopup = (function() {
	var F_START=1;
	var STATE_2=2;
	var STATE_3=3;
	var STATE_4=4;
	var STATE_5=5;
	var STATE_6=6;
	var STATE_7=7;
	var fstate = F_START;
	var goButton, optsButton, resetBut,exec_info, exec_box, exec_data, exec_Senddata, exec_result,f1b,f2b,f4b,f3b,f5b,f6b,f7b;
		
	function enableEl(ele) {
		ele.setAttribute('opacity', '1');
	}
	

	function changeFState(newFState) {
		fstate = newFState;
		switch (fstate) {
		  case F_START:
			enableEl('titfs');
			f1b.addEventListener();
			disableButton(goButton);
			enableButton(optsButton);
			break;
			case STATE_2:
			enableEl('empfs');
			f2b.addEventListener('change',changeFstate);
			break;
			case STATE_3:
			enableEl('confs');f3b.addEventListener('change',changeFstate);break;
			case STATE_4:
			enableEl('confs');f4b.addEventListener('change',changeFstate);break;
			case STATE_5:
			enableEl('usp1');f5b.addEventListener('change',changeFstate);break;
			case STATE_6:
			enableEl('uspf2');f6b.addEventListener('change',changeFstate);break;
			case STATE_7:
			enableEl('uspf3');f7b.addEventListener('change',changeFstate);break;
			break;
		}
	}


	function getFields() {
		f1b = document.querySelector('#tit');
		f1b.addEventListener('change', changeFState);
		var fz = f1b.innerHTML;
		if(fz!=""){
		f1 = fz;
		}
		f2b = document.querySelector('#emp');
		f2b.addEventListener('change', changeFState);
		fz = f2b.innerHTML;
		if(fz!=""){
		f2= fz;
		}
		f3b = document.querySelector('#con');
		f3b.addEventListener('change', changeFState);
		fz = f3b.innerHTML;
		if(fz!=""){
		f3= fz;
		}
		f4b = document.querySelector('#rec');
		f4b.addEventListener('change', changeFState);
		fz = f4b.innerHTML;
		if(fz!=""){
		f4= fz;
		}
		f5b = document.querySelector('#u1');
		f5b.addEventListener('change', changeFState);
		fz = f5b.innerHTML;
		if(fz!=""){
		f5= fz;
		}
		f6b = document.querySelector('#u2');
		f6b.addEventListener('change', changeFState);
		fz = f6b.innerHTML;
		if(fz!=""){
		f6= fz;
		}
		f7b = document.querySelector('#u3');
		f7b.addEventListener('change', changeFState);
		fz= f7b.innerHTML;
		if(fz!=""){
		f7= fz;
		}
	}
		
	function sendDataToSheet(token) {
		sampleSupport.log('Sending data to Execution API script');
		post({	'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
				'callback': executionAPIResponse,
				'token': token,
				'request': {'function': 'process1',
							'parameters': {'data':JSON.parse(exec_data.value)}}
			});
	}

	function resetIt() {
			for (let ea in fsz){
				theFields[ea] = "";
			}
			sampleSupport.log(' reset. ');
			changeState(F_START);
		}
	return {
		onload: function () {
			getFields();
			exec_Senddata = "[[\"JobTitle\",\"Employer\",\"Contact\",\"Number\",\"USP1\",\"USP2\",\"USP3\"][\"" + f1 + "\",\"" + f2 + "\",\"" + f3 + "\",\"" + f4 + "\",\"" + f5 + "\",\"" + f6 + "\",\"" + f7 + "\"]]";
			exec_data = document.querySelector('#exec_data');
			exec_data.innerHTML = exec_Senddata;
			goButton = document.querySelector('#go');
			goButton.addEventListener('click', getAuthTokenInteractiveData);		///getAuthTokenInteractive);
			opts = document.querySelector('#optButton');
			opts.addEventListener('click', chrome.openOptionsPage.bind(opts, true));
			
			reset = document.querySelector('#resetBut');
			reset.addEventListener('click', resetIt);
			exec_info_div = document.querySelector('#exec_info');
			exec_result = document.querySelector('#exec_result')
			getAuthTokenSilent();
		}
	}

})();

window.onload = executionAPIpopup.onload;

