window.onload = function() {
    document.getElementById('tit').onchange = process;
    document.getElementById('emp').onchange = filterLinks;
    document.getElementById('num').onchange = toggleAll;
    document.getElementById('usp1').onclick = usp;
    document.getElementById('usp2').onclick = usp;
    document.getElementById('usp3').onclick = usp;
    chrome.windows.getCurrent(function (currentWindow) {
      var vale = currentWindow.getSelection.toString();
      var kee = currentWindow.getSelection.toString();
      });
    });
  };
  
  
  document.getElementById("close-window").onclick = function() {
  var ref = document.getElementByClass("input");
  ref.onchange = function(e) {
    storageSet(ref.id, e.value);
  }
}
