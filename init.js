function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

async function sleep(time) {
    await new Promise(resolve => setTimeout(resolve, time));
}

async function remove_vids() {
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
    for (t = 0; t < list.length; t++) {
        //list[t].firstElementChild.childNodes.item(3).dispatchEvent(evt); 
        simulate(list[t].firstElementChild.childNodes.item(3), "click");// select menu
        await sleep(50);
        var button = document.querySelector('tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer#items');
        button = button.children.item(2).firstElementChild; // get remove watch later button
        //button.dispatchEvent(evt); // click it
        simulate(button, "click");
        await sleep(500);
    } // for every options node
}