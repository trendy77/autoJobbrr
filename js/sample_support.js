'use strict';
<<<<<<< HEAD

/*
* From: 
* Identity example in Chrome Apps Samples 
* https://github.com/GoogleChrome/chrome-app-samples/tree/master/samples/identity 
* https://github.com/GoogleChrome/chrome-app-samples/blob/master/LICENSE
*/

(function(context){

  function Logger(log_area) {
    this.setLogArea(log_area);
  }

  Logger.prototype.setLogArea = function(log_area) {
    this.log_area = log_area;
  }

  Logger.prototype.log = function(message, currentWindow, currentAppWindowId) {

    currentWindow.console.log(message);

=======
(function(context){
  function Logger(log_area) {
    this.setLogArea(log_area);
  }
  Logger.prototype.setLogArea = function(log_area) {
    this.log_area = log_area;
  }
  Logger.prototype.log = function(message, currentWindow, currentAppWindowId) {
    currentWindow.console.log(message);
>>>>>>> master
    if (this.log_area) {
      // convert the message to string, if necessary
      var messageStr = message;
      if (typeof(message) != 'string') {
        messageStr = JSON.stringify(message);
      }
<<<<<<< HEAD

      // log to the textarea HTML element
      this.log_area.innerText += messageStr;

=======
      // log to the textarea HTML element
      this.log_area.innerText += messageStr;
>>>>>>> master
      // if this is not the window with the log area, log to its console too
      if (this.log_area.ownerDocument &&
          this.log_area.ownerDocument.defaultView &&
          this.log_area.ownerDocument.defaultView != currentWindow) {
        this.log_area.ownerDocument.defaultView.console.log(
          "[WIN:"+currentAppWindowId+"]",message);
      }
<<<<<<< HEAD

    }
  };


  function SampleSupport() {

  }

  SampleSupport.prototype.log = function(message) {
    this.logger.log(message, window);
  };

  SampleSupport.SNIPPET_WIN_ID = 'show_snippets';
  SampleSupport.OPEN_SNIPPETS_ANCHOR_ID = '_open_snippets';
  SampleSupport.LOG_AREA_ID = '__sample_support_logarea';

  SampleSupport.prototype.addListeners = function() {
    var open_snippets = document.getElementById(
      SampleSupport.OPEN_SNIPPETS_ANCHOR_ID);

=======
    }
  };
  function SampleSupport() {
  }
  SampleSupport.prototype.log = function(message) {
    this.logger.log(message, window);
  };
  SampleSupport.SNIPPET_WIN_ID = 'show_snippets';
  SampleSupport.OPEN_SNIPPETS_ANCHOR_ID = '_open_snippets';
  SampleSupport.LOG_AREA_ID = '__sample_support_logarea';
  SampleSupport.prototype.addListeners = function() {
    var open_snippets = document.getElementById(
      SampleSupport.OPEN_SNIPPETS_ANCHOR_ID);
>>>>>>> master
    if (open_snippets) {
      open_snippets.addEventListener('click', function(e) {
        e.preventDefault();
        chrome.app.window.create('sample_support/show_snippets.html',
          { "id": SampleSupport.SNIPPET_WIN_ID,
            "innerBounds": {
              "width": 760,
              "height": 760
            }
          });
      });
    }
  };
<<<<<<< HEAD

=======
>>>>>>> master
  SampleSupport.prototype.initializeLogger = function() {
    var log_area = document.getElementById(SampleSupport.LOG_AREA_ID);
    // get Logger reference from background page, so
    // all other windows can access it
    chrome.runtime.getBackgroundPage( function(bgpage) {
      this.logger = bgpage.sample_logger;
<<<<<<< HEAD

=======
>>>>>>> master
      // replace existing log area if new log_area is valid
      if (this.logger && log_area) {
        this.logger.setLogArea(log_area);
      }
      // create a new logger
      if (!this.logger) {
        this.logger = new Logger(log_area);
        bgpage.sample_logger = this.logger;
      }
<<<<<<< HEAD

    }.bind(this));
  };
=======
    }.bind(this));
}
>>>>>>> master
  SampleSupport.prototype.init = function(e) {
    this.initializeLogger();
    this.addListeners();
  };
  context.SampleSupport = SampleSupport;
})(window);
window.sampleSupport = new SampleSupport();
window.addEventListener('DOMContentLoaded',
<<<<<<< HEAD
window.sampleSupport.init.bind(window.sampleSupport));
=======
  window.sampleSupport.init.bind(window.sampleSupport));
>>>>>>> master
