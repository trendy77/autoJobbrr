// Protected namespaces.
var util = {};
var gdocs = {};

var bgPage = chrome.extension.getBackgroundPage();
var pollIntervalMax = 1000 * 60 * 60;  // 1 hour
var requestFailureCount = 0;  // used for exponential backoff
var requestTimeout = 1000 * 2;  // 5 seconds

var DEFAULT_MIMETYPES = {
  'atom': 'application/atom+xml',
  'document': 'text/plain',
  'spreadsheet': 'text/csv',
  'presentation': 'text/plain',
  'pdf': 'application/pdf'
};

// Persistent click handler for star icons.
$('#doc_type').change(function() {
  if ($(this).val() === 'presentation') {
    $('#doc_content').attr('disabled', 'true')
                     .attr('placeholder', 'N/A for presentations');
  } else {
    $('#doc_content').removeAttr('disabled')
                     .attr('placeholder', 'Enter document content');
  }
});

// Persistent click handler for changing the title of a document.
$('[contenteditable="true"]').live('blur', function(index) {
  var index = $(this).parent().parent().attr('data-index');
  // Only make the XHR if the user chose a new title.
  if ($(this).text() != bgPage.docs[index].title) {
    bgPage.docs[index].title = $(this).text();
    gdocs.updateDoc(bgPage.docs[index]);
  }
});
// Persistent click handler for star icons.
$('.star').live('click', function() {
  $(this).toggleClass('selected');

  var index = $(this).parent().attr('data-index');
  bgPage.docs[index].starred = $(this).hasClass('selected');
  gdocs.updateDoc(bgPage.docs[index]);
});

/**
 * Class to compartmentalize properties of a Google document.
 * @param {Object} entry A JSON representation of a DocList atom entry.
 * @constructor
 */
gdocs.GoogleDoc = function(entry) {
  this.entry = entry;
  this.title = entry.title.$t;
  this.resourceId = entry.gd$resourceId.$t;
  this.type = gdocs.getCategory(
    entry.category, 'http://schemas.google.com/g/2005#kind');
  this.starred = gdocs.getCategory(
    entry.category, 'http://schemas.google.com/g/2005/labels',
    'http://schemas.google.com/g/2005/labels#starred') ? true : false;
  this.link = {
    'alternate': gdocs.getLink(entry.link, 'alternate').href
  };
  this.contentSrc = entry.content.src;
};

/**
 * Sets up a future poll for the user's document list.
 */
util.scheduleRequest = function() {
  var exponent = Math.pow(2, requestFailureCount);
  var delay = Math.min(bgPage.pollIntervalMin * exponent,
                       pollIntervalMax);
  delay = Math.round(delay);

  if (bgPage.oauth.hasToken()) {
    var req = bgPage.window.setTimeout(function() {
      gdocs.getDocumentList();
      util.scheduleRequest();
    }, delay);
    bgPage.requests.push(req);
  }
};

/**
 * Urlencodes a JSON object of key/value query parameters.
 * @param {Object} parameters Key value pairs representing URL parameters.
 * @return {string} query parameters concatenated together.
 */
util.stringify = function(parameters) {
  var params = [];
  for(var p in parameters) {
    params.push(encodeURIComponent(p) + '=' +
                encodeURIComponent(parameters[p]));
  }
  return params.join('&');
};

/**
 * Creates a JSON object of key/value pairs
 * @param {string} paramStr A string of Url query parmeters.
 *    For example: max-results=5&startindex=2&showfolders=true
 * @return {Object} The query parameters as key/value pairs.
 */
util.unstringify = function(paramStr) {
  var parts = paramStr.split('&');

  var params = {};
  for (var i = 0, pair; pair = parts[i]; ++i) {
    var param = pair.split('=');
    params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
  }
  return params;
};

/**
 * Utility for displaying a message to the user.
 * @param {string} msg The message.
 */
util.displayMsg = function(msg) {
  $('#butter').removeClass('error').text(msg).show();
};

/**
 * Utility for removing any messages currently showing to the user.
 */
util.hideMsg = function() {
  $('#butter').fadeOut(1500);
};

/**
 * Utility for displaying an error to the user.
 * @param {string} msg The message.
 */
util.displayError = function(msg) {
  util.displayMsg(msg);
  $('#butter').addClass('error');
};

/**
 * Returns the correct atom link corresponding to the 'rel' value passed in.
 * @param {Array<Object>} links A list of atom link objects.
 * @param {string} rel The rel value of the link to return. For example: 'next'.
 * @return {string|null} The appropriate link for the 'rel' passed in, or null
 *     if one is not found.
 */
gdocs.getLink = function(links, rel) {
  for (var i = 0, link; link = links[i]; ++i) {
    if (link.rel === rel) {
      return link;
    }
  }
  return null;
};

