function extractTabText(tabId) { 
    return new Promise((resolve, reject) => { 
        chrome.scripting.executeScript({ 
            target: { tabId: tabId }, 
            function: () => { 
                const pageText = document.documentElement.innerText
                chrome.runtime.sendMessage({ text: pageText })
            }
        }, (results) => { 
            if (chrome.runtime.lastError) { 
                reject(chrome.runtime.lastError.message)
            } else { 
                resolve()
            }
        }); 
    }); 
}

chrome.action.onClicked.addListener((tab) => { 
    chrome.tabs.query({}, (tabs) => { 
        const promises = tabs.map(tab => { 
            return new Promise((resolve, reject) => { 
                extractTabText(tab.id)
                .then(() => resolve())
                .catch(e => reject(e))
            }); 
        }); 
    }); 
}); 

Promise.all(promises).then(() => { 
    console.log("text extract fin\n")
})
.catch(e => { 
    console.log(e)
}); 