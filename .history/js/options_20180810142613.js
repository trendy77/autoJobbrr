 let page = document.getElementById('ids');
let tId = ""; 
let fId = ""; 
let sId = "";
let ids = [sId, tId,fId];


 function constructOptions(ids) {
    let divv = document.createElement('div');
     for (let item of ids) {
         let butt = document.createElement('input');
         let vaar = loadSaved(item);
         butt.setAttributeNode('type', 'text');
         butt.setAttributeNode('placeholder', vaar);
         let button = document.createElement('button');
         button.addEventListener('click', function (response) {
             let newVal = response.value;
             chrome.storage.sync.set({ item: newVal }, function() {
                 console.log(item +' is ' + newVal);
             })
         });
         divv.appendChild(button);
         divv.appendChild(butt);
         page.appendChild(divv);
     }
 }

 constructOptions(ids);