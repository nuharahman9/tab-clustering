var slideIdx = 1 
showDiv(1)

document.getElementById('left-scroll').addEventListener('click', () => moveDiv(-1)); 
document.getElementById('right-scroll').addEventListener('click', () => moveDiv(+1))

function moveDiv(n) { 
    showDiv(slideIdx += n)
}


function showDiv(n) { 
    var i 
    var x = document.getElementsByClassName("slide")
    if (n > x.length) { slideIdx = 1 }
    if (n < 1) { slideIdx = x.length }
    for (i = 0; i < x.length; i++) { 
        x[i].style.display = "none"; 
    }
    // fix this later - keeps throwing an error !!! 
    x[slideIdx-1].style.display =  "block"
}


function showLoad() { 
    var buttons = document.getElementsByClassName("scroll-button"); 
    var x = document.getElementsByClassName("slide"); 
    var load = document.getElementById("loading"); 
    for (i = 0; i < x.length; i++) { 
        x[i].style.display = "none"; 
    }
    buttons[0].style.display = "none"; 
    buttons[1].style.display = "none"; 

    load.style.display = "block"; 
}

async function getNumWindows() { 
    await chrome.tabs.query({ currentWindow: true }).then(tabs => { 
        tabLen = tabs.length 
        $(document).ready(function() {
            $("#numWindows").attr({
                "min": 1, 
                "max": tabLen
            })
        })

    }); 
}

let options = {
    root: document, 
    rootMargin: "0px", 
    threshold: 1.0, 
}; 

let observer = new IntersectionObserver(getNumWindows, options)

let target = document.querySelector("#numWindows"); 
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
       showLoad(); 
    }); 

    domainNm.addEventListener('click', () => {
        this.chrome.runtime.sendMessage({
            message: 'clusterUrl'
        }); 
        showLoad(); 
    })



}); 

