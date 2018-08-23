'use strict';

var optsPanel = (function () {
	var exec_info_div, exec_data, exec_result;
	var oo1, oo2, oo3;
	var eOdata = [oo1, oo2, oo3];
	var revoke_button, returnTo, signin_button;

	function inTestInput() {
		//	var sht = document.querySelector('#shtin');
		var checkboxes = document.querySelectorAll('input');
		for (i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].value !== "") {
				if (checkboxes[i].value !== eOdata[i]) {
					eOdata[i] = checkboxes[i].value;
				}
			}
		}
		chrome.storage.sync.set({ theIds: eOdata }, function(){
		chrome.extension.getBackgroundPage.sendOpts();	
		});
	}

	var optsTab = chrome.runtime.connect({
		name: "optsTab"
	});

	optsTab.onMessage.addListener(function (m) {
		var keys = Object.keys(m);
		for (var r in keys) {
			var key = keys[r];
			if (key == 'state') {
				fpstate = key.value;
			}
			else if (key == 'log') {
				exec_info_div.innerText += key.value;
			} else if (key == 'load') {
				var vall = key.value;
				if (vall == "on") {
					loadingOn();
				} else if (vall == "off") {
					loadingOff();
				}
			}
			console.log(key + "= " + key.value);
		}
	});

	function loadingOn() {
		var ele = document.querySelector('#spin');
		ele.display = 'block';
		}

	function loadingOff() {
		var ele = document.querySelector('.loadspin');
		ele.display.value = 'none';
	}

	function createOptionsForm() {
		var contentBox = document.querySelector("#ids");
		var bk = chrome.extension.getBackgroundPage;
		chrome.storage.sync.get(['theIds'], function (list) {
			var savedIds = list.theIds || [];
			oo1 = savedIds[0];
			oo2 = savedIds[1];
			oo3 = savedIds[2];
				var ns = ['shtin', 'tplin', 'fldin'];
			//var ns = ['SheetId', 'TemplateId', 'FolderId'];
			for (var i = 0; i < savedIds.length; i++) {
				var deItem = document.createElement('input');
				bk.domSetAttribute(deItem, 'placeholder', savedIds[i]);
				bk.domSetAttribute(deItem, 'value', '');
				bk.domAppendChild(contentBox, deItem);
			}
			var toolt = bk.createElement(document, 'but');
			bk.domAddClass(toolt, 'tooltipped');
			bk.domSetAttribute(toolt, 'data-position', 'bottom');
			bk.domSetAttribute(toolt, 'data-tooltip', 'Set / Sync IDs');
			bk.domSetAttribute(toolt, 'data-delay', '40');
			var idbutton = bk.createElement(document, 'upIds');
			bk.domAddClass(idbutton, 'waves-effect waves-light btn pulse');
			bk.domSetAttribute(idbutton, 'placeholder', savedIds[i]);
			bk.domSetAttribute(idbutton, 'value', '');
			bk.domAppendChild(contentBox, idbutton);
			bk.createTextNode('SendIds', idButton);
			bk.appendChild(toolt, idbutton);
			bk.appendChild(contentBox, toolt);
		});
	}

	return {
		onload: function () {

			createOptionsForm();
			exec_data = document.querySelector('#exec_data');
			exec_data.innerText = eOdata;

			exec_info_div = document.querySelector('#exec_info');

			signin_button = document.querySelector('#signin');
			signin_button.addEventListener('onClick', bk.getAuthTokenInteractive);

			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', revokeToken);

			upIds = document.querySelector('#upIds');
			upIds.addEventListener('click', inTestInput);
			exec_result = document.querySelector('#exec_result');
		}
	};
})();

window.onload = optsPanel.onload;
