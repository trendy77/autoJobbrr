// Use of this source code is governed by a BSD-style license that can be found in the LICENSE file.

function initUI() {
  var bgPage = chrome.extension.getBackgroundPage();
  var counter = 1;
  var page = document.body.innerHTML;
  var which = page.getElementById('whichstep');
  which.innerText = theFields[(counter-1)].title;
      if (!bgPage.oauth.hasToken()) {
        $('#revoke').get(0).disabled = true;
      }else{
          $('#revoke').get(0).disabled = false;
      }
     for(var w=0;w<=5;w++){
      if (localStorage.w !="") {
       var jq= "#"+w+"a"
        $(jq).val(localStorage.w);
      } else {
        $(jq).val(bgPage.w);
      }
    }
}
    
function addNav(name, cb) {
var a = page.createElement("li");
a.setAttribute("id",name.id);
a.setAttribute("value",name.title);
a.innerText = name.title;
a.onclick = cb;
page.appendChild(document.createElement("br"));
page.appendChild(a);
}

      $('#1').click(function(e) {
      localStorage.1 = e.selectionText;
      bgPage.1 = localStorage.1;
       });
       $('#2').click(function(e) {
      localStorage.2 = e.selectionText;
      bgPage.2 = localStorage.2;
       });
       $('#3').click(function(e) {
      localStorage.3 = e.selectionText;
      bgPage.3 = localStorage.3;
       });     
    