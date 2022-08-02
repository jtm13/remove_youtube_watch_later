chrome.runtime.onInstalled.addListener(() => {
    const gray = [128, 128, 128, 255];
    chrome.storage.sync.set({'passes' : 20, 'sleepTime' : 500});
    chrome.action.disable();
    chrome.action.setBadgeBackgroundColor({color: gray});
    chrome.action.setBadgeText({text: "○"});
});

/*chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    const gray = [128, 128, 128, 255];
    const green = [0, 128, 0, 255];
    if (tab.status == 'complete' && tab.active && tab.url == "https://www.youtube.com/playlist?list=WL") {
        chrome.action.enable();
        chrome.action.setBadgeBackgroundColor({color: green});
        chrome.action.setBagdeText({text: "A"});
    } else {
        chrome.action.disable();
        chrome.action.setBadgeBackgroundColor({color: gray});
        chrome.action.setBagdeText({text: "I"});
    }
});*/

chrome.tabs.onActivated.addListener( function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        const gray = [128, 128, 128, 255];
        const green = [0, 128, 0, 255];
        if (tab.url == "https://www.youtube.com/playlist?list=WL") {
            chrome.action.enable();
            chrome.action.setBadgeBackgroundColor({color: green});
            chrome.action.setBadgeText({text: "⬤"});
        } else {
            chrome.action.disable();
            chrome.action.setBadgeBackgroundColor({color: gray});
            chrome.action.setBadgeText({text: "○"});
        }
    })
});