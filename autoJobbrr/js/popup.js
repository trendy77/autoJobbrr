"use strict";

// ONLOAD FUNCTION....
var fields = (function ()
{
	var contentBox, test, reset, goButton;
	function displayFs()
	{
		chrome.windows.getCurrent({ populate: true }, function (windowInfo)
		{
			var myWindowId = windowInfo.id;
			chrome.tabs.query({ windowId: myWindowId, active: true }, function (tabs)
			{
				var toget = [tabs[0].url];
				chrome.storage.local.get([toget], function (storedInfo)
				{
					var theV = storedInfo.jobAppFields;
					var tit = document.querySelector('#tit');
					tit.setAttribute('placeholder', theV.JobTitle);
					var emp = document.querySelector('#emp');
					emp.setAttribute('placeholder', theV.Company);
					var bk = chrome.extension.getBackgroundPage();
					bk.domSetAttribute('#con', 'placeholder', theV[Contact].value || "");
					bk.domSetAttribute('#num', 'placeholder', theV[Number].value || "");
					bk.domSetAttribute('#rec', 'placeholder', theV[Agency].value || "");
					bk.domSetAttribute('#u1', 'placeholder', theV[USP1].value || "");
					bk.domSetAttribute('#u3', 'placeholder', theV[USP2].value || "");
					bk.domSetAttribute('#u2', 'placeholder', theV[USP3].value || "");
					document.querySelector('#exec_data').innerText = JSON.stringify(theV);
				});
			});
		});
	}

	function bkresetIt()
	{
		chrome.extension.getBackgroundPage.resetIt();
	}
	function bksendVals()
	{
		chrome.extension.getBackgroundPage.sendVals();
	}

	return {
		onload: function ()
		{
			contentBox = document.querySelector("#fieldsContainer");
			test = document.querySelector("#buttest");

			// fields buttons - nav
			reset = document.querySelector('#reset');
			reset.addEventListener('click', bkresetIt.bind(reset, true));
			goButton = document.querySelector('#go');
			goButton.addEventListener('click', bksendVals.bind(goButton, true));
			//	close = document.querySelector('#close');
			//	close.addEventListener('click', bkclose.bind(close, true));

			//createFields();
			displayFs();

		}
	};

})();

window.onload = fields.onload;

