"use strict";
// ONLOAD FUNCTION....
var fields2 = (function ()
{

	var contentBox, test;

	function createFields()
	{
		var pop = document.querySelector('#popup2');
		chrome.tabs.query({ windowId: windowId, active: true }, function (tabs)
		{
			chrome.storage.local.get([tabs[0].url], function (storedInfo)
			{
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
			contentbox = document.querySelector("#content");
			test = document.querySelector("#buttest");

			// fields buttons - nav
			reset = document.querySelector('#reset');
			reset.addEventListener('click', bkresetIt.bind(reset, true));
			goButton = document.querySelector('#go');
			goButton.addEventListener('click', bksendVals.bind(goButton, true));
			//	close = document.querySelector('#close');
			//	close.addEventListener('click', bkclose.bind(close, true));

			createFields();
			//displayFs();

		}
	};

})();

window.onload = fields2.onload;

