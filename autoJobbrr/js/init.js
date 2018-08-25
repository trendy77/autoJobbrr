
var signin, revoke_button, close, upIds, contentBox, reset, goButton;
// info divs
var exec_info_div, exec_result;
var oo1, oo2, oo3, upIds;
var eOdata = [oo1, oo2, oo3];
var upIds, opts_data, opts_result, opts_info, tpl, sht, fld;


function bkresetIt() {
	chrome.extension.getBackgroundPage.resetIt();
}
function bksendVals() {
	chrome.extension.getBackgroundPage.sendVals();
}

chrome.runtime.sendMessage({ getFields: true }, function (response) {
	var theFields = response.jobAppFields;
	var title = theFields.JobTitle;
	log("title: " + title);
	log("Persisted counter is: " + JSON.stringify(response));
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
		console.log(key + "= " + key.value);
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
	chrome.extension.getBackgroundPage.closeWindow();
}

function bkrevokeToken() {
	chrome.extension.getBackgroundPage.revokeToken();
}
function bkSignin() {
	chrome.extension.getBackgroundPage.getAuthTokenInteractive();
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
	var pop = document.querySelector('#popup2');
	chrome.tabs.query({ windowId: windowId, active: true }, function (tabs) {
		chrome.storage.local.get([tabs[0].url], function (storedInfo) {
			var theFields = storedInfo.jobAppFields || {};
			for (var t in theFields) {
				var key = theFields[t];
				var vl = key.value;
				var element = chrome.extension.getBackgroundPage.domCreateElement(document, 'input');
				chrome.extension.getBackgroundPage.domSetAttribute(element, 'placeholder', vl);
				chrome.extension.getBackgroundPage.domAppendChild(pop, element);
			}
		});
	});
}

function createOptionsForm() {
	var contBox = document.querySelector("#optsContent2");
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
			chrome.storage.local.get([toget], function (storedInfo) {
				var theV = storedInfo.jobAppFields;
				var tit = document.querySelector('#tit');
				tit.setAttribute('placeholder', theV.JobTitle);
				var emp = document.querySelector('#emp');
				emp.setAttribute('placeholder', theV.Company);
				var con = documentquerySelector('#con');
				con.setAttribute('placeholder', theV.Contact);
				var num = documentquerySelector('#num');
				num.setAttribute('placeholder', theV.num);
				var rec = documentquerySelector('#rec');
				rec.setAttribute('placeholder', theV.rec);
				var u1 = documentquerySelector('#u1');
				u1.setAttribute('placeholder', theV.u1);
				var u3 = documentquerySelector('#u3');
				u3.setAttribute('placeholder', theV.u3);
				var u2 = documentquerySelector('#u2');
				u2.setAttribute('placeholder', theV.u2);
				document.querySelector('#exec_data').innerText = JSON.stringify(theV);
			});
		});
	});
}



document.addEventListener('DOMContentLoaded', function () {
	reset = document.querySelector('#reset');
	reset.addEventListener('click', bkresetIt.bind(reset, true));
	goButton = document.querySelector('#go');
	goButton.addEventListener('click', bksendVals.bind(goButton, true));
	//contentBox = document.querySelector("#fieldsContainer");
	//createFields();
	displayFs();
	// auth?
	signin = document.querySelector('#signin');
	signin.addEventListener('click', bkSignin);
	revoke_button = document.querySelector('#revoke');
	revoke_button.addEventListener('click', bkrevokeToken);
	// nav?
	createOptionsForm();
	upIds = document.querySelector('#upIds2');
	upIds.addEventListener('click', inTestInput);
	close = document.querySelector('#close');
	close.addEventListener('click', bkclose);
	// logs?
	exec_result = document.querySelector('#exec_result');
	exec_info_div = document.querySelector('#exec_info');
	var oo1 = chrome.runtime.getBackgroundPage(o1);
	var oo2 = chrome.extension.getBackgroundPage().o2;
	var oo3 = chrome.extension.getBackgroundPage.o3;
	sht = document.querySelector('#shtin');
	sht.setAttribute('placeholder', oo1);
	tpl = document.querySelector('#tplin');
	tpl.setAttribute('placeholder', oo2);
	fld = document.querySelector('#fldin');
	fld.setAttribute('placeholder', oo3);
	//opts tab


	var sht = document.querySelector('#shtin');
	var tpl = document.querySelector('#tplin');
	var fld = document.querySelector('#fldin');
	sht.setAttribute('placeholder', oo1);
	tpl.setAttribute('placeholder', oo2);
	fld.setAttribute('placeholder', oo3);
	opts_data = document.querySelector('#opts_data');
	opts_data.innerText = eOdata;
	opts_info = document.querySelector('#opts_info');

	upIds = document.querySelector('#upIds');
	upIds.addEventListener('click', inTestInput);

	opts_result = document.querySelector('#opts_result');

});


			// in fields....
			//	goButton = document.querySelector('#go');
			//	goButton.addEventListener('click', bksendVals.bind(goButton, true));
			//	reset = document.querySelector('#reset');
			//	reset.addEventListener('click', bkresetIt.bind(reset, true));
			// in options...
			//	upIds = document.querySelector('#upIds');
			//	upIds.addEventListener('click', inTestInput);

