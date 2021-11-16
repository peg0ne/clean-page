var current = "";
var alphabet = ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'];

function GetMarkerOwner() {
    var markers = document.getElementsByTagName('p');
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].innerText == current) {
            return markers[i].nextSibling;
        }
    }
}

function removeMarkers() {
    current = "";
    document.getElementById('kbw').innerText = current;
    var markers = document.getElementsByTagName('p');
    for (var i = markers.length - 1; i >= 0; i--) {
        if (markers[i].id == 'kbwmarker-666-69-420') {
            markers[i].remove();
        }
    }
}

function createMarkers() {
    var links = document.getElementsByTagName("a");
    var buttons = document.getElementsByTagName("button");
    var inputs = document.getElementsByTagName("input");
    createMarker(links, 'q', 'a');
    createMarker(buttons, 'w', 's');
    createMarker(inputs, 'e', 'd');
}

function createMarker(l, letter, secondary) {
    for (var i = 0; i < l.length; i++) {
        if (!IsActive(l[i]) || !IsVisible(l[i])) return;
        var marker = document.createElement('p');
        marker.style.backgroundColor = "var(--color2)";
        marker.style.color = "var(--color0)";
        marker.innerText = i >= alphabet.length ? `${secondary}${alphabet[i-alphabet.length]}` : `${letter}${alphabet[i]}`;
        marker.id = 'kbwmarker-666-69-420';
        l[i].parentElement.insertBefore(marker, l[i]);
        posY = l[i].getBoundingClientRect().top + document.documentElement.scrollTop;
        posX = l[i].getBoundingClientRect().left + document.documentElement.scrollLeft;
        marker.style.top = (posY - 30) + 'px';
        marker.style.left = (posX - 40) + 'px';
    }
}

function highlightMarkers() {
    var markers = document.getElementsByTagName('p');
    for (var i = 0; i < markers.length; i++) {
        var text = markers[i].innerText;
        text = text.includes(current) ? text.replace(current, `<span style="color:yellow">${current}</span>`) : text.replace('<span style="color:yellow">', '').replace('</span>', '');
        markers[i].innerHTML = text;
    }
    document.getElementById('kbw').innerText = current;
}

function addToCurrent(v) {
    if (v && v == 'Backspace') {
        current = current.slice(0, -1);
        highlightMarkers();
    }
    if (!v || v.length > 1) return;
    else if (current.length <= 1) current += v;
    if (current.length > 1) {
        try {
            owner = GetMarkerOwner();
            removeMarkers();
            isOpen = !isOpen;
            current = '';
            if (parent.tagName == 'INPUT') {
                owner.focus();
            } else {
                owner.click();
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }
    highlightMarkers();
}