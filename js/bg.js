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
async function sendText(tab, text) {
    console.log("text length: ", text.length)
    const response = fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: tab.id, url: tab.url, title: tab.title, text: text })
    })
    

    console.log(response)
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
chrome.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
    if (data.message == "sendText") { 
        const tabs = data.tabs
        console.log("tabs: ", tabs); 
        const numWindows = data.numWindows
        let promises = tabs.map(tab => {
            return sendText(tab.tab, tab.text)
        })

        Promise.all(promises).then(() => cluster(numWindows)); 

    }

    else if (data.message === 'clusterUrl') { 
        chrome.tabs.query({ currentWindow: true }, tabs => groupByDomain(tabs)); 
    }

    else if (data.message === 'getNumWindows') { 
        console.log("bg js  get numWindows")
        chrome.tabs.query({ currentWindow: true }, tabs => sendResponse({ numWindows: tabs.length })); 
    }



});



