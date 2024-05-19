function getTextContent() { 
    console.log("get tetx"); 
    return document.body.innerText; 
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'getText') { 
        console.log("background"); 
        chrome.tabs.query({ currentWindow: true }, tabs => { 
            tabs.forEach(tab => {
                chrome.scripting.executeScript({
                    target : { tabId: tab.id }, 
                    func : getTextContent
                }).then((results) => { 
                    console.log(results); 
                }); 

            }); 

        }); 

    }

}); 