window.onload = function() {
    document.getElementById('tit').onchange = storageSet;
    document.getElementById('emp').onchange = filterLinks;
    document.getElementById('num').onchange = toggleAll;
    document.getElementById('usp1').onclick = usp;
    document.getElementById('usp2').onclick = usp;
    document.getElementById('usp3').onclick = usp;
    chrome.windows.getCurrent(function (currentWindow) {
      chrome.tabs.query({active: true, windowId: currentWindow.id},
                        function(activeTabs) {
        chrome.tabs.executeScript(
          activeTabs[0].id, {file: 'send_links.js', allFrames: true});
      });
    });
  };
  
  
  document.getElementById("close-window").onclick = function() {
  var ref = document.getElementByClass("input");
  ref.onchange = function(e) {
    storageSet(ref.id, e.value);
  }
}
