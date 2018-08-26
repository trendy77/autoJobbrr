var bk = chrome.extension.getBackgroundPage;
alert(bk);
var clikr, clikr2;
var myWindowId;
var body = document.querySelector("body");

var jobAppFields = {
  "JobTitle": "",
  "Company": "",
  "Agency": "",
  "Contact": "",
  "Phone-Email": "",
  "USP1": "",
  "USP2": "",
  "USP3": "",
  "JobUrl": ""
};
var theTitles = Object.keys(jobAppFields);
var theVals = Object.values(jobAppFields);
var entries = Object.entries(jobAppFields);
var SCRIPTID = "1OyjlytEo2uEorwa12PyFanPBm549L9Koe2Fl5Mwkg-p-5V4k7k-KgDsc";
/// https://script.google.com/macros/s/AKfycbxB5hPATZclDz6hwe-HKi5o-g9bXtnug6x9nNT5zyBlyeY0pB0/exec
//// !!! ONLY FOR TESTING....!
var o1 = "1TBqN2KpOMse7_pyKDSZW1QIFii1-5VAL9Zbz2np_TUM";
var o2 = "14850XpEs5bNWo8RttAMgUdvA4LE1UK2mFEhPpI9wk18";
var o3 = "1yOQqQ2Nwae5xvS2tuGbUNGUIRqGwqhWw";
////////////////////
var token;
var newIds;
var eOdata = [o1, o2, o3];
var iconText = "!";



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

function process() {
  var selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.runtime.postMessage({ type: "process", text: selectedText }, "*");
  } else {
    alert('hightlight some text first....')
  }
}

function disableButton(button) {
  button.setAttribute('display', 'none');
}
function enableButton(button) {
  button.removeAttribute('display');
}
function iconTit(text) {
  var opt_badgeObj = {};
  var textArr = text;
  opt_badgeObj.text = textArr;
  setIcon(opt_badgeObj);
}
function setIcon(opt_badgeObj) {
  if (opt_badgeObj) {
    var badgeOpts = {};
    if (opt_badgeObj && opt_badgeObj.text != undefined) {
      badgeOpts.text = opt_badgeObj.text;
    }
    chrome.chromeAction.setBadgeText(badgeOpts);
  }
}
function sendLoad(msg, which) {
  if (msg == 'on') {
    chrome.runtime.sendMessage({
      msg: 'load',
      load: 'on',
      which: which
    });
  } else if (msg == 'off') {
    chrome.runtime.sendMessage({
      msg: 'load',
      load: 'off'
    });
  }
}

function sendLog(msg) {
  chrome.runtime.sendMessage({
    msg: 'log',
    log: msg
  });
}

function sendStateChg(msg) {
  chrome.runtime.sendMessage({
    msg: 'state',
    state: msg
  });
}

function getSet() {
  chrome.tabs.query({ active: true }, function (tabs) {
    var info = tabs[0].url;
    chrome.storage.local.get([info], function (obj) {
      var fields = obj.info.jobAppFields || {};
      return fields;
    });
  });
}
function setSet(fields) {
  chrome.tabs.query({ active: true }, function (tabs) {
    var info = tabs[0].url;
    chrome.storage.local.get([info], function (obj) {
      var oldField = obj.info.jobAppFields || {};
      for (var k in fields) {
        oldField[k] = fields.k
      }
      //chrome.storage.local.set([info: ], function(obj){
    });
  });
}

function changeState(newState) {
  fstate = newState;
  sendStateChg(fstate);
  switch (fstate) {
    case STATE_START:
      authd = false;
      chrome.contextMenus.update('SignIn', { visible: true });
      chrome.contextMenus.update('Revoke', { visible: false });
      chrome.contextMenus.update('SendToSheet', { visible: false });
      chrome.contextMenus.update('GoToSheet', { visible: false });

      break;
    case STATE_ACQUIRING_AUTHTOKEN:
      sendLog('Acquiring token...');
      chrome.contextMenus.update('SignIn', { title: "SIGNING IN..." });
      sendLoad('on', 'auth');
      break;
    case STATE_AUTHTOKEN_ACQUIRED:
      sendLoad('off', '');
      authd = true;
      break;
  }
}

function sendOpts(theOpts) {
  newIds = theOpts
  sendLoad('on', 'upIds');
  getAuthToken({
    'interactive': false,
    'callback': sendOptsToSheet
  });
}
function sendOptsToSheet(token) {
  alert('sending ids to Sheet');
  post({
    'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID +
      ':run',
    'callback': executionAPIResponse,
    'token': token,
    'request': {
      'function': 'setIds',
      'parameters': {
        'data': JSON.parse(newIds)
      }
    }
  });
}

function sendDataToSheet(token) {
  sendLog('sending fields to Sheet');
  post({
    'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID +
      ':run',
    'callback': executionAPIResponse,
    'token': token,
    'request': {
      'function': 'process1',
      'parameters': {
        'data': JSON.parse(jobAppFields)
      }
    }
  });
}
function sendVals() {
  var dat = getSet();
  var thedat = object.jobAppFields;
  jobAppFields = thedat;
  //"[" + viObj[0] + "\,\"" + viObj[1] + "\",\"" + viObj[2] + "\",\"" + viObj[3] + "\",\"" + viObj[4] + "\",\"" + viObj[5] + "\",\"" + viObj[6] + "\"]]";
  getAuthToken({
    'interactive': false,
    'callback': sendValsToSheet
  });
}

function getAuthToken(options) {
  chrome.identity.getAuthToken({
    'interactive': options.interactive
  }, options.callback);
}
function getAuthTokenSilent() {
  getAuthToken({
    'interactive': false,
    'callback': getAuthTokenCallback
  });
}
function getAuthTokenInteractive() {
  alert('signing in...');
  getAuthToken({
    'interactive': true,
    'callback': getAuthTokenCallback
  });
}
function getAuthTokenCallback(token) {
  if (chrome.runtime.lastError) {
    alert('No token aquired');
    changeState(STATE_START);
  } else {
    alert('Logged In');
    chrome.contextMenus.update('SignIn', { visible: false });
    chrome.contextMenus.update('RevokeToken', { visible: true });
    chrome.contextMenus.update('Send2Sheet', { visible: true });
    chrome.contextMenus.update('Go2Sheet', { visible: true });

    changeState(STATE_AUTHTOKEN_ACQUIRED);
  }
}
function executionAPIResponse(response) {
  var resp = JSON.stringify(response);
  alert(resp);
  var info;
  if (response.response.result.status == 'ok') {
    sendLog('Data has been entered into <a href="' + response.response
      .result
      .doc + '" target="_blank"><strong>this sheet</strong></a>');
  } else {
    sendLog('Error...');
  }
  sendLoad('off', '');
}
function revokeToken() {
  getAuthToken({
    'interactive': false,
    'callback': revokeAuthTokenCallback,
  });
}
function revokeAuthTokenCallback(current_token) {
  if (!chrome.runtime.lastError) {
    chrome.identity.removeCachedAuthToken({
      token: current_token
    }, function () { });
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
      current_token);
    xhr.send();
    changeState(STATE_START);
    sendLog(
      'Token revoked and removed from cache. chrome://identity-internals to confirm.'
    );
  }
  sendLoad('off', '');
}

function post(options) {
  sendLog('posting');
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // JSON response assumed. Other APIs may have different responses.
      options.callback(JSON.parse(xhr.responseText));
    } else if (xhr.readyState === 4 && xhr.status !== 200) {
      sendLog('post', xhr.readyState, xhr.status, xhr.responseText);
    }
  };
  xhr.open('POST', options.url, true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
  xhr.send(JSON.stringify(options.request));
}

function resetIt() {
  chrome.storage.local.clear();

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
