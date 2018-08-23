//  LICENSES http://www.apache.org/licenses/LICENSE-2.0

var SHEET_ID = '1TBqN2KpOMse7_pyKDSZW1QIFii1-5VAL9Zbz2np_TUM'; // DataSheet
var FOLDER_ID = '1yOQqQ2Nwae5xvS2tuGbUNGUIRqGwqhWw'; // folder to store prepped files.
var DOC_ID = '14850XpEs5bNWo8RttAMgUdvA4LE1UK2mFEhPpI9wk18'; // Template Cover Letter
//    https://script.google.com/macros/s/AKfycbxB5hPATZclDz6hwe-HKi5o-g9bXtnug6x9nNT5zyBlyeY0pB0/exec

function makeBody(body, row) {
	///row[0] is the URL....
	body.replaceText("%JOBTITLE%", row[1]);
	body.replaceText("%COMPANY%", row[2]);
	body.replaceText("%COMPANY_REC%", row[3]);
	body.replaceText("%NAME_FIRST%", row[4]);
	//body.replaceText("%NAME_LAST%", row[5]);
	body.replaceText("%NAME%", row[6]);
	/// row[7] is contact (email or phone#)...
	body.replaceText("%USP1%", row[8]);
	body.replaceText("%USP2%", row[9]);
	body.replaceText("%USP3%", row[10]);
	var date = Utilities.formatDate(new Date(), "GMT+10", "dd/MM/yyyy");
	body.replaceText("%DATE%", date);
	return body;
}
/**
 * Change the default sheet,Folder and template Cover Letter.
 * @param {Object} parameters passed from script.
 * @return {Object} result.
 */
function setIds(parameters) {
	var newsid = parameters.sheetId;
	var nfldid = parameters.folderId;
	var ntpid = parameters.templateId;
	var scriptProperties = PropertiesService.getScriptProperties();
	var propsObj = scriptProperties.getProperties();
	if(typeof newsid !== 'undefined') {
		if(newsid !== propsObj.sheetId) {
			var shtid = scriptProperties.setProperty('sheetId', newsid);
		}
	}
	if(typeof nfldid !== 'undefined') {
		if(nfldid !== propsObj.sheetId) {
			var flid = scriptProperties.setProperty('folderId', nfldid);
		}
	}
	if(typeof ntpid !== 'undefined') {
		if(ntpid !== propsObj.templateId) {
			scriptProperties.setProperty('templateId', ntpid);
		}
	}
	return {
		"status": "ok",
		'sheet': ss.getUrl()
	};
}



function get(url, parameters) {
	var durl = buildUrl_(url, parameters);
	return request_(durl, 'GET');
}


function process1(parameters) {
	try {
		// next set where we write the data - you could write to multiple/alternate destinations
		var SS = SpreadsheetApp.openById(SHEET_ID);
		var sheet = SS.getSheetByName('JobList');
		var data = parameters.data;
		sheet.getRange((sheet.getMaxRows + 1), 1, data.length, data[0].length).setValues(data);
		return {
			"status": "ok",
			'sheet': doc.getUrl()
		};
	} catch(e) {
		// if error return this
		Logger.log(e);
		return {
			"status": JSON.stringify(e)
		};
	}
}

function onEdit(e) {
	var scriptProperties = PropertiesService.getScriptProperties();
	var propO = scriptProperties.getProperties();
	var ss = SpreadsheetApp.openById(propO.sheetId);
	var sheet = ss.getSheetByName('JobList');
	var lastrow = sheet.getLastRow();
	var formertest = propO.lastTest; // recover the value from the last test (will need to get called once to initiate a valid value)
	if(formertest < lastrow) {
		var diff = (lastrow - formertest);
		for(var t = (formertest + 1); t <= lastrow; ++t) {
			doLine(sheet, t);
		}
		scriptProperties.setProperties({
			'lastTest': lastrow
		}, true);
	}
}

function supplyCLs(parameters) {
	var scriptProperties = PropertiesService.getScriptProperties();
	var propO = scriptProperties.getProperties();
	var ss = SpreadsheetApp.openById(propO.sheetId);
	var sheet = ss.getSheetByName('JobList');
	var CLArray = sheet.getRange(2, 11, (sheet.getMaxRows() - 1), 1).getValues();
	return {
		"status": "ok",
		'CLs': CLArray
	};
}

function doLine(sheet, line) {
	var scriptProperties = PropertiesService.getScriptProperties();
	var propO = scriptProperties.getProperties();
	var folder = DriveApp.getFolderById(propO.folderId);
	var values = sheet.getRange(line, 1, 1, 11).getValues();
	var docid = DriveApp.getFileById(TEMPLATE_ID).makeCopy("Cover Letter - " + values[1], folder).getId();
	var doc = DocumentApp.openById(docid);
	var body = doc.getActiveSection();
	var sectText = makeBody(body, row);
	doc.saveAndClose();
	Logger.log("ONE LETTER COMPLETED");
	var clblob = DriveApp.getFileById(doc.getId()).getAs('application/pdf');
	var docF = folder.createFile(clblob.getName(), clblob.getBytes(), 'MimeType.text/plain');
	docF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
	var link = "http://drive.google.com/uc?export=view&id=" + docF.getId();
	sheet.getRange(line, 12).setValue(link);
}
