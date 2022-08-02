document.addEventListener('DOMContentLoaded', function () {
    let form = document.forms[0];
    form.addEventListener('submit',function(e){
        e.preventDefault();
        optionChange();
    });
});

function optionChange() {
    let data = new FormData(document.forms[0]);
    let passes = data.get('passes');
    let sleepTime = data.get('sleepTime');
    passes *= 2;
    chrome.storage.sync.set({'passes' : passes, 'sleepTime' : sleepTime});
}