
document.body.innerHTML="";


addButton("Choose Resume", function() {
chrome.runtime.onclick("popPicker('docPicker.html')", function(response) {});
});
addButton("Choose Sheet", function() {
chrome.runtime.onclick("popPicker('docPicker.html')", function(response) { });
});
addButton("Choose Cover Letter Template", "popPicker");

var page = document.getElementById("options");
    for (var t=0;t<3;++t){
        addSect(ids[t], function(resp){
            resp.addEventListener('change', function() {
            storageSet(ids[t],res.getText().toString());  
            });
        });  
    }
document.body.appendChild(page);