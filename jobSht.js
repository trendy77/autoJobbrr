function getIds(which){
	chrome.storage.sync.get(['theIds'], function(obj){
		var ids = obj.theIds || [];
		var sht = ids[0];
		return sht;
	});
}

var shtId = chrome.extension.getBackgroundPage.o1 || getIds(0);
document.location.href = "https://docs.google.com/spreadsheets/d/" + shtId + "/edit#gid=0&authuser=0";
