/*
*   SCRIPT FOR TESTING AND DEV PURPOSES.
*     
*
*/

var theIds = {
  "scriptId": "1OyjlytEo2uEorwa12PyFanPBm549L9Koe2Fl5Mwkg-p-5V4k7k-KgDsc",
  "sheetId": SHEET_ID,
  "folderId": FOLDER_ID,
  "templateId": DOC_ID
}




function setInitIds() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var propsObj = scriptProperties.getProperties();
  propsObj.sheetId = theIds.sheetId;
  propsObj.folderId = theIds.folderId;
  propsObj.templateId = theIds.templateId;
  propsObj.scriptId = theIds.scriptId;
  console.log(propsObj);
  PropertiesService.setScriptProperties(propsObj);
  //var response = setIds(theIds);
  console.log(response);
}
