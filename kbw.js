var MARKERTAG = "kbwmarker";
var MARKERID = "kbwmarker-666-69-420";
var isOpen = false;
var current = "";
var alphabet = [
    'a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'
];
var inputEl = document.getElementById("searchinputbar");
var entryNameInput = document.getElementById("nameInput");
var entryUrlInput = document.getElementById("urlInput");

document.onkeydown = function(e) {
    if (e.key == 'Escape') {
        showCreator(false);
        removeMarkers();
        isOpen = true;
        toggleOpen();
    } else if (e.key == 'Tab') {
        return;
    } else if (e.key == 's' && entryCreator.style.display == 'none' &&
        document.activeElement != inputEl &&
        document.activeElement != entryNameInput &&
        document.activeElement != entryUrlInput) {
        e.preventDefault();
        inputEl.focus();
    } else if (e.key == "f") {
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
            console.log(markers[i].parentElement);
            return markers[i].parentElement;
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
    createMarker(links, 0, 'q');
    createMarker(buttons, 0, 'w');
    createMarker(inputs, 0, 'e');
}

function createMarker(l, startIndex, letter) {
    for (var i = 0; i < l.length; i++) {
        if (l[i].style.display == "none" || l[i].style.visibility == "hidden")
            return;
        var marker = document.createElement(MARKERTAG);
        marker.style.backgroundColor = "var(--color2)";
        marker.style.color = "var(--color0)";
        marker.innerText = `${letter}${alphabet[i + startIndex]}`;
        marker.id = MARKERID;
        l[i].appendChild(marker);
    }
}

function toggleOpen() {
    isOpen = !isOpen;
}

function addToCurrent(v) {
    if (!v) return;
    if (v == 'Backspace') {
        var newcurrent = current.slice(0, -1);
        current = newcurrent;
        document.getElementById('kbw').innerText = current;
    }
    if (current.length > 1 && v == 'Enter') {
        try {
            parent = getMarkerParent();
            removeMarkers();
            toggleOpen();
            current = '';
            parent.click();
        } catch {
            return;
        }
    }
    if (v.length > 1) return;
    current += v;
    document.getElementById('kbw').innerText = current;
}