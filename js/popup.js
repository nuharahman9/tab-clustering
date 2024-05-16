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
  

window.addEventListener('DOMContentLoaded', function() {
    var myBtn = document.getElementById('textCapture');
    console.log(myBtn);  

}); 



// document.getElementById("textCapture").addEventListener('click', () => {
//     console.log(document.getElementById("textCapture"))
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const promises = tabs.map(tab => { 
//             return new Promise((resolve, reject) => { 
//                 extractTabText(tab.id)
//                 .then(result => resolve(result))
//                 .catch(err => reject(err))
//             }); 
//         }); 
//     }); 

//     Promise.all(promises)
//         .then(results => {
//             console.log(results)})
//         .catch(error => {
//             console.error('Error extracting text from tabs:', error)});
// }); 
  
