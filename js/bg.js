// grabs the text from document 
function getTextContent() {
    return document.body.innerText;  
}


// recieves groups for tabs 
function rearrangeTabs(tabGroups) { 
    console.log(tabGroups)
    for (const topic in tabGroups) { 
        let tabIds = tabGroups[topic]
        if (tabIds.length) {  // needs to have better error handling 
            chrome.windows.create({ tabId: tabIds[0] }, newWindow => { 
                tabIds.shift() 
                chrome.tabs.move(tabIds, { index: 0, windowId: newWindow.id })
            })
        }
    }
}

// call cluster by url 
function groupByDomain(tabs) { 
    let domain_tabIds = {}
    for (let tab of tabs) { 
        let url = tab.url 
        var pathArr = url.split('/')
        var host = pathArr[2]
        if (domain_tabIds[host]) {
            let curr = domain_tabIds[host]
            curr.push(tab.id)
            domain_tabIds[host] = curr
        } else { 
            domain_tabIds[host] = [tab.id]
        }
    }

    console.log("groupbyDomain: ", domain_tabIds)

    rearrangeTabs(domain_tabIds)
}



// call cluster method using NMF 
async function cluster(numWindows) { 
    console.log('js in cluster')
    const response = await fetch('http://127.0.0.1:5000/cluster', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ 
            numWindows: numWindows
        })
    })

    const json = await response.json()
    // console.log(json)
    if (json.status === 200) { 
        rearrangeTabs(json.groups)
    }

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
    .catch(err => 
        console.error(tab.url, err)
        
    )
}


// get window bounds for input option 
function getTabCount() { 
    chrome.tabs.query({ currentWindow: true }), tabs => { 
        let data = { 
            msg: 'tabCount', 
            len: tabs.length 
        }
        console.log(data)
        chrome.runtime.sendMessage(data)
    }
}



// communication with popup script 
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.message === 'getText') {    
        let numWindows = data.numWindows
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
                cluster(numWindows);
            }).catch(error => {
                console.error("err: ", error);
            });
        });
    }

    else if (data.message === 'clusterUrl') { 
        chrome.tabs.query({ currentWindow: true }, tabs => groupByDomain(tabs)); 
    }

    else if (data.message === 'getNumWindows') { 
        console.log("bg js  get numWindows")
        chrome.tabs.query({ currentWindow: true }, tabs => sendResponse({ numWindows: tabs.length })); 
    }



});



