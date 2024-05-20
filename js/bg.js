function writeToTextFile(text, tab) { 
    const fs = require('fs'); 
    console.log(text, tab)
    fs.writeFile('output.txt', text.result, err => { 
        if (err) throw err; 
    }); 
}


function getTextContent() {
    return document.body.innerText;  
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'getText') { 
        console.log("background"); 
        chrome.tabs.query({ currentWindow: true }, tabs => { 
            tabs.forEach(tab => {  
                chrome.scripting.executeScript({
                    target : { tabId: tab.id }, 
                    func : getTextContent, 
                    args : [ tab.id ]
                }).then((text) => { 
                    writeToTextFile(text, tab); 

                }); 
            }); 

        }); 

    }

}); 