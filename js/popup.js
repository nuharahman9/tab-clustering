function displayText(text) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerText = text;
  }
  
  // Listener for extract button click
  document.getElementById('extractButton').addEventListener('click', () => {
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      // Send message to the background script to initiate text extraction
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: extractText
      }, (results) => {
        // Extracted text will be sent back as a message
        const extractedText = results[0].result;
        // Display extracted text
        displayText(extractedText);
      });
    });
  });
  
  // Listener for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Display extracted text
    displayText(message.text);
  });
  