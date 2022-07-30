function remove_vids() {
    let min = -1;
    let max = -1;
    var range = document.getElementById('remove_yt_wl_range').value;
    range = range.split("-", 2);
    min = parseInt(range[0]);
    max = parseInt(range[1]);

    let vids = document.querySelector('div.style-scope.ytd-playlist-video-list-renderer#contents'); // gets the contents
    let list = [];
    vids.childNodes.forEach((elem, index) => {
        if (index >= min && index <= max) {
            list.push(elem.lastElementChild);
            elem.scrollIntoView({block: 'nearest'})
        } // if within range, get data and scroll to it
    }); // for every video in watch later
    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 20,
        /* whatever properties you want to give it */
    });
    list.forEach((elem, index) => {
        elem.firstElementChild.childNodes.item(3).dispatchEvent(evt); // select menu
        var button = document.querySelector('tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer#items');
        button = button.childNodes.item(3).firstElementChild; // get remove watch later button
        button.dispatchEvent(new Event('mousedown')); // click it
    }); // for every options node
}