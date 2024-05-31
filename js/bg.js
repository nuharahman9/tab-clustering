function getTextContent() {
    return document.body.innerText;  
}


function rearrangeTabs(tabGroups) { 
    for (const topic in tabGroups) { 
        const tabIds = tabGroups[topic]
        chrome.windows.create({ tabId: tabIds[0] }, newWindow => { 
            const remainingTabs = tabIds.shift()
            if (tabIds.length > 0) { 
                chrome.tabs.move(remainingTabs, moveProperties = { windowId: newWindow.id })
            }
        })
    }
}


function cluster() { 
    console.log('js in cluster')
    fetch('http://127.0.0.1:5000/cluster', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        data = response.json()
        console.log(data)
      }
      
      )

}

// sends text content of website to flask 
function sendText(tab, text) {
    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: tab.id, url: tab.url, title: tab.title, text: text[0].result })
    })
    .then(response => response.json())
    .then(data => console.log('data:', data)); 
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'getText') {    
        console.log("background"); 
        chrome.tabs.query({ currentWindow: true }, tabs => {
            let promises = tabs.map(tab => {
                return chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: getTextContent,
                    args: [tab.id]
                }).then(text => {
                    return sendText(tab, text);
                }).catch(e => { 
                    console.error("error: ", e)
                })
                ;
            });

            Promise.all(promises).then(() => {
                console.log("in promise"); 
                cluster();
            }).catch(error => {
                console.error("err: ", error);
            });
        });
    }
});



