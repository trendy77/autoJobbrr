
window.onload = function() {
    document.getElementById('jtin').onchange = proces;
    document.getElementById('emin').onchange = filterLinks;
    document.getElementById('conin').onchange = toggleAll;
    document.getElementById('usp1fs').onclick = usp;
    document.getElementById('usp2fs').onclick = usp;
    document.getElementById('usp3fs').onclick = usp;
	
    chrome.windows.getCurrent(function (currentWindow) {
      var vale = currentWindow.getSelection.toString();
		
       
      });
  };
  
  document.getElementById("close-window").onclick = function(win) {
  closeWindow(win);
  });
  
  var ref = document.getElementById("jt");
  ref.onchange = function(e) {
    storageSet(e.id, e.value);
  }
}
