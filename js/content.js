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


function processOne() {
  alert('clicked!');
}

function renderButton2() { }
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

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy-link-to-clipboard") {
    // Examples: text and HTML to be copied.
    const text = "This is text: " + info.linkUrl;
    // Always HTML-escape external input to avoid XSS.
    const safeUrl = escapeHTML(info.linkUrl);
    const html = `This is HTML: <a href="${safeUrl}">${safeUrl}</a>`;

    // The example will show how data can be copied, but since background
    // pages cannot directly write to the clipboard, we will run a content
    // script that copies the actual content.

    // clipboard-helper.js defines function copyToClipboard.
    const code = "copyToClipboard(" +
      JSON.stringify(text) + "," +
      JSON.stringify(html) + ");";

    browser.tabs.executeScript({
      code: "typeof copyToClipboard === 'function';",
    }).then((results) => {
      // The content script's last expression will be true if the function
      // has been defined. If this is not the case, then we need to run
      // clipboard-helper.js to define function copyToClipboard.
      if (!results || results[0] !== true) {
        return browser.tabs.executeScript(tab.id, {
          file: "clipboard-helper.js",
        });
      }
    }).then(() => {
      return browser.tabs.executeScript(tab.id, {
        code,
      });
    }).catch((error) => {
      // This could happen if the extension is not allowed to run code in
      // the page, for example if the tab is a privileged page.
      console.error("Failed to copy text: " + error);
    });
  }
});

// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
  // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
  // Most often this is not the case though.
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

document.addEventListener("click", function () {
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
