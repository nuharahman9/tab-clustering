function writeToTextFile(text, tab) { 
    console.log(text, tab)
   const nm = tab.url.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.txt';
   const textToWrite = tab.title + ' ' + tab.url + ' ' + text.result; 
   const blob = new Blob([textToWrite], { type: 'text/plain' })
   const urlobject = URL.createObjectURL(blob)

   chrome.downloads.download({
        url: urlobject, 
        filename: nm, 
        saveAs: false
   }, (downloadId) => { 
        if (chrome.runtime.lastError) { 
            console.error(chrome.runtime.lastError); 
        } else {    
            console.log(`Download started for ${filename} with ID: ${downloadId}`);
        }

   })
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