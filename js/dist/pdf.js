(()=>{navigator.userAgent.includes("Firefox");const e=window["/js/pdfjs-dist/build/pdf"];console.log("pdf js: ",e),e.GlobalWorkerOptions.workerSrc="/js/pdfjs-dist/build/pdf.worker";var t=1;async function n(e){console.log(e),await getDocument({url:e,cMapUrl:"../node_modules/pdfjs-dist/cmaps/",cMapPacked:!0}).promise.then((function(e){e.numPages,console.log(e)}))}function o(e){l(t+=e)}function s(){return document.body.innerText}function l(e){var n,o=document.getElementsByClassName("slide");for(e>o.length&&(t=1),e<1&&(t=o.length),n=0;n<o.length;n++)o[n].style.display="none";console.log(o[t-1]),o[t-1].style.display="block"}function r(){var e=document.getElementsByClassName("scroll-button"),t=document.getElementsByClassName("slide"),n=document.getElementById("loading");for(i=0;i<t.length;i++)t[i].style.display="none";e[0].style.display="none",e[1].style.display="none",n.style.display="block"}l(1),document.getElementById("left-scroll").addEventListener("click",(()=>o(-1))),document.getElementById("right-scroll").addEventListener("click",(()=>o(1)));let c={root:document,rootMargin:"0px",threshold:1},d=new IntersectionObserver((async function(){await chrome.tabs.query({currentWindow:!0}).then((e=>{tabLen=e.length,$(document).ready((function(){$("#numWindows").attr({min:1,max:tabLen})}))}))}),c),a=document.querySelector("#numWindows");d.observe(a),window.addEventListener("DOMContentLoaded",(function(){var e=document.getElementById("textCapture"),t=document.getElementById("numWindows"),o=document.getElementById("clusterDomain"),l=[];e.addEventListener("click",(async()=>{await chrome.tabs.query({currentWindow:!0}).then((e=>{let o=e.map((e=>(console.log(e.url),chrome.scripting.executeScript({target:{tabId:e.id},func:e.url.endsWith(".pdf")?n:s,args:[e.url]}).then((t=>{console.log("text len: ",t.length),l.push({tab:e,text:t[0].result})})).catch((e=>{console.error("error: ",e)})))));Promise.all(o).then((()=>{let e={message:"sendText",tabs:l,numWindows:t.value?t.value:-1};console.log("data: ",e),this.chrome.runtime.sendMessage(e),r()})).catch((e=>{console.error("err: ",e)}))}))})),o.addEventListener("click",(()=>{this.chrome.runtime.sendMessage({message:"clusterUrl"}),r()}))}))})();