document.addEventListener('DOMContentLoaded', function () {
    let form = document.forms[0];
    form.addEventListener('submit',function(e){
        e.preventDefault();
        remove_watched('popupForm');
    });
});


async function remove_watched(formID) {
    let data = new FormData(document.getElementById(formID)); // gets the form data
    var min = parseInt(data.get('min')); // get min range
    var max = parseInt(data.get('max')); // get max range
    min = (isNaN(min)) ? 0 : --min;
    max = (isNaN(max)) ? 0 : --max;
    let titleData = [data.get('title'), data.get('title-regexp')];
    titleData[1] = (titleData[1] == null) ? false : true;
    let authorData = [data.get('author'), data.get('author-regexp')];
    authorData[1] = (authorData[1] == null) ? false : true;
    
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // get active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: start_removing,
      args: [min, max, titleData, authorData],
    }); // execute the removing function
}

async function start_removing(min, max, titleData, authorData) {
    let script = document.createElement("script");
    script.setAttribute('src', chrome.runtime.getURL('remove.js'));
    let passTime = 20, sleepTime = 500;
    await chrome.storage.sync.get("passes", ({passes}) => {
        passTime = passes * 2;
    });
    await chrome.storage.sync.get("sleepTime", ({sleeps}) => {
        sleepTime = sleeps;
    });
    if (document.getElementById("remove_yt_wl") == null) {
        let input = document.createElement("input");
        input.type = "hidden";
        input.value = min.toString() + '-' + max.toString() + '|'
            + sleepTime + '|' + passTime + '|' + titleData[0] + '-'
            + titleData[1] + '|' + authorData[0] + '-' + authorData[1];
        input.id = "remove_yt_wl";
        document.head.appendChild(input);
        let initScript = document.createElement("script");
        initScript.setAttribute('src', chrome.runtime.getURL('init.js'));
        document.head.appendChild(initScript);
    } else {
        document.getElementById("remove_yt_wl").value = min.toString() + '-' + max.toString() + '|'
            + sleepTime + '|' + passTime + '|' + titleData[0] + '-'
            + titleData[1] + '|' + authorData[0] + '-' + authorData[1];
    }
    document.head.appendChild(script);
}

function toggle(elem) {
    if (elem.className.indexOf("bg-dark") != -1) {
        elem.className = elem.className.replace("bg-dark", "");
    } else {
        elem.className += "bg-dark";
    }
}

document.getElementById('title-regexp').addEventListener('click', function () {
    toggle(this);
});
document.getElementById('author-regexp').addEventListener('click', function () {
    toggle(this);
});