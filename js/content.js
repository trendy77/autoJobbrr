var bk = browser.extension.getBackgroundPage();
var bkJsPort = browser.runtime.connect({ name: "port-content" });
browser.tabs.executeScript({
  file: 'js/lize.min.js',
  runAt: 'document_end'
});
browser.tabs.injectCSS({
  file: 'css/content.css'
});

var a = document.createElement('a');
a.setAttribute('href', '');
a.setAttribute('target', '_blank');
a.setAttribute('class', 'btn btn-floating btn-large green pulse');
a.innerHTML = helper;
var b = document.createElement('div');
b.setAttribute('id', 'helper');
b.innerText = 'JT';
var c = document.createElement('i');
c.setAttribute('class', 'material-icons');
c.innerText = 'search';
var d = document.createElement('a');
d.setAttribute('href', '#');
d.setAttribute('class', 'dropdown-button dropdown-trigger btn btn-large z-depth-0');
c.innerHTML = d;
b.innerHTML = c;
a.innerHTML = b;

var contentJsPort = browser.runtime.connect({
  name: "port-content"
});

contentJsPort.onMessage.addListener(function (m) {
  var keys = Object.keys(m);
  for (var r in keys) {
    var key = keys[r];
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
  browser.tabs.executeScript({
    file: 'plnzqb.js',
    runAt: 'document_end'
  });
}

document.body.addEventListener("click", function () {
  var valu = window.selectionText.toString();
  contentJsPort.postMessage({
    msg: "click",
    value: valu
  }, function () {
    browser.tabs.create({
      file: 'popup.html'
    });
  });
});


document.addEventListener('DOMContentLoaded', function () {
  contentJsPort.postMessage({
    msg: "loaded"
  });
  renderButton();
});

document.body.appendChild(a);

$(document).ready(function () {
  $('.dropdown-button').dropdown({
    hover: true,
    constrainWidth: false,
  }
  );
});
