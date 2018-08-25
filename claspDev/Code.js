// LICENSES http://www.apache.org/licenses/LICENSE-2.0
var SHEET_ID = '1TBqN2KpOMse7_pyKDSZW1QIFii1-5VAL9Zbz2np_TUM'; // DataSheet
var FOLDER_ID = '1yOQqQ2Nwae5xvS2tuGbUNGUIRqGwqhWw';     // folder to store prepped files.
var DOC_ID = '14850XpEs5bNWo8RttAMgUdvA4LE1UK2mFEhPpI9wk18'; // Template Cover Letter

function onOpen() {
  var menu = createMenu('Options').addItem('Choose Folder', 'showPicker').addItem('Show Sheet\'s ID', 'showId').addItem('Choose Template', 'showPickerT');
  SpreadsheetApp.getUi().createMenu('Google Picker').addSubMenu(menu)
    .addToUi();
}


/*    CODE - AUTOSEEKER PROCESS:
*       extension saves jobAppFields ---> sent to sheet/script via:
*           saveLine()
*               this can then be processed using function:
*           
*/



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

function showPreview(parameters) {
  return HtmlService
    .createTemplateFromFile("preview")
    .evaluate()
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("Template Preview")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setIds(parameters) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var props = scriptProperties.getProperties();
  if (typeOf(parameters.data.theIds) !== 'undefined') {
    var newShtId = parameters.data.theIds[0];
    var newFldId = parameters.data.theIds[1];
    var newTplId = parameters.data.theIds[2];
    var newProps = { sheetId: newShtId, folderId: newFldId, templateId: newTplId };
    scriptProperties.setProperties(newProps);
    return { "status": "ok", 'theIds': newProps };
  } else {
    return { "status": "ok", 'theIds': props };
  }
}

function get(url, parameters) {
  var url = buildUrl_(url, parameters);
  return request_(url, 'GET');
}

function saveLine(parameters) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var sheetid = scriptProperties.getProperty('sheetId');
  try {
    //    var SS = SpreadsheetApp.openById(SHEET_ID);
    var SS = SpreadsheetApp.openById(sheetid);
    var sheet = SS.getSheetByName('JobList');
    if (typeOf(parameters.data.theVals) !== 'undefined') {
      var rowData = parameters.data.theVals;
    }
    else if (typeOf(parameters.data.jobAppFields) !== 'undefined') {
      var rowData = Object.entries(parameters.data.jobAppFields);
    }
    var rowObj = {};
    for (var k = 0; k < rowData.length; k++) {
      rowObj[0][k] = rowData[k];
    }
    Logger.log('inserting row:');
    Logger.log(rowObj);
    var lineNumber = sheet.getMaxRows + 1;
    sheet.getRange(lineNumber, 1, rowObj.length, rowObj[0].length).setValues(rowObj);
    return { "status": "ok", 'sheetUrl': doc.getUrl(), 'line': lineNumber };
  } catch (e) {
    Logger.log(e);
    return { "status": JSON.stringify(e) };
  }
}

function autoMateLine() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var propO = scriptProperties.getProperties();
  var ss = SpreadsheetApp.openById(propO.sheetId);
  var sheet = ss.getSheetByName('JobList');
  var lastrow = sheet.getLastRow();
  var formertest = propO.lastTest;    // recover the value from the last test (will need to get called once to initiate a valid value)
  if (formertest < lastrow) {
    var diff = (lastrow - formertest);
    for (var t = (formertest + 1); t <= lastrow; ++t) {
      doLine(sheet, t);
    }
    scriptProperties.setProperties({ 'lastTest': lastrow }, true);
  }
}

function supplyCLs(parameters) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var propO = scriptProperties.getProperties();
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('JobList');
  var CLObj = sheet.getRange(2, 11, (sheet.getMaxRows() - 1), 1).getValues();
  return { "status": "ok", 'CLs': CLObj };
}

function commandApi(parameters) {


}


function makeCL(line) {
  // var scriptProperties = PropertiesService.getScriptProperties();
  // var propO = scriptProperties.getProperty();
  var SS = SpreadsheetApp.openById(SHEET_ID);
  var sheet = SS.getSheetByName('JobList');
  var folder = DriveApp.getFolderById(FOLDER_ID);
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