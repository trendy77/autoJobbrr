
// ONLOAD FUNCTION....
var getBackNGo = (function () {
	chrome.runtime.getBackgroundPage(function (bkpage) {
		var jobAppFields = bkpage.jobAppFields;
		var theIds = bkpage.eOdata;
		alert(jobAppFields);
		var signin, revoke_button, close, upIds, revokeT, goButton, signinT;
		// info divs
		var exec_info_div, exec_data, exec_result, exec_info;
		var oo1, oo2, oo3;
		var eOdata = [oo1, oo2, oo3];
		var tpl, sht, fld;

		function bkresetIt() {
			chrome.extension.getBackgroundPage.resetIt();
		}
		function bksendVals() {
			chrome.extension.getBackgroundPage.sendVals();
		}


		chrome.runtime.sendMessage({ msg: 'getState' }, function (response) {
			var state = response.msg;
			log("youre current auth state: " + state);
			switch (state) {
				case STATE_START:

					break;
				case STATE_ACQUIRING_AUTHTOKEN:
					break;
				case STATE_AUTHTOKEN_ACQUIRED:
					break;
			}
		});

		chrome.runtime.onMessage.addListener(
			function (request, sender, sendResponse) {
				if (request.msg == "theVals") {

				}
				else if (request.msg == 'log') {
					exec_info_div.innerText += request.log.value;
				} else if (request.msg == 'load') {
					var vall = request.load.value;
					if (vall == "on") {
						loadingOn();
					} else if (vall == "off") {
						loadingOff();
					}
				}
			});

		function setContentField(key, val) {
			var box = document.getElementById(key);
			box.setAttribute('data-tooltip', val);
			box.setAttribute('placeholder', val);
		}
		function loadingOn() {
			var ele = document.querySelector('.loadspin');
			ele.display = 'block';
		}
		function loadingOff() {
			var ele = document.querySelector('.loadspin');
			ele.display.value = 'none';
		}
		function bkclose() {
			bkpage.closeWindow();
		}
		function bkrevokeToken() {
			bkpage.revokeToken();
		}
		function bkSignin() {
			bkpage.getAuthTokenInteractive();
		}
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
			chrome.storage.sync.set({ theIds: eOdata }, function () {
				chrome.extension.getBackgroundPage.sendOpts();
			});
		}
		function createOpts() {
			chrome.storage.sync.get(['theIds'], function (object) {
				var theIds = object.theIds || [];
				var box = document.querySelector('#idButtons');
				for (var key in theIds) {
					var input = document.createElement('input');
					input.innerText = jobFields[key].value;
					var span = box.getElementsByTagName('span');
					span.textContent = theIds[key].value;
					box.appendChild(input);
				}
			});
		}
		function getNewIds() {
			var s = document.getElementById('shtin').value.trim();
			var t = document.getElementById('fldin').value.trim();
			var f = document.getElementById('tplin').value.trim();
			var theNewIds = [s, t, f];
			return theNewIds;
		}
		function createFields() {
			var pop = document.querySelector('#templateContainer');
			chrome.windows.getCurrent({ populate: true }, function (windowInfo) {
				var myWindowId = windowInfo.id;
				chrome.tabs.query({ windowId: myWindowId, active: true }, function (tabs) {
					chrome.storage.local.get([tabs[0].url], function (storedInfo) {
						var theFields = storedInfo.jobAppFields;
						for (var t in theFields) {
							var key = theFields[t];
							var vl = key;
							var element = chrome.extension.getBackgroundPage.domCreateElement(document, 'input');
							chrome.extension.getBackgroundPage.domSetAttribute(element, 'placeholder', vl);
							chrome.extension.getBackgroundPage.domAppendChild(pop, element);
						}
					});
				});
			});
		}
		function createOptionsForm() {
			var contBox = document.querySelector("#builderContainer");
			var bk = chrome.extension.getBackgroundPage();
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
					bk.domAppendChild(contentBox, deItem);
				}
				var toolt = document.createElement('a');
				toolt.setAttribute('class', 'tooltipped');
				toolt.setAttribute('data-position', 'bottom');
				toolt.setAttribute('data-tooltip', 'Set / Sync IDs');
				toolt.setAttribute('data-delay', '40');
				var idbutton = document.createElement('a');
				idbutton.setAttribute('id', 'upIds2');
				idbutton.setAttribute('class', 'waves-effect waves-light btn pulse');
				toolt.appendChild(idbutton);
				contBox.appendChild(toolt);
			});
		}
		function displayFs() {
			chrome.windows.getCurrent({ populate: true }, function (windowInfo) {
				var myWindowId = windowInfo.id;
				chrome.tabs.query({ windowId: myWindowId, active: true }, function (tabs) {
					var toget = tabs[0].url;
					chrome.storage.local.get(['jobAppFields'], function (storedInfo) {
						var theV = storedInfo.jobAppFields || [];
						var tit = document.querySelector('#tit');
						tit.setAttribute('placeholder', theV.JobTitle);
						var emp = document.querySelector('#emp');
						emp.setAttribute('placeholder', theV.Company);
						var con = documentquerySelector('#con');
						con.setAttribute('placeholder', theV.Contact);
						var num = documentquerySelector('#num');
						num.setAttribute('placeholder', theV.Number);
						var rec = documentquerySelector('#rec');
						rec.setAttribute('placeholder', theV.Agency);
						var u1 = documentquerySelector('#u1');
						u1.setAttribute('placeholder', theV.USP1);
						var u2 = documentquerySelector('#u3');
						u2.setAttribute('placeholder', theV.USP2);
						var u3 = documentquerySelector('#u2');
						u3.setAttribute('placeholder', theV.USP3);
						document.querySelector('#exec_data').innerText = JSON.stringify(theV);
					});
				});
			});
		}
		function on(element) {
			document.getElementById(element).style.display = "block";

		}
		// inserted element variable substitute instead of "overlay")
		function off(element) {
			document.getElementById(element).style.display = "none";
		}

	});

	return {
		onload: function () {

			//		document.addEventListener('DOMContentLoaded', function () {
			on('overlay');
			reset = document.querySelector('#reset');
			reset.addEventListener('click', bkresetIt.bind(reset, true));
			goButton = document.querySelector('#go');
			goButton.addEventListener('click', bksendVals.bind(goButton, true));
			createFields();
			displayFs();
			// auth?
			signin = document.querySelector('#signin');
			signin.addEventListener('click', bkSignin);
			signinT = document.querySelector('#signinT');
			signinT.addEventListener('click', bkSignin);
			revokeT = document.querySelector('#revokeT');
			revokeT.addEventListener('click', bkrevokeToken);
			revoke_button = document.querySelector('#revoke');
			revoke_button.addEventListener('click', bkrevokeToken);
			// nav?
			// below records / stores if/when new IDs are saved...
			createOptionsForm();
			upIds = document.querySelector('#upIds');
			upIds.addEventListener('click', inTestInput);
			close = document.querySelector('#close');
			close.addEventListener('click', bkclose);
			// logs?
			exec_result = document.querySelector('#exec_result');
			exec_info_div = document.querySelector('#exec_info');

			sht = document.querySelector('#shtin');
			sht.setAttribute('placeholder', oo1);
			tpl = document.querySelector('#tplin');
			tpl.setAttribute('placeholder', oo2);
			fld = document.querySelector('#fldin');
			fld.setAttribute('placeholder', oo3);
			//	});
			// in fields....
			//	goButton = document.querySelector('#go');
			//	goButton.addEventListener('click', bksendVals.bind(goButton, true));
			//	reset = document.querySelector('#reset');
			//	reset.addEventListener('click', bkresetIt.bind(reset, true));
			// in options...
			//	upIds = document.querySelector('#upIds');
			//	upIds.addEventListener('click', inTestInput);
		}
	};

})();

window.onload = getBackNGo.onload;