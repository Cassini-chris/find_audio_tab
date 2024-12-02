document.getElementById('jumpToAudioTab').addEventListener('click', () => {
    chrome.storage.local.get(['audioTabIds'], (result) => {
      let audioTabIds = result.audioTabIds || [];
      if (audioTabIds.length > 0) {
        const tabIdToCheck = audioTabIds[0];
  
        chrome.tabs.get(tabIdToCheck, (tab) => {
          if (chrome.runtime.lastError) {
            console.error("Tab not found:", tabIdToCheck);
  
            // Update audioTabIds to remove the invalid ID
            audioTabIds = audioTabIds.filter(id => id !== tabIdToCheck);
            chrome.storage.local.set({ 'audioTabIds': audioTabIds });
  
            // Provide feedback to the user (e.g., show a message in the popup)
            // You can add code here to display a message in the popup, like:
            // document.getElementById('errorMessage').textContent = "Error: Tab not found."; 
  
          } else {
            // Focus the window and then update the active tab
            chrome.windows.update(tab.windowId, { focused: true }, () => {
              chrome.tabs.update(tabIdToCheck, { active: true });
            });
          }
        });
      }
    });
  });
