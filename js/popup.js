window.addEventListener('DOMContentLoaded', function() {
    var myBtn = document.getElementById('textCapture')
    var numWindows = document.getElementById('numWindows'); 
    console.log(numWindows)
    myBtn.addEventListener('click', () => {
        let data = { 
            message: 'getText', 
            numWindows: numWindows.value ? numWindows.value : -1  
        }
        console.log(data)
       this.chrome.runtime.sendMessage(data); 
    }); 

}); 

chrome.runtime.onMessage.addListener((data) => { 
    console.log("popup.js: ", data)
}); 
