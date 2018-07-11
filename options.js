 let page = document.getElementById('buttonDiv');
 const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
 const ids = ['', '', ''];
 // const templateId = "";const sheetId = "";const folderId = "";

 function constructOptions(kButtonColors) {
     for (let item of kButtonColors) {
         let button = document.createElement('button');
         button.style.backgroundColor = item;
         button.addEventListener('click', function() {
             chrome.storage.sync.set({ color: item }, function() {
                 console.log('color is ' + item);
             })
         });
         page.appendChild(button);
     }
 }

 function constructJobSheet(ids) {
     let textIn = document.createElement('input')
     for (let item of ids) {
         let button = document.createElement('button')
         button.addEventListener('click', function() {
             chrome.storage.sync.set({
                 item: textIn
             }, function() {
                 console.log('tempId is ' + ids[0]);
                 console.log('shtId is ' + ids[1]);
                 console.log('fldId is ' + ids[2]);
             })
         });
         page.appendChild(button);
     }
 }

 constructOptions(kButtonColors);