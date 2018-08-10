 
let theFields = [
	{
		"title":"JobTitle",
		"domid": "tit",
		"value":"undefined"
		
	},
	{
		"title":"Company",
		"domid": "employ",
		"value":"undefined"
		
	},
	{
		"title":"Contact",
		"domid":"cont",
		"value":"undefined"
		
	},
	{
		"title":"USP1",
		"domid":"uspi",
		"value":"undefined"
		
	},
	{
		"title":"USP2",
		"domid":"uspii",
		"value":"undefined"
		
	},
	{
		"title":"7",
		"domid":"7",
		"value":"undefined"
		
	},
	{
		"title":"8",
		"domid":"8",
		"value":"undefined"
		
	},
	{
		"title":"9",
		"domid":"9",
		"value":"undefined"	
	}];
	
	let theTitles = [theFields[0].title, theFields[1].title, theFields[2].title, theFields[3].title, theFields[4].title, theFields[5].title];
	
let rule1 = {
	conditions: [
	  new chrome.declarativeContent.PageStateMatcher({
		pageUrl: { hostEquals: 'www.seek.com.au'}
		//,		css: ["input[type='password']"]
	  })
	],
	actions: [ setContext ]
  };
  
  chrome.runtime.onInstalled.addListener(function(details) {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	  chrome.declarativeContent.onPageChanged.addRules([rule1]);
	});
  });

// Create one test item for each context type.
let parent = chrome.contextMenus.create({"id":"parent","title": "jobSEEKr"});
for (let i = 0; i < theFields.length; i++) {
  let context = theFields[i].title;
  let menutitle =  context + ' :' + context.value;
	let id = chrome.contextMenus.create({"title": menutitle,  "parentId": parent, "id": menutitle,
                                       "onclick": upContext});
}


  if (chrome.extension.lastError) {
    console.log("Got expected error: " + chrome.extension.lastError.message);
  }
 
function disableField(field) {
	
	field.setAttribute('opacity', '0.6');
	field.setAttribute('font-size', '12px');
}
function enableField(field) {
	field.setAttribute('opacity', '1');
	field.setAttribute('font-size', '16px');
}
function disableButton(button) {
	button.setAttribute('disabled', 'disabled');
}
function enableButton(button) {
	button.removeAttribute('disabled');
}
function changeState(newState) {
	state = newState;
	switch (state) {
		case ST_AWAIT:
			enableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
		case ST1:
			sampleSupport.log('Acquiring token...');
			disableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
		case ST2:
			disableButton(signin_button);
			enableButton(xhr_button);
			enableButton(revoke_button);
			break;
			case ST3:
			enableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
			case ST4:
			sampleSupport.log('Acquiring token...');
			disableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
			case ST5:
			disableButton(signin_button);
			enableButton(xhr_button);
			enableButton(revoke_button);
			break;
			case ST6:
			disableButton(signin_button);
			enableButton(xhr_button);
			enableButton(revoke_button);
			break;
			case ST7:
			enableButton(signin_button);
			disableButton(xhr_button);
			disableButton(revoke_button);
			break;
			case STEND:
			sampleSupport.log('Sending Job Specs...');
			disableButton(optsButton);
			disableButton(goButton);
			disableButton(opt);
			break;
		}
}
function closeWindow() {
		window.close();
}
function setIcon(opt_badgeObj) {
	if (opt_badgeObj) {
		let badgeOpts = {};
		if (opt_badgeObj && opt_badgeObj.text != undefined) {
			badgeOpts['text'] = opt_badgeObj.text;
		}
		chrome.browserAction.setBadgeText(badgeOpts);
	}
}
function upJobForm(field) {	
	for (let i = 0; i < theFields.length; i++) {
		let theField = theFields[i];
		if (field.title == theField.title){
			theField.value = field.value;
			chrome.storage.sync.set({title:theField.value}, function (list) {
		let div = document.getElementById(theField.domid);
		editJobField(theField);
		});
	}
}
}
function editJobField(theField) {
	let div1 = document.getElementById(theField.domid);
	div1.setAttribute('value', theField.value);
		//let div2 = document.createElement('div');
	//div2.setAttribute('class', 'card blue-grey darken-1');
	let div3 = document.createElement('div');
	//div3.setAttribute('class', 'card-content white-text');
	let span = document.createElement('span');
	span.setAttribute('class', 'card-title');
	let title = document.getElementById(theField.title);
	title.innerText = theField.title;
//	span.appendChild(title);
//	div3.appendChild(span);
//	div2.appendChild(div3);
	let infield = document.getElementById(theField.domid);
infield.setAttribute('placeholder', theField.value);
	infield.setAttribute('type', 'text');
//div2.appendChild(infield);
//	div1.appendChild(div2);
}
function sendDataToExecutionAPIData() {
	disableButton(gobutton);
	gobutton.className = 'loading';
	getAuthToken({
		'interactive': false,
		'callback': sendDataToExecutionAPICallbackData,
	});
}
function sendDataToExecutionAPICallbackData(token) {
	let theVals = [theFields[0].value, theFields[1].value, theFields[5].value, theFields[7].value, theFields[8].value, theFields[9].value];
	sampleSupport.log('Sending data to Execution API script');
	post({
		'url': 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run',
		'callback': executionAPIResponseData,
		'token': token,
		'request': {
			'function': 'process1',
			'parameters': {
				'title':theVals[0],
				'company':theVals[1],
				//recruiter:theVals[2],
				'contact':theVals[2],
				'usp1':theVals[3],
				'usp2':theVals[4],
				'usp3':theVals[5]
			}
		}
	});
}
function post(options) {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			// JSON response assumed. Other APIs may have different responses.
			options.callback(JSON.parse(xhr.responseText));
		} else if (xhr.readyState === 4 && xhr.status !== 200) {
			sampleSupport.log('post', xhr.readyState, xhr.status, xhr.responseText);
		}
	};
	xhr.open('POST', options.url, true);
	xhr.setRequestHeader('Authorization', 'Bearer ' + options.token);
	xhr.send(JSON.stringify(options.request));
}
function setContext(){
	let parent = chrome.contextMenus.create({"id":"parent","title":"JobAdder"});
	for(let t=0;t<=(sizeOf(theFields));++t){
		let disOne=theFields[t];
		chrome.contextMenus.create({
			parentId: parent,
			id: disOne.title,
			title: disOne.title,
			type: 'normal',
			theTitles: ['selection']
			});
		}
	}
	function upContext(info, tab){
		chrome.contextMenus.update(info.menuItemId,{
			title: info.title+': '+info.selectionText
			});
			let inf=info.menuItemId;
		chrome.storage.sync.get(inf,function(cb){
			let infot=info.selectionText;
			if (infot != cb){
				chrome.storage.sync.set({inf:infot},function(){
					upJobForm(info);		
					chrome.tabs.create({url: "popup.html", index: tab.index + 1});
				});
			}
				});	
	}
	
chrome.runtime.onStartup.addListener(function (e,n){	
	setIcon();	
});


chrome.contextMenus.onClicked.addListener(function(item, tab) {
	let text =item.selectionText;
	let id =e.menuItemId;
	chrome.contextMenus.update(id,{"title": id +": "+text },upContext);
	chrome.storage.sync.set({id:text},function(){
		chrome.tabs.create({url: "popup.html", index: tab.index + 1});
	});
});

