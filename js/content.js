 
  var aBut= document.createElement('a');
  var att = document.createAttribute("class");       // Create a "class" attribute
  att.value = "waves-effect waves-dark btn-large pulse";                           // Set the value of the class attribute
  aBut.setAttributeNode(att);
  var att2 = document.createAttribute("id");       // Create a "class" attribute
  att2.value = "seekButton";                           // Set the value of the class attribute
  aBut.setAttributeNode(att2);
  
  var goButt = document.createElement('i');
  var att2 = document.createAttribute("class");       // Create a "class" attribute
  att2.value = "material-icons right";                          
  goButt.setAttributeNode(att2);  
  goButt.addEventListener('click', sendVals.bind(goButt,true));
  aBut.appendChild(goButt);
 //  var t = document.createTextNode();
  document.body.appendChild(aBut);     //Appending to DOM 
  
  document.addEventListener('DOMContentLoaded', function() {

});

$("document").ready(function(){
  $(".button-collapse").sideNav();
  });
  
  
  
  /// intra-extension messaging e.g.
  // content-script.js

var myPort = browser.runtime.connect({name:"port-contentjs"});
myPort.postMessage({greeting: "status"});


myPort.onMessage.addListener(function(m) {
 var keys = Object.keys(m);
 for (var r in keys){
   
   
 }
  console.log(m.greeting);
});

document.body.addEventListener("click", function() {
  //var key = 
  myPort.postMessage({greeting: "they clicked the button!"});
  alert('button pressed');
});