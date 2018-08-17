var bk = chrome.extension.getBackgroundPage();
var bkJsPort = chrome.runtime.connect( { name: "port-content" } );;

function renderButton() {
 var dom_item = document.createElement('a');
 domSetAttribute('dom_item', 'class','floating btn-large hoverable blue-grey darken-4 pulse');
  domSetAttribute('dom_item', 'id', 'seekBut');
 var goButt = document.createElement('i');
 domSetAttribute('goButt', 'class', 'material-icons right');

goButt.addEventListener('click', chrome.extension.getBackgroundPage.set.bind(aBut,true));
var t = document.createTextNode();
t.innerText="Set Highlighted Text" ;
domAppendChild(goButt,t);
domAppendChild(dom_item,goButt);
document.body.appendChild(dom_item);
}


bkJsPort.onMessage.addListener(function (m) {
  console.log("In content script, received message from bkgrd script");
  const msgObj = m.msg;
  if (typeOf(msgObj.jobAppFields) !== 'undefined') {
    var fieldSet = msgObj.jobAppFields;
    console.log(fieldSet);
  }
  });
  

  
document.addEventListener('DOMContentLoaded', function() {
renderButton();

var myPort = browser.runtime.connect({name:"port-contentjs"});
myPort.postMessage({msg: "hi"});

myPort.onMessage.addListener(function(m) {
  var keys = Object.keys(m);
  for (var r in keys){
     console.log(keys[r]+"  "+ keys[r].value);
}
});


document.body.addEventListener("click", function() {
   myPort.postMessage({greeting: "they clicked the button!"});
});