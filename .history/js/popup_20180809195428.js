'use strict';


createJobForm();

	var optsButton,goButton,exec_info_div, exec_data, exec_result; 
	document.querySelector('#optsButton').addEventListener(function () {
		// INSTEAD OF : document.getElementById('').onclick = function() {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	});
	document.querySelector('#begin').addEventListener(function () {
				//document.getElementById('begin').onclick = function() {
				let checkboxes = document.getElementsByTagName('input');
				for (i = 0; i < checkboxes.length; i++) {
					let disBox = checkboxes[i];
					
					if (checkboxes[i].value != "") {
						newArr[i].value = checkboxes[i].value;
					} else {
						alert('forgot :' + newArr[i].title);
					}
				}
				sendDataToExecutionAPIData();
				// popup results?
				//window.close();
	});

	document.querySelector('#tit').addEventListener(function () {
		// INSTEAD OF : document.getElementById('').onclick = function() {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	});
	document.querySelector('#emplo').addEventListener(function () {
		window.open(chrome.runtime.getURL('options.html'));		
		sendDataToExecutionAPIData();
				// popup results?
				//window.close();
	});

	
	
window.onload = executionAPIExample.onload;