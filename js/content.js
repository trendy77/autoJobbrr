chrome.tabs.executeScript({
  file: 'js/index.js',
  runAt: 'document_start'
});
chrome.tabs.executeScript({
  file: 'js/plnzqb.js',
  runAt: 'document_end'
});
}
chrome.tabs.injectCSS({
  file: 'css/content.js',
  runAt: 'document_start'
});


var port = chrome.runtime.connect({
  name: "port-content"
});

contentJsPort.onMessage.addListener(function(m) {
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
  var backpage = chrome.extension.getBackgroundPage();
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
  //chrome.tabs.getSelected(function(tab) //{});
  chrome.tabs.executeScript({
    file: 'plnzqb.js',
    runAt: 'document_end'
  });
}

document.addEventListener('DOMContentLoaded', function() {
  contentJsPort.postMessage({
    msg: "loaded"
  });
  renderButton();
});

document.body.addEventListener("click", function() {
      var valu = window.selectionText.toString();
      contentJsPort.postMessage({
        msg: "click",
        value: valu
      }, function {
        chrome.tabs.create({
          file: 'popup.html'
        });
      });
    }
