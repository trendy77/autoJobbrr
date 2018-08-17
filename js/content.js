
function renderButton(button, state, parent) {
 var dom_item = document.createElement('a');
 aBut.innerHTML = "class='floating btn-large hoverable blue-grey darken-4 pulse' id='seekButton'";
 var goButt = document.createElement('i');
 var att2 = document.createAttribute("class");       // Create a "class" attribute
 att2.value = "material-icons right";                          
 goButt.setAttributeNode(att2);  
 aBut.appendChild(goButt);
 aBut.addEventListener('click', doField.bind(aBut,true));
var t = document.createTextNode();
   t.innerText="Click Job Title!";
 document.body.appendChild(dom_item);
}


var bk=chrome.extension.getBackgroundPage();
var bkJsPort;

bkJsPort.onMessage.addListener(m => {
  console.log("In popup script, received message from bkgrd script");
  const msgObj = m.msg;
  if (typeOf(msgObj.jobAppFields) !== 'undefined') {
    var fieldSet = msgObj.jobAppFields;
    console.log(fieldSet);
  }
  
    }
  }
} 
  
document.addEventListener('DOMContentLoaded', function() {
renderButton();

var myPort = browser.runtime.connect({name:"port-contentjs"});
myPort.postMessage({greeting: "status"});

myPort.onMessage.addListener(function(m) {
 var keys = Object.keys(m);
 for (var r in keys){
 console.log(keys[r]+"  "+ keys[r].value);
}
});


document.body.addEventListener("click", function() {
   myPort.postMessage({greeting: "they clicked the button!"});
  alert('button pressed');
});
});