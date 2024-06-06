async function getNumWindows() { 
    const response = await chrome.runtime.sendMessage({
        message: 'getNumWindows'
    }); 
    console.log(response)
}

let options = {
    root: document, 
    rootMargin: "0px", 
    threshold: 1.0, 
}; 

let observer = new IntersectionObserver(getNumWindows, options)

let target = document.querySelector("#popup-window"); 
console.log(target)
observer.observe(target); 


window.addEventListener('DOMContentLoaded', function() {
    var myBtn = document.getElementById('textCapture')
    var numWindows = document.getElementById('numWindows'); 
    var domainNm = document.getElementById('clusterDomain'); 
    myBtn.addEventListener('click', () => {
        let data = { 
            message: 'getText', 
            numWindows: numWindows.value ? numWindows.value : -1  // to do: add functionality for when windows is not input 
        }
        console.log(data)
       this.chrome.runtime.sendMessage(data); 
    }); 

    domainNm.addEventListener('click', () => {
        this.chrome.runtime.sendMessage({
            message: 'clusterUrl'
        }); 
    })



}); 

