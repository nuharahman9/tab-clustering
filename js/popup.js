window.addEventListener('DOMContentLoaded', function() {
    var myBtn = document.getElementById('textCapture');
    myBtn.addEventListener('click', () => {
        this.chrome.runtime.sendMessage('getText'); 
    }); 

}); 


