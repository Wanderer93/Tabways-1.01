console.log("popup js is here"); // this will print in the popup console.

chrome.runtime.sendMessage({message: "hi"}, (response) => {
  console.log(response);
});
