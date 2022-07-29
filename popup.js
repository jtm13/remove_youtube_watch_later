const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: 20,
    /* whatever properties you want to give it */
  });

let min, max;

function remove_watched(formID) {
    let data = new FormData(document.getElementById(formID)); // gets the form data
    min = parseInt(data.get('min')); // get min range
    max = parseInt(data.get('max')); // get max range
    
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // get active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: start_removing,
    }); // execute the removing function
}

function start_removing() {
    let vids = document.getElementById('contents'); // gets the contents
    let list = [];
    vids.childNodes.forEach((elem, index) => {
        if (index >= min && index <= max) {
            list.push(elem.lastChild);
            elem.scrollIntoView({block: 'nearest'})
        } // if within range, get data and scroll to it
    }); // for every video in watch later
    list.forEach((elem, index) => {
        elem.dispatchEvent(evt); // select menu
        let button = document.querySelector(
            'tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer#items')
            .childNodes.item(3); // get remove watch later button
        button.dispatchEvent(evt); // click it
    }); // for every options node
}