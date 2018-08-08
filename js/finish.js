// new content.js

function addSect(questionObj) {
 
  var titlebar = document.createElement("div");
  titlebar.setAttribute("class", "container");
  titlebar.setAttribute("id", questionObj.domid);
  var row = document.createElement("div");
  row.setAttribute("class", "row");
  titlebar.appendChild(row);
  var col = document.createElement("div");
  col.setAttribute("class", "col s12");
  row.appendChild(col);
  var tit = document.createElement("h6");
  tit.innerText = questionObj.title;
  col.appendChild(tit);
  var inpu = document.createElement("input");
  inpu.setAttribute("type","text");
  inpu.innerText = chrome.storage.sync.get(questionObj.value,function(e){
    tit.appendChild(inpu);    
  });
  var divider = document.createElement("div");
  titlebar.appendChild(divider);
  document.body.appendChild(titlebar);
}

function moveFwd(obj){
  var titleE = document.getElementById(obj.id);
  var val = obj.value;
  titleE.setAttribute('value', info);
  titleE.style.opacity="0.5";
  titleE.style.color="black";
  var employE = document.getElementById(next).style.display = 'block';
  return;
}

for (var t=1;t<=theFields.length;++t){
  addSect(theFields[t]);
 }
