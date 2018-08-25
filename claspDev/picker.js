// picker.gs

/// picker see -https://ctrlq.org/code/20039-google-picker-with-apps-script
// See: https://developers.google.com/picker/
// https://script.google.com/macros/s/AKfycbxB5hPATZclDz6hwe-HKi5o-g9bXtnug6x9nNT5zyBlyeY0pB0/exec


/**
 * Displays an HTML-service dialog in Google Sheets that contains client-side
 * JavaScript code for the Google Picker API.
 */
function showFolderPicker() {
  var html = HtmlService.createHtmlOutputFromFile('fldPicker.html')
    .setWidth(600)
    .setHeight(425)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, 'Select Folder');
}

function showTemplatePicker() {
  var html = HtmlService.createHtmlOutputFromFile('tplPicker.html')
    .setWidth(600)
    .setHeight(425)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, 'Select Template');
}

function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}


// for template/file upload
// Server.gs
function pickerAPI(which) {    // formerly 'doGet'
  choosePicker(which);
  return HtmlService
    .createTemplateFromFile("docPicker")
    .evaluate()
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("Folder Picker")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(fileName) {
  return HtmlService
    .createHtmlOutputFromFile(fileName)
    .getContent();
}

function choosePicker(picker) {
  if (picker == "doc") {
    return initDocPicker();
  }
  if (picker == "sht") {
    return initShtPicker();
  }
  if (picker == "fld") {
    return initFldPicker();
  }
}


function initShtPicker() {
  return {
    locale: 'en',
    token: ScriptApp.getOAuthToken(),
    origin: "https://docs.google.com",
    parentFolder: "root",
    developerKey: "ctrlq.org",
    dialogDimensions: {
      width: 600,
      height: 425
    },
    picker: {
      viewMode: "LIST",
      mineOnly: true,
      mimeTypes: "application/vnd.google-apps.spreadsheet",
      multiselectEnabled: false,
      allowFolderSelect: false,
      navhidden: false,
      hideTitle: true,
      includeFolders: true,
    }
  };
}


function initDocPicker() {
  return {
    locale: 'en',
    token: ScriptApp.getOAuthToken(),
    origin: "https://docs.google.com",
    parentFolder: "root",
    developerKey: "ctrlq.org",
    dialogDimensions: {
      width: 600,
      height: 425
    },
    picker: {
      viewMode: "LIST",
      mineOnly: true,
      mimeTypes: "application/vnd.google-apps.doc",
      multiselectEnabled: false,
      allowFolderSelect: false,
      navhidden: true,
      hideTitle: true,
      includeFolders: true,
    }
  };
}


function initFldPicker() {
  return {
    locale: 'en',
    token: ScriptApp.getOAuthToken(),
    origin: "https://docs.google.com",
    parentFolder: "root",
    developerKey: "ctrlq.org",
    dialogDimensions: {
      width: 600,
      height: 425
    },
    picker: {
      viewMode: "LIST",
      mineOnly: true,
      mimeTypes: "application/vnd.google-apps.folder",
      multiselectEnabled: false,
      allowFolderSelect: true,
      navhidden: true,
      hideTitle: true,
      includeFolders: true,
    }
  };
}
// For Scope
// DriveApp.getStorageUsed()
// DriveApp.getFilesByName("ctrlq.org")
//https://www.googleapis.com/auth/documents
//https://www.googleapis.com/auth/drive
//https://www.googleapis.com/auth/script.container.ui
//https://www.googleapis.com/auth/script.scriptapp
//https://www.googleapis.com/auth/script.send_mail
//https://www.googleapis.com/auth/spreadsheets