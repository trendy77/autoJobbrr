// LICENSES http://www.apache.org/licenses/LICENSE-2.0
var SHEET_ID = '1TBqN2KpOMse7_pyKDSZW1QIFii1-5VAL9Zbz2np_TUM'; // DataSheet
var FOLDER_ID = '1yOQqQ2Nwae5xvS2tuGbUNGUIRqGwqhWw';   // folder to store prepped files.
var DOC_ID = '14850XpEs5bNWo8RttAMgUdvA4LE1UK2mFEhPpI9wk18'; // Template Cover Letter

function makeBody(body,row){
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
function prepEmail(CL,jt) {
  var message = "To Whom It May Concern,\r\rPlease see attached my application (CV and cover letter) for the " + jt + " position currently being advertised.\r\rI hope to hear from you in the near future. \r\rRegards, \r \rTrent. \r0405776689\r";
  var emailTo = "tfisher811@gmail.com";
  var CV_ID = "1ggWM0hi8vyxHJsyWMCnuYH7gjgmLtr0E";
  var subject = "Application: " + jt;
  var cldoc = DriveApp.getFileById(CL.getId()).getAs('application/vnd.openxmlformats-officedocument.wordprocessingml.document').getBytes();
  var cvdoc = DriveApp.getFileById(CV_ID).getAs('application/vnd.openxmlformats-officedocument.wordprocessingml.document').getBytes();
  var attach = {
    fileName: 'TFischer Cover Letter.docx',
    content: cldoc,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  var cvAttach = {
    fileName: 'Trent Fischer Resume.docx',
    content: cvdoc,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  var analyticsID = "UA-84079763-14";
  var trackingG = getTrackingGIF(analyticsID, emailTo, subject);
  MailApp.sendEmail({
    to: emailTo,
    subject: subject,
    htmlBody: "tracking is here...<img src='cid:tGif'>" +
              message,
    inlineImages:
      {
         tGif: trackingG
      },
    attachments: [attach, cvAttach]
  });
  return;
}


function get(url, parameters) {
  var url = buildUrl_(url, parameters);
  return request_(url, 'GET');
}
/* Written by Amit Agarwal */
function getTrackingGIF(account, email, subject) {
  var imgURL = "https://ssl.google-analytics.com/collect?"
    + "v=1&t=event"
    + "&tid=" + account
    + "&z="   + Math.round((new Date()).getTime()/1000).toString()
    + "&cid=" + Utilities.getUuid()
    + "&ec=" + encodeURIComponent("Email Open")
    + "&ea=" + encodeURIComponent(subject.replace(/'/g, ""))
    + "&el=" + encodeURIComponent(email);
  return "<img src='" + imgURL + "' width='1' height='1'/>";
}

/**
* Change the default sheet,Folder and template Cover Letter.
* @param {Object} parameters passed from script.
* @return {Object} result.
*/
function setIds(parameters) {
var scriptProperties = PropertiesService.getScriptProperties();
try {
var shid =scriptProperties.getProperty('sheetId');
var flid =scriptProperties.getProperty('folderId');
var tpid =scriptProperties.getProperty('templateId');
}catch(e){
  scriptProperties.setProperties({'sheetId':SHEET_ID,'templateId':DOC_ID,'folderId':FOLDER_ID});
}
if (parameters.sheetId){
  if (parameters.sheetId != shid){
    scriptProperties.setProperty('sheetId',parameters.sheetId);
  }
}
if (parameters.templateId){
  if (parameters.templateId != tpid){
    scriptProperties.setProperty('templateId',parameters.templateId);
  }
}
if (parameters.folderId){
  if (parameters.folderId != flid){
    scriptProperties.setProperty('folderId',parameters.folderId);
  }
}
return ([{"status":"ok"}, {'template':tpid.getUrl()},{'sheet':shid.getUrl()},{'folder':flid.getUrl()}]);
}

function options(parameters){
  if( parameters.sheetId ||  parameters.templateId || parameters.folderId){
    setIds(parameters);
  } else {
  var scriptProperties = PropertiesService.getScriptProperties();
  return {"status":"ok", "ids":scriptProperties};
  }
}

function process1(parameters){
  try {
   var scriptProperties = PropertiesService.getScriptProperties();
  var shid =scriptProperties.getProperty('sheetId');
  var flid =scriptProperties.getProperty('folderId');
  var tpid =scriptProperties.getProperty('templateId');
  var ss = SpreadsheetApp.openById(shid);
  var folder = DriveApp.getFolderById(flid);
  var sheet = ss.getSheetByName('JobList');
  sheet.getRange((sheet.getMaxRows+1), 1, 1, parameters[0].length).setValues(parameters);
  var docid = DriveApp.getFileById(tlid).makeCopy("Cover Letter - "+values[i][1], folder).getId();
  var doc = DocumentApp.openById(docid);
  var body = doc.getActiveSection();
  var sectText = makeBody(body,row);
  doc.saveAndClose();
  Logger.log("ONE LETTER COMPLETED");
  var clblob = DriveApp.getFileById(doc.getId()).getAs('application/pdf');
  var docF = folder.createFile(clblob.getName(), clblob.getBytes(), 'MimeType.text/plain');
  docF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var link = "http://drive.google.com/uc?export=view&id=" + docF.getId();
  return {"status":"ok", 'coverletter':link};
  }
catch(e){
    Logger.log(e);
    return {"status": JSON.stringify(e)};
  }
}
