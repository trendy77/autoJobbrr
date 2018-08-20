
var bk = browser.extension.getBackgroundPage;

function createOptionsForm(bk) {
	var content = document.querySelector('#content');
	var div = document.createElement('div');
	bk.domSetAttribute(div, 'class', 'container');
	browser.storage.sync.get(['theIds'], function (list) {
		var form = document.getElementById('form');
		for (var i = 0; i < list.length; i++) {
			for (var key in Object.keys(list[i])) {
				var checkbox = document.createElement('input');
				checkbox.type = 'text';
				checkbox.placeholder = list[key].value;
				checkbox.name = list[key].title;
				checkbox.value = "";
				div.appendChild(checkbox);
			}
			content.appendChild(div);
		}
	});
}

createOptionsForm();

document.getElementById('optionsSubmit').onclick = function () {
	var checkboxes = document.getElementsByTagName('input');
	var changed = [];
	var newVal = [];
	var newArr = {};
	for (i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].value != "") {
			newArr.push([changed, newVal]);
		}
	}
	browser.storage.sync.set(newArr);
}