/**
 * Returns the correct atom category corresponding to the scheme/term passed in.
 * @param {Array<Object>} categories A list of atom category objects.
 * @param {string} scheme The category's scheme to look up.
 * @param {opt_term?} An optional term value for the category to look up.
 * @return {string|null} The appropriate category, or null if one is not found.
 */
gdocs.getCategory = function(categories, scheme, opt_term) {
  for (var i = 0, cat; cat = categories[i]; ++i) {
    if (opt_term) {
      if (cat.scheme === scheme && opt_term === cat.term) {
        return cat;
      }
    } else if (cat.scheme === scheme) {
      return cat;
    }
  }
  return null;
};

/**
 * A generic error handler for failed XHR requests.
 * @param {XMLHttpRequest} xhr The xhr request that failed.
 * @param {string} textStatus The server's returned status.
 */
gdocs.handleError = function(xhr, textStatus) {
  util.displayError('Failed to fetch docs. Please try again.');
  ++requestFailureCount;
};

/**
 * A helper for constructing the raw Atom xml send in the body of an HTTP post.
 * @param {XMLHttpRequest} xhr The xhr request that failed.
 * @param {string} docTitle A title for the document.
 * @param {string} docType The type of document to create.
 *     (eg. 'document', 'spreadsheet', etc.)
 * @param {boolean?} opt_starred Whether the document should be starred.
 * @return {string} The Atom xml as a string.
 */
gdocs.constructAtomXml_ = function(docTitle, docType, opt_starred) {
  var starred = opt_starred || null;

  var starCat = ['<category scheme="http://schemas.google.com/g/2005/labels" ',
                 'term="http://schemas.google.com/g/2005/labels#starred" ',
                 'label="starred"/>'].join('');

  var atom = ["<?xml version='1.0' encoding='UTF-8'?>",
              '<entry xmlns="http://www.w3.org/2005/Atom">',
              '<category scheme="http://schemas.google.com/g/2005#kind"',
              ' term="http://schemas.google.com/docs/2007#', docType, '"/>',
              starred ? starCat : '',
              '<title>', docTitle, '</title>',
              '</entry>'].join('');
  return atom;
};

/**
 * A helper for constructing the body of a mime-mutlipart HTTP request.
 * @param {string} title A title for the new document.
 * @param {string} docType The type of document to create.
 *     (eg. 'document', 'spreadsheet', etc.)
 * @param {string} body The body of the HTTP request.
 * @param {string} contentType The Content-Type of the (non-Atom) portion of the
 *     http body.
 * @param {boolean?} opt_starred Whether the document should be starred.
 * @return {string} The Atom xml as a string.
 */
gdocs.constructContentBody_ = function(title, docType, body, contentType,
                                       opt_starred) {
  var body = ['--END_OF_PART\r\n',
              'Content-Type: application/atom+xml;\r\n\r\n',
              gdocs.constructAtomXml_(title, docType, opt_starred), '\r\n',
              '--END_OF_PART\r\n',
              'Content-Type: ', contentType, '\r\n\r\n',
              body, '\r\n',
              '--END_OF_PART--\r\n'].join('');
  return body;
};

/**
 * Creates a new document in Google Docs.
 */
gdocs.createDoc = function() {
  var title = $.trim($('#doc_title').val());
  if (!title) {
    alert('Please provide a title');
    return;
  }
  var content = $('#doc_content').val();
  var starred = $('#doc_starred').is(':checked');
  var docType = $('#doc_type').val();

  util.displayMsg('Creating doc...');

  var handleSuccess = function(resp, xhr) {
    bgPage.docs.splice(0, 0, new gdocs.GoogleDoc(JSON.parse(resp).entry));

    gdocs.renderDocList();
    bgPage.setIcon({'text': bgPage.docs.length.toString()});

    $('#new_doc_container').hide();
    $('#doc_title').val('');
    $('#doc_content').val('');
    util.displayMsg('Document created!');
    util.hideMsg();

    requestFailureCount = 0;
  };

  var params = {
    'method': 'POST',
    'headers': {
      'GData-Version': '3.0',
      'Content-Type': 'multipart/related; boundary=END_OF_PART',
    },
    'parameters': {'alt': 'json'},
    'body': gdocs.constructContentBody_(title, docType, content,
                                        DEFAULT_MIMETYPES[docType], starred)
  };

  // Presentation can only be created from binary content. Instead, create a
  // blank presentation.
  if (docType === 'presentation') {
    params['headers']['Content-Type'] = DEFAULT_MIMETYPES['atom'];
    params['body'] = gdocs.constructAtomXml_(title, docType, starred);
  }

  bgPage.oauth.sendSignedRequest(bgPage.DOCLIST_FEED, handleSuccess, params);
};

/**
 * Updates a document's metadata (title, starred, etc.).
 * @param {gdocs.GoogleDoc} googleDocObj An object containing the document to
 *     update.
 */
gdocs.updateDoc = function(googleDocObj) {
  var handleSuccess = function(resp) {
    util.displayMsg('Updated!');
    util.hideMsg();
    requestFailureCount = 0;
  };

  var params = {
    'method': 'PUT',
    'headers': {
      'GData-Version': '3.0',
      'Content-Type': 'application/atom+xml',
      'If-Match': '*'
    },
    'body': gdocs.constructAtomXml_(googleDocObj.title, googleDocObj.type,
                                    googleDocObj.starred)
  };

  var url = bgPage.DOCLIST_FEED + googleDocObj.resourceId;
  bgPage.oauth.sendSignedRequest(url, handleSuccess, params);
};

/**
 * Deletes a document from the user's document list.
 * @param {integer} index An index intro the background page's docs array.
 */
gdocs.deleteDoc = function(index) {
  var handleSuccess = function(resp, xhr) {
    util.displayMsg('Document trashed!');
    util.hideMsg();
    requestFailureCount = 0;
    bgPage.docs.splice(index, 1);
    bgPage.setIcon({'text': bgPage.docs.length.toString()});
  }

  var params = {
    'method': 'DELETE',
    'headers': {
      'GData-Version': '3.0',
      'If-Match': '*'
    }
  };

  $('#output li').eq(index).fadeOut('slow');

  bgPage.oauth.sendSignedRequest(
      bgPage.DOCLIST_FEED + bgPage.docs[index].resourceId,
      handleSuccess, params);
};

/**
 * Callback for processing the JSON feed returned by the DocList API.
 * @param {string} response The server's response.
 * @param {XMLHttpRequest} xhr The xhr request that was made.
 */
gdocs.processDocListResults = function(response, xhr) {
  if (xhr.status != 200) {
    gdocs.handleError(xhr, response);
    return;
  } else {
    requestFailureCount = 0;
  }

  var data = JSON.parse(response);

  for (var i = 0, entry; entry = data.feed.entry[i]; ++i) {
    bgPage.docs.push(new gdocs.GoogleDoc(entry));
  }

  var nextLink = gdocs.getLink(data.feed.link, 'next');
  if (nextLink) {
    gdocs.getDocumentList(nextLink.href); // Fetch next page of results.
  } else {
    gdocs.renderDocList();
  }
};

/**
 * Presents the in-memory documents that were fetched from the server as HTML.
 */
gdocs.renderDocList = function() {
  util.hideMsg();

  // Construct the iframe's HTML.
  var html = [];
  for (var i = 0, doc; doc = bgPage.docs[i]; ++i) {
    // If we have an arbitrary file, use generic file icon.
    var type = doc.type.label;
    if (doc.type.term == 'http://schemas.google.com/docs/2007#file') {
      type = 'file';
    }

    var starred = doc.starred ? ' selected' : '';
    html.push(
      '<li data-index="', i , '"><div class="star', starred, '"></div>',
      '<div><img src="img/icons/', type, '.gif">',
      '<span contenteditable="true" class="doc_title"></span></div>',
      '<span>[<a href="', doc.link['alternate'],
      '" target="_new">view</a> | <a href="javascript:void(0);" ',
      'onclick="gdocs.deleteDoc(',i,
      ');return false;">delete</a>]','</span></li>');
  }
  $('#output').html('<ul>' + html.join('') + '</ul>');

  // Set each span's innerText to be the doc title. We're filling this after
  // the html has been rendered to the page prevent XSS attacks when using
  // innerHTML.
  $('#output li span.doc_title').each(function(i, ul) {
    $(ul).text(bgPage.docs[i].title);
  });

  bgPage.setIcon({'text': bgPage.docs.length.toString()});
};

/**
 * Fetches the user's document list.
 * @param {string?} opt_url A url to query the doclist API with. If omitted,
 *     the main doclist feed uri is used.
 */
gdocs.getDocumentList = function(opt_url) {
  var url = opt_url || null;

  var params = {
    'headers': {
      'GData-Version': '3.0'
    }
  };

  if (!url) {
    util.displayMsg('Fetching your docs');
    bgPage.setIcon({'text': '...'});

    bgPage.docs = []; // Clear document list. We're doing a refresh.

    url = bgPage.DOCLIST_FEED;
    params['parameters'] = {
      'alt': 'json',
      'showfolders': 'true'
    };
  } else {
    util.displayMsg($('#butter').text() + '.');

    var parts = url.split('?');
    if (parts.length > 1) {
      url = parts[0]; // Extract base URI. Params are passed in separately.
      params['parameters'] = util.unstringify(parts[1]);
    }
  }

  bgPage.oauth.sendSignedRequest(url, gdocs.processDocListResults, params);
};

/**
 * Refreshes the user's document list.
 */
gdocs.refreshDocs = function() {
  bgPage.clearPendingRequests();
  gdocs.getDocumentList();
  util.scheduleRequest();
};


bgPage.oauth.authorize(function() {
  if (!bgPage.docs.length) {
    gdocs.getDocumentList();
  } else {
    gdocs.renderDocList();
  }
  util.scheduleRequest();
});