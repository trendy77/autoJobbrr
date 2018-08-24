var bk = chrome.extension.getBackgroundPage;
var clikr,clikr2;
var port = chrome.runtime.connect({ name: "contentSEEKr" });

var myWindowId;
var contentBox = document.querySelector("#content");

function renderButton2() {
  var dom_item = document.querySelector('body');
  var div = document.createElement('div');
  backpage.domSetAttribute(div, 'id', 'seekr2');
  var backpage = chrome.extension.getBackgroundPage();
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
  var dom_item = document.innerHTML;
  var newele = document.createElement('a');
  var backpage = chrome.extension.getBackgroundPage();
  backpage.domSetAttribute('dom_item', 'class',
    'floating btn-large hoverable blue-grey darken-4 pulse');
  backpage.domSetAttribute('dom_item', 'id', 'seekr');
  var goButt = document.createElement('i');
  domSetAttribute('goButt', 'class', 'material-icons right');
  goButt.addEventListener('click', click.bind(goButt, true));
  var t = document.createTextNode();
  t.innerText = "test";
  backpage.domAppendChild(newele, goButt);
  backpage.domAppendChild(dom_item, newele);
  document.body.append(newEle);
}


//port.onMessage.addListener(go);
/*function (m) {
  var keyzzz = Object.keys(m);
  for (var r in keyzzz) {
    var key = keyzzz[r];
    var val = key.value;
    if (key == 'state') {

      //  fpstate=key.value;
    } else if (key == 'log') {
      //exec_info.innerText += key.value;
    }
    console.log(key + "= " + val);
  }
}, recOK);
function recOK() {
  port.postMessage({
    response: '1'
  });
}
*/
function process(){
    var selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      window.postMessage({ type: "process", text: selectedText }, "*");
    } else {
      alert('hightlight some text first....')
    }
}

document.addEventListener('DOMContentLoaded', function () {
  renderButton2();
  renderButton1();
			var tooltips = document.querySelectorAll('.tooltipped');
			for (i = 0; i < tooltips.length; i++) {
				M.Tooltip.init(tooltips[i]);
			}
  clikr = document.querySelector("#seekr");
  clikr.addEventListener("click", process);
  clikr2 = document.querySelector("#seekr2");
  clikr2.addEventListener("click", function () {
    var selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      window.postMessage({ type: "process", text: selectedText }, "*");
    } else {
      alert('hightlight some text first....')
    }
  }, false);
});
