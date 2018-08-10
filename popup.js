function loadSaved(key) {
    let jt = document.getElementById(key);
    chrome.storage.sync.get(key, function (data) {
        let val = data.value;
        jt.setAttribute('value', val);
    });
    let but = addButton();
}

  