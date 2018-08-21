'use strict';
var bk = browser.extension.getBackgroundPage();

var optsPanel = (function () {
	var exec_info_div, upIds, exec_data, exec_result;
	var o1, o2, o3;
	var exec_Optsdata = [o1, o2, o3];
	var revoke_button, returnTo, signin_button;

	function inTestInput() {
		//	var sht = document.querySelector('#shtin');
		var checkboxes = document.getElementsByClass('input');
		for (i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].value !== "") {
				if (checkboxes[i].value !== exec_Optsdata[i]) {
					exec_Optsdata[i] = checkboxes[i].value;
				}
			}
		}
		browser.storage.sync.set({ theIds: exec_Optsdata }, tellSendIds);
	}

	var optsTab = browser.runtime.connect({
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
	}, recievedOK);

	function recievedOK() {
		optsTab.postMessage({
			response: '1'
		});
	}

	function loadingOn() {
		var ele = document.querySelector('#loadspin');
		browser.extension.getBackgroundPage.displayDefault(ele);
	}

	function loadingOff() {
		var ele = document.querySelectorAll('#loadspin');
		for (var th in ele) {
			var itd = ele.th;
			browser.extension.getBackgroundPage.displayNone(itd);
		}
	}
	function tellSendIds() {
		optsTab.postMessage({
			send: 'options'
		});
	}

	function createOptionsForm() {
		var contentBox = document.querySelector("#content");
		var bk = browser.extension.getBackgroundPage();
		browser.storage.sync.get(['theIds'], function (list) {
			var savedIds = list.theIds || [];
			o1 = savedIds[0];
			o2 = savedIds[1];
			o3 = savedIds[2];
			//	var ns = ['shtin', 'tplin', 'fldin'];
			var ns = ['SheetId', 'TemplateId', 'FolderId'];
			for (var i = 0; i < savedIds.length; i++) {
				var deItem = bk.createElement(document, ns[i]);
				bk.domAddClass(deItem, 'input');
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
			exec_data.innerText = exec_Optsdata;

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
