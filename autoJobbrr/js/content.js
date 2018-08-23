document.body.innerHTML = "";

function addButton(cb) {
  chrome.runtime.sendMessage({state: 'get'}, function(response) {
    //var a = document.createElement("div");
    //a.innerText=response;
    var b = document.createElement("div");
    b.class = "fixed-action-btn";
    var c = document.createElement("a");
    c.class="btn-floating btn-large red pulse";
    var d = document.createElement("i");
  d.class ="large material-icons";
  d.innerText = "target";
  d.onclick = cb;
  document.body.appendChild(document.createElement("br"));
  c.appendChild(d);
  b.appendChild(c);
  a.appendChild(b);
  document.body.appendChild(a);
});
}

function log(str) {
  console.log(str);
  logDiv.innerHTML += str + "<br>";
}



function renderButton2() {
var dom_item = document.body.innerHTML;
var div = document.createElement('div');
backpage.domSetAttribute(div, 'id', 'seekButton2');
var backpage = browser.extension.getBackgroundPage();
backpage.domSetAttribute(div, 'class', 'fixed-action-btn');
var div3 = document.createElement('a');
div3.addEventListener('click', click.bind(processOne, true));
backpage.domSetAttribute(div3, 'class', 'btn-floating btn-large blue pulse');
var div2 = document.createElement('i');
backpage.domSetAttribute(div2, 'class', 'large material-icons');
div2.innerText = "target";
backpage.domAppendChild(div, div3);
backpage.domAppendChild(div3, div2);
backpage.domAppendChild(dom_item, div);
}

function renderButton() {
  var dom_item = document.body.innerHTML;
  var newele = document.createElement('a');
  var backpage = browser.extension.getBackgroundPage();
  backpage.domSetAttribute('dom_item', 'class',
    'floating btn-large hoverable blue-grey darken-4 pulse');
  backpage.domSetAttribute('dom_item', 'id', 'seekBut');
  var goButt = document.createElement('i');
  domSetAttribute('goButt', 'class', 'material-icons right');
  goButt.addEventListener('click', click.bind(goButt, true));
  //var t = document.createTextNode();
  // t.innerText= ;
  backpage.domAppendChild(newele, goButt);
  backpage.domAppendChild(dom_item, newele);
  //browser.tabs.getSelected(function(tab) //{});
}

document.addEventListener('DOMContentLoaded', function () {

  addButton(function() {
    chrome.runtime.sendMessage({click: true}, function(response) {
      log("Background page responded: " + response);
    });
  });
  renderButton2();
  renderButton();
});
