function activate() {
    const green = [0, 128, 0, 255];
    chrome.action.enable();
    chrome.action.setBadgeBackgroundColor({ color: green });
    chrome.action.setBadgeText({ text: "⬤" });
} // activates extension

function deactivate() {
    const gray = [128, 128, 128, 255];
    chrome.action.disable();
    chrome.action.setBadgeBackgroundColor({ color: gray });
    chrome.action.setBadgeText({ text: "○" });
} // deactivates extension

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ 'passes': 20, 'sleepTime': 500 });
    deactivate();
}); // set up variables and deactivates extensions on installed

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.status == 'complete' && tab.active && tab.url == "https://www.youtube.com/playlist?list=WL") {
        activate();
    } else {
        deactivate();
    } // if complete and on right page, activate | else, deactivate
}); // changes active status depending on update

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if (tab.url == "https://www.youtube.com/playlist?list=WL") {
            activate();
        } else {
            deactivate();
        } // if right page, activate | else, deactivate
    }); // get active tab
}); // changes active status depending on tab change

chrome.windows.onFocusChanged.addListener((windowid) => {
    if (windowid == chrome.windows.WINDOW_ID_NONE) {
        return;
    } // if off browser, return
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.url == "https://www.youtube.com/playlist?list=WL") {
            activate();
        } else {
            deactivate();
        } // if right page, activate | else, deactivate
    }); // get active tab
});