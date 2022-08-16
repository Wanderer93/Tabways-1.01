console.log("extension running!");
// chrome.storage.sync.set({'extensionsFolderId': ''}); uncomment to RESET storage.

let otherBookmarksID;
// https://stackoverflow.com/questions/15329271/how-do-i-get-the-id-of-an-added-bookmarks-folder
// might need callbacks for this. get root folder id?? is this even necessary
// https://bugs.chromium.org/p/chromium/issues/detail?id=29190
function onTree(bookmarks) {

  for ( var i = 0; i<bookmarks[0].children.length; i++ ) { //can put return somewhere to optimize. other ways to optimize
      if (bookmarks[0].children[i].title === "Other bookmarks") {
          for ( var j = 0; j<bookmarks[0].children[i].children.length; j++ ) {
              if (!bookmarks[0].children[i].children[j].url) {
                  let newFolder = (bookmarks[0].children[i].children[j].id); // finding the ID of already created Extensions folder
                  console.log("folder id is " + newFolder);
                  saveFolderId(newFolder);
              }
          }
      }
  }
  // to fix the async set/get thing -
  // put the other code in a function, and run it from here.
}
// can't save bookmarks in root folders.
// CHECK if bookmark folder exists, so as not to create it x2.

function createBookmark(extensionsFolderId, tabs) {
    console.log(typeof(extensionsFolderId)); // it's a str
    chrome.bookmarks.create({'parentId': extensionsFolderId, // changing this value to "2" solves the error? but 7916 doesn't. ???????
                             'title': tabs[0].title,        // Uncaught (in promise) Error: Can't find parent bookmark for id.
                             'url': tabs[0].url});
    console.log(tabs[0].title + 'bookmark created in '+extensionsFolderId);
}

function startBookmarking(tabs) {
// console.log(Object.keys(currentTab));
//console.log(JSON.stringify(currentTab));
  console.log("statr bookmarking!");

  chrome.bookmarks.getTree(onTree);

  chrome.storage.sync.get(['folderId'], function(result) { // this is running before the callback comes through.
  console.log('Value currently is ' + result.folderId);     // might  create issues?

  let test = result.folderId;
  console.log('Test variable says folder is ' +test +'here'+tabs);

  if (test = undefined) {

      chrome.storage.sync.get(['otherBookmarksID'], function() {
      console.log('otherBookmark retrieved, equals  ' + otherBookmarksID);

      });
      chrome.bookmarks.create({'parentId': otherBookmarksID,
                               'title': 'Extension bookmarks'},
                              function(newFolder) {
                                  console.log("added folder: " + newFolder.title);
                                  createBookmark(newFolder.id, tabs);
                                  saveFolderId(newFolder.id);
                              });
  }
  else {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      console.log("ran query!");
      // console.log(Object.keys(tabs[0]));
      createBookmark(result.folderId, tabs);
      });
  }

  });
}


function saveFolderId(extensionsFolderId) {
    chrome.storage.sync.set({'folderId': extensionsFolderId}, function() {
    console.log('Value is set to ' + extensionsFolderId);
    });
}

// function getFolderId(tabs) {
//   chrome.storage.sync.get(['folderId'], function(result) {
//   console.log('Value currently is ' + result.folderId);
//   createBookmark( result.folderId, tabs);
//   console.log('tabs is '+tabs + ' at folderID' +result.folderId);
//   });
// }



chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
    console.log("Got message from popup script: ", request);
    // let currentTab = askCurrentTab();
    sendResponse('OK');
    // EDIT - remove edit later. uncomment the onTree in start Bookmarking.
    // use promises with .then
    // chrome.bookmarks.getTree(onTree);
    startBookmarking();
})
