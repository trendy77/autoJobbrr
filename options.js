 let page = document.getElementById('ids');
let tId = ""; 
let fId = ""; 
let sId = "";
let ids = [sId, tId,fId];


 function constructOptions(ids) {
     for (let item of ids) {
         let butt = document.createElement('input');
         let var = loadSaved(item);
         butt.setAttributeNode('type', 'text');
         butt.setAttributeNode('placeholder', var);
         let button = document.createElement('button');
         button.addEventListener('click', function () {
             let newVal = butt.getAttributeNode('value');
             chrome.storage.sync.set({ item: newVal }, function() {
                 console.log(item +' is ' + newVal);
             })
         });
         butt.appendChild(button);
         page.appendChild(butt);
     }
 }

 constructOptions(ids);