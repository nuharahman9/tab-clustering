window.addEventListener('DOMContentLoaded', function() {
    var myBtn = document.getElementById('textCapture')
    var numWindows = document.getElementById('numWindows'); 
  //  var popup = document.getElementById('popup-window')
    var domainNm = document.getElementById('clusterDomain'); 
    myBtn.addEventListener('click', () => {
        let data = { 
            message: 'getText', 
            numWindows: numWindows.value ? numWindows.value : -1  
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

chrome.runtime.onMessage.addListener((data) => { 
    console.log("popup.js: ", data)
}); 
