

window.onload = function() {
  
  document.getElementById("close-window").onclick = function() {
    window.close();
  }
  
  var ref = document.getElementByClass("input");
  ref.onchange = function(e) {
    storageSet(ref.id, e.value);
  }
}
