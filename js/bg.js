
function getTextContent() {
    return document.body.innerText;  
}

// sends text content of website to flask 
function sendText(tab, text) {
    console.log("text: ", text[0].result); 
    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: tab.id, url: tab.url, title: tab.title, text: text[0].result })
    })
    .then(response => response.json())
    .then(data => console.log('data:', data))
    .catch((error) => console.error(error));
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
                    sendText(tab, text); 
                }); 
            }); 

        }); 

    }

}); 