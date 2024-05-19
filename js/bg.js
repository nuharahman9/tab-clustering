function getTextContent() { 
    console.log("i am getting de text"); 
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
                }).then(() => { 
                    console.log("success"); 
                }); 

            }); 

        }); 

    }

}); 