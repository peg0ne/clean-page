var MARKERTAG = "p";
var MARKERID = "kbwmarker-666-69-420";
var isOpen = false;
var current = "";
var alphabet = [
    'a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'
];
var inputEl = document.getElementById("searchinputbar");
var entryNameInput = document.getElementById("nameInput");
var entryUrlInput = document.getElementById("urlInput");
var configInput = document.getElementById("config");

document.onkeydown = function(e) {
    if (e.key == 'Escape') {
        showCreator(false);
        removeMarkers();
        isOpen = true;
        toggleOpen();
        showConfig(false);
    } else if (e.key == 'Tab') {
        return;
    } else if (e.key == 'c' && !isOpen && entryCreator.style.display == 'none' &&
        document.activeElement != inputEl &&
        document.activeElement != entryNameInput &&
        document.activeElement != entryUrlInput &&
        configInput.style.display == 'none') {
        e.preventDefault();
        showConfig(true);
    } else if (e.key == 's' && !isOpen && entryCreator.style.display == 'none' &&
        document.activeElement != inputEl &&
        document.activeElement != entryNameInput &&
        document.activeElement != entryUrlInput &&
        configInput.style.display == 'none') {
        e.preventDefault();
        inputEl.focus();
    } else if (e.key == "f" && entryCreator.style.display == 'none' &&
        document.activeElement != inputEl &&
        document.activeElement != entryNameInput &&
        document.activeElement != entryUrlInput &&
        configInput.style.display == 'none') {
        if (isOpen) {
            removeMarkers();
        } else {
            createMarkers();
        }
        toggleOpen();
    } else if (isOpen) {
        e.preventDefault();
        addToCurrent(e.key);
    }
};

function getMarkerParent() {
    var markers = document.getElementsByTagName(MARKERTAG);
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].innerText == current) {
            return markers[i].nextSibling;
        }
    }
}

function removeMarkers() {
    current = "";
    document.getElementById('kbw').innerText = current;
    var markers = document.getElementsByTagName(MARKERTAG);
    for (var i = markers.length - 1; i >= 0; i--) {
        if (markers[i].id == MARKERID) {
            markers[i].remove();
        }
    }
}

function createMarkers() {
    var links = document.getElementsByTagName("a");
    var buttons = document.getElementsByTagName("button");
    var inputs = document.getElementsByTagName("input");
    createMarker(links, 0, 'q', 'a');
    createMarker(buttons, 0, 'w', 's');
    createMarker(inputs, 0, 'e', 'd');
}

function createMarker(l, startIndex, letter, secondary) {
    for (var i = 0; i < l.length; i++) {
        if (l[i].style.display == "none" || l[i].style.visibility == "hidden")
            return;
        var marker = document.createElement(MARKERTAG);
        marker.style.backgroundColor = "var(--color2)";
        marker.style.color = "var(--color0)";
        var newtext = `${letter}${alphabet[i + startIndex]}`;
        if (i + startIndex >= alphabet.length) newtext = `${secondary}${alphabet[(i + startIndex)-alphabet.length]}`;
        marker.innerText = `${newtext}`;
        marker.id = MARKERID;
        l[i].parentElement.insertBefore(marker, l[i]);
        posY = l[i].getBoundingClientRect().top + document.documentElement.scrollTop;
        posX = l[i].getBoundingClientRect().left + document.documentElement.scrollLeft;
        marker.style.top = (posY - 30) + 'px';
        marker.style.left = (posX - 40) + 'px';
    }
}

function toggleOpen() {
    isOpen = !isOpen;
}

function addToCurrent(v) {
    var markers = document.getElementsByTagName(MARKERTAG);
    if (!v) return;
    if (v == 'Backspace') {
        var newcurrent = current.slice(0, -1);
        current = newcurrent;
        document.getElementById('kbw').innerText = current;
        for (var i = 0; i < markers.length; i++) {
            var text = markers[i].innerText;
            if (text.includes(current)) {
                text = text.replace(current, `<span style="color:yellow">${current}</span>`);
                markers[i].innerHTML = text;
            } else {
                text = text.replace('<span style="color:yellow">', '').replace('</span>', '');
                markers[i].innerHTML = text;
            }
        }
    }
    if (v.length > 1) return;
    current += v;
    if (current.length > 1) {
        try {
            parent = getMarkerParent();
            removeMarkers();
            toggleOpen();
            current = '';
            if (parent.tagName == 'INPUT') {
                console.log('focus');
                parent.focus();
            } else {
                parent.click();
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
    for (var i = 0; i < markers.length; i++) {
        var text = markers[i].innerText;
        if (text.includes(current)) {
            text = text.replace(current, `<span style="color:yellow">${current}</span>`);
            markers[i].innerHTML = text;
        } else {
            text = text.replace('<span style="color:yellow">', '').replace('</span>', '');
            markers[i].innerHTML = text;
        }
    }
    document.getElementById('kbw').innerText = current;
}