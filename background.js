// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.audible) {
      console.log("Audio detected in tab:", tabId);
  
      chrome.storage.local.get(['audioTabIds'], (result) => {
        let audioTabIds = result.audioTabIds || [];
        if (!audioTabIds.includes(tabId)) {
          audioTabIds.push(tabId);
          chrome.storage.local.set({ 'audioTabIds': audioTabIds });
          console.log("Stored audioTabIds:", audioTabIds);
        }
      });
  
      chrome.action.setIcon({ tabId: tabId, path: "audio_16.png" });
    } else if (changeInfo.audible === false) {
      chrome.storage.local.get(['audioTabIds'], (result) => {
        let audioTabIds = result.audioTabIds || [];
        audioTabIds = audioTabIds.filter(id => id !== tabId);
        chrome.storage.local.set({ 'audioTabIds': audioTabIds });
        console.log("Removed audio tab ID:", tabId);
      });
  
      chrome.action.setIcon({ tabId: tabId, path: "muted_16.png" });
      console.log("NO AUDIO:");
    }
  
    // Handle URL changes within the same tab
    if (changeInfo.url) {
      if (tab.audible) {
        chrome.storage.local.get(['audioTabIds'], (result) => {
          let audioTabIds = result.audioTabIds || [];
          if (!audioTabIds.includes(tabId)) {
            audioTabIds.push(tabId);
            chrome.storage.local.set({ 'audioTabIds': audioTabIds });
            console.log("Stored audioTabIds (URL change):", audioTabIds);
          }
        });
      } else {
        chrome.storage.local.get(['audioTabIds'], (result) => {
          let audioTabIds = result.audioTabIds || [];
          audioTabIds = audioTabIds.filter(id => id !== tabId);
          chrome.storage.local.set({ 'audioTabIds': audioTabIds });
          console.log("Removed audio tab ID (URL change):", tabId);
        });
      }
    }
  });
  
  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    chrome.storage.local.get(['audioTabIds'], (result) => {
      let audioTabIds = result.audioTabIds || [];
      audioTabIds = audioTabIds.filter(id => id !== tabId);
      chrome.storage.local.set({ 'audioTabIds': audioTabIds });
      console.log("Tab removed. Updated audioTabIds:", audioTabIds);
    });
  });
