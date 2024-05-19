function getTextContent() { 
    return document.body.innerText; 
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getText') { 
        chrome.tabs.query({ currentWindow: true}, (tabs) => { 
            tabs.forEach((tab) => { 
                chrome.scripting.executeScript({
                    target: { tabId: tab.id }, 
                    function: getTextContent
                }, (results) => {
                    if (result && results[0]) {
                        console.log('text from tab ${tab.id}: ', results[0].result); 
                    }

                })

            }); 

        }); 

    }

}); 