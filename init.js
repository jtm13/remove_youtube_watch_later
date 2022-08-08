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
} // https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
} // https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
} // https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript
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
} // https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript


/* These are all my functions */


async function sleep(time) {
    await new Promise(resolve => setTimeout(resolve, time));
} // sleep for a set amount of milliseconds

async function remove_video(elem, sTime) {
    simulate(elem.lastElementChild.firstElementChild.childNodes.item(3), "click");// select menu
    await sleep(50);
    var button = document.querySelector('tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer#items');
    button = button.children.item((button.children.length == 1) ? 0 : 2).firstElementChild; // get remove watch later button
    simulate(button, "click"); // click it
    await sleep(sTime);
} // removes a single video (element is the video container)

async function wait(passes, prevLen, vidContainer) {
    for (t = 0; t < passes; t++) {
        var len = vidContainer.children.length;
        if (prevLen != len) {
            return true;
        }
        await sleep(500);
    }
    console.log("Gave up.");
    return false;
} // waits for half seconds for the page to load (true if loaded, false if not)

function check(num, def) {
    return (isNaN(num)) ?  def : num;
} // checks if number is NaN

function checkNull(num, def) {
    return (num == null) ? def : num;
} // checks if null

function test_meta_helper(tester, tested, regexp) {
    tested = (regexp) ? tested : new RegExp(tested.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'i');
    let index = tester.search(tested);
    return (index == -1) ? false : true;
} // helps with regex and searching for test_meta

function test_meta(meta) {
    if (keys[0][0] != null || keys[0][0].length == 0) {
        if (test_meta_helper(meta.firstElementChild.lastElementChild.innerHTML, keys[0][0], keys[0][1]) == false) return false;
    } // if title text is not empty
    if (keys[1][0] != null || keys[1][0].length == 0) {
        let name = meta.children.item(1).firstElementChild.firstElementChild
            .firstElementChild.firstElementChild.firstElementChild.firstElementChild
            .firstElementChild;
        if (name != null) {
            return test_meta_helper(name.innerHTML, keys[1][0], keys[1][1]);
        } // if there is an author
    } // if author text is not empty
    return true;
} // tests the meta data (title and author name) for keywords if provided

let keys = [[null, false], [null, false]]; // the tuple array of 2 (keyword, boolean)

async function remove_vids() {
    let min = -1; // sets defaults
    let max = -1; // sets defaults
    let passes = 20; // sets defaults
    let sTime = 500; // half a second
    keys = [ [null, false], [null, false]]; // both title and author keywords
    let message = document.getElementById('remove_yt_wl').value.split("|", 5);
    let range = message[0].split("-", 2); // gets min and max
    range[0] = parseInt(range[0]);
    range[1] = parseInt(range[1]);
    min = check(parseInt(range[0]), -1); // set min
    max = check(parseInt(range[1]), -1); // set max
    sTime = check(parseInt(message[1]), 500); // set messages
    passes = check(parseInt(message[2]), 20); // set passes
    let words = message[3].split('-', 2); // gets the keyword data
    words[1] = checkNull(words[1], 0); // check if keyword is null
    keys[0][0] = words[0]; // transfer to keys
    keys[0][1] = (words[1] == "true") ? true : false; // if regex is true, set keys to true | else false
    words = message[4].split('-', 2); // gets the keyword data
    words[1] = checkNull(words[1], 0); // check if keyword is null
    keys[1][0] = words[0]; // transfer to keys
    keys[1][1] = (words[1] == "true") ? true : false; // if regex is true, set keys to true | else false

    let vids = document.querySelector('div.style-scope.ytd-playlist-video-list-renderer#contents'); // gets the contents
    for (index = min; index <= max; index++) {
        let elem = vids.children.item(index); // get current video
        if (index >= vids.children.length) {
            var len = document.querySelector('div.style-scope.ytd-playlist-sidebar-primary-info-renderer#stats').firstElementChild.firstElementChild.innerHTML;
            len = len.replace(/,/g, ""); // remove commas
            len = parseInt(len); // get number for real length
            if (index < len) {
                elem = vids.lastElementChild;
                elem.scrollIntoView({block: 'nearest'}); // scroll to manipulate the load for page
                load = await wait(passes, vids.children.length, vids); // wait a specified amount of seconds for loading
                if (load) {
                    index--; // reset index
                    continue; // continue loop
                } else {
                    break;
                } // if loaded, reset | else, break
            } else {
                break;
            } // if the index has not reached the true length, pass | else, break
        } // if the index surpasses the video container length
        if (index >= min && index <= max) {
            elem.scrollIntoView({block: 'nearest'});
            if (test_meta(elem.children.item(1).firstElementChild.lastElementChild)) {
                await remove_video(elem, sTime); // remove video
                index--;
                max--; // decrement both number to account for removed video
            } // if it passes the keyword test
        } // if within range, get data and scroll to it
    } // for every video in watch later
} // remove videos