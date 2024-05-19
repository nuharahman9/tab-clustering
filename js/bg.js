
function getTextContent() { 
    const fs = require('fs'); 
    const output = document.all[0].innerText; 
    fs.writeFile('output.txt', output, (err) => { 
        if (err) throw err; 
    }); 
    return output; 
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'getText') { 
        console.log("background"); 
        chrome.tabs.query({ currentWindow: true}, (tabs) => { 
            tabs.forEach((tab) => { 
                chrome.scripting.executeScript({
                    target: { tabId: tab.id }, 
                    function: getTextContent
                }, (results) => {
                    if (result && results[0]) {
                        console.log(results); 
                    } else { 
                        console.log("err"); 
                    }

                })

            }); 

        }); 

    }

}); 