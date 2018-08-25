

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
