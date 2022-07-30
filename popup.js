document.addEventListener('DOMContentLoaded', function () {
    let form = document.forms[0];
    form.addEventListener('submit',function(e){
        e.preventDefault()
        remove_watched('popupForm');
    });
});


async function remove_watched(formID) {
    let data = new FormData(document.getElementById(formID)); // gets the form data
    var min = parseInt(data.get('min')); // get min range
    var max = parseInt(data.get('max')); // get max range
    min = (isNaN(min)) ? 0 : --min;
    max = (isNaN(max)) ? 0 : --max;
    
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // get active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: start_removing,
      args: [min, max],
    }); // execute the removing function
}

function start_removing(min, max) {
    let script = document.createElement("script");
    script.setAttribute('src', chrome.runtime.getURL('remove.js'));
    if (document.getElementById("remove_yt_wl_range") == null) {
        let input = document.createElement("input");
        input.type = "hidden";
        input.value = min.toString() + '-' + max.toString();
        input.id = "remove_yt_wl_range";
        document.head.appendChild(input);
        let initScript = document.createElement("script");
        initScript.setAttribute('src', chrome.runtime.getURL('init.js'));
        document.head.appendChild(initScript);
    } else {
        document.getElementById("remove_yt_wl_range").value = min.toString() + '-' + max.toString();
    }
    document.head.appendChild(script);
}