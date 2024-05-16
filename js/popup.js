function extractTabText(tabId) { 
    return new Promise((resolve, reject) => { 
        chrome.scripting.executeScript({ 
            target: { tabId: tabId }, 
            function: () => { 
                const pageText = document.documentElement.innerText
                console.log(pageText); 
            }
        }, (results) => { 
            if (chrome.runtime.lastError) { 
                reject(chrome.runtime.lastError.message)
            } else { 
                resolve({ tabId: tabId, text: pageText })
            }
        }); 
    }); 
}
  
  // Listener for extract button click

document.getElementById('textCapture').addEventListener('click', () => {
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const promises = tabs.map(tab => { 
            return new Promise((resolve, reject) => { 
                extractTabText(tab.id)
                .then(result => resolve(result))
                .catch(err => reject(err))
            }); 
        }); 
    }); 
        // Send message to the background script to initiate text extraction
    Promise.all(promises)
        .then(results => {
            console.log(results)})
        .catch(error => {
            console.error('Error extracting text from tabs:', error)});
}); 
  
