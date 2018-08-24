'use strict';

var optsPanel2 = (function ()
{
	var oo1 = chrome.extension.getBackgroundPage.o1;
	var oo2 = chrome.extension.getBackgroundPage.o2;
	var oo3 = chrome.extension.getBackgroundPage.o3;
	var eOdata = [oo1, oo2, oo3];
	var upIds;
	var sht = document.querySelector('#shtin');
	var tpl = document.querySelector('#tplin');
	var fld = document.querySelector('#fldin');

	sht.setAttribute('placeholder', oo1);
	tpl.setAttribute('placeholder', oo2);
	fld.setAttribute('placeholder', oo3);

	function inTestInput()
	{
		//	var sht = document.querySelector('#shtin');
		var checkboxes = document.querySelectorAll('input');
		for (i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].value !== "") {
				if (checkboxes[i].value !== eOdata[i]) {
					eOdata[i] = checkboxes[i].value;
				}
			}
		}
		chrome.storage.sync.set({ theIds: eOdata }, function ()
		{
			chrome.extension.getBackgroundPage.sendOpts(eOdata);
		});
	}

	function getNewIds()
	{
		var s = document.getElementById('shtin').value.trim();
		var t = document.getElementById('fldin').value.trim();
		var f = document.getElementById('tplin').value.trim();
		var theNewIds = [s, t, f];
		return theNewIds;
	}


	function createOptionsForm()
	{
		var contentBox = document.querySelector("#optsContent2");
		var bk = chrome.extension.getBackgroundPage();
		chrome.storage.sync.get(['theIds'], function (list)
		{
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
			var toolt = bk.createElement('a', 'upIds2');
			bk.domAddClass(toolt, 'tooltipped');
			bk.domSetAttribute(toolt, 'data-position', 'bottom');
			bk.domSetAttribute(toolt, 'data-tooltip', 'Set / Sync IDs');
			bk.domSetAttribute(toolt, 'data-delay', '40');
			var idbutton = bk.createElement('a', 'upIds');
			bk.domAddClass(idbutton, 'waves-effect waves-light btn pulse');
			bk.domSetAttribute(idbutton, 'placeholder', savedIds[i]);
			bk.domSetAttribute(idbutton, 'value', '');
			bk.domAppendChild(contentBox, idbutton);
			bk.createTextNode('SendIds', idButton);
			toolt.appendChild(idbutton);
			contentBox.appendChild(toolt);
		});
	}

	return {
		onload: function ()
		{
			createOptionsForm();

			upIds = document.querySelector('#upIds2');
			upIds.addEventListener('click', inTestInput);
		}
	};
})();

window.onload = optsPanel2.onload;
