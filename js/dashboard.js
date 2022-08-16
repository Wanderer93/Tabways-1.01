console.log("dashboard js loaded");
const workDiv = document.getElementById('workspaces');
const openDiv = document.getElementById('open-tabs');
const workSpace = document.getElementById('workspace'); // loop through classes? generation method.
const closeAll = document.getElementById('close-all');

workSpace.addEventListener('click', openSpace);
closeAll.addEventListener('click', closeAllTabs);

function closeAllTabs(){
  // save? or something.
  chrome.tabs.create({}, function (newTab) {
  let querying = chrome.tabs.query({}, function (tabs) {
  for (let tab of tabs) {
  if (tab.id !== newTab.id) chrome.tabs.remove(tab.id);
  }
  });
  });
}

function openSpace() { //also disable button after first click?
  workSpace.style="background-color:green;"
  console.log("opening space");
  // https://dev.to/midhunz/how-to-create-a-simple-chrome-extension-ijk
  chrome.tabs.create({}, function (newTab) {
  let querying = chrome.tabs.query({}, function (tabs) {
  for (let tab of tabs) {
  if (tab.id !== newTab.id) chrome.tabs.remove(tab.id);
  }
  });
  });
  chrome.bookmarks.getTree(findAndOpen);
  chrome.tabs.update(newTab.id, {active: true}) // make new tab active again. make sure this works well with callbacks.

}


function findAndOpen(bookmarks) {
    for ( var i = 0; i<bookmarks[0].children.length; i++ ) {
        if (bookmarks[0].children[i].title === "Other bookmarks") {
            for ( var j = 0; j<bookmarks[0].children[i].children.length; j++ ) {
                if (!bookmarks[0].children[i].children[j].url) {
                    let newFolder = (bookmarks[0].children[i].children[j]); //find extension folder
                    console.log("folder is " + newFolder);
                    for ( var k = 0; k<bookmarks[0].children[i].children[j].children.length; k++) { //loop through bookmarks in Extension folder.
                      console.log("Opening bookmark " + k + "is" + bookmarks[0].children[i].children[j].children[k].title);
                      chrome.tabs.create({'url': bookmarks[0].children[i].children[j].children[k].url}, function(tab) {
                          // Tab opened.
                      });
                    }
                }
            }
        }
    }

};


// send an array of folders/workspaces. Loop through them and print a button with an icon for each.
// let div = document.createElement("div");
// workDiv.append("The tabs you're on are:", p);

chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {

  let div = document.createElement("div");
  let p = document.createElement("p");
  //console.log("openDiv is "+ openDiv);
  openDiv.append("The tabs you're on are:", p);

  openDiv.innerHTML += ('<ul>');
  // document.write(`<h3>The tabs you're on are:</h3>`);
  // document.write('<ul>');
  for (let i = 0; i < tabs.length; i++) {
    openDiv.innerHTML += (`<li><a href="${tabs[i].url}"> ${tabs[i].title} </a></li>`);

  }
  openDiv.innerHTML += ('</ul>');
});

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.greeting === "hello")
//       sendResponse({farewell: "goodbye"});
//   }
// );
//
