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

function RemoveMarkers() {
    isOpen = false;
    current = ''
    document.getElementById('kbw').innerText = current;
    var markers = document.getElementsByTagName('p');
    for (var i = markers.length - 1; i >= 0; i--) {
        if (markers[i].id == 'kbwmarker-666-69-420') {
            markers[i].remove();
        }
    }
}

function CreateMarkers() {
    var links = document.getElementsByTagName("a");
    var buttons = document.getElementsByTagName("button");
    var inputs = document.getElementsByTagName("input");
    CreateMarker(links, 'q', 'a');
    CreateMarker(buttons, 'w', 's');
    CreateMarker(inputs, 'e', 'd');
}

function CreateMarker(l, letter, secondary) {
    for (var i = 0; i < l.length; i++) {
        if (!IsActive(l[i]) || !IsVisible(l[i])) return;
        var marker = ParseToHTML(kbwtemplate.replace('{text}', i >= alphabet.length ? `${secondary}${alphabet[i-alphabet.length]}` : `${letter}${alphabet[i]}`));
        l[i].parentElement.insertBefore(marker, l[i]);
        marker.style.top = (l[i].getBoundingClientRect().top + document.documentElement.scrollTop - 30) + 'px';
        marker.style.left = (l[i].getBoundingClientRect().left + document.documentElement.scrollLeft - 40) + 'px';
    }
}

function HighlightMarkers() {
    var markers = document.getElementsByTagName('p');
    for (var i = 0; i < markers.length; i++) {
        var text = markers[i].innerText;
        text = text.includes(current) ? text.replace(current, `<span style="color:yellow">${current}</span>`) : text.replace('<span style="color:yellow">', '').replace('</span>', '');
        markers[i].innerHTML = text;
    }
    document.getElementById('kbw').innerText = current;
}

function AddToCurrent(v) {
    if (!v || v.length > 1 && v != 'Backspace') return;
    else if (v == 'Backspace') current = current.slice(0, -1);
    else if (current.length <= 1) current += v;
    if (current.length > 1) {
        var owner = GetMarkerOwner();
        RemoveMarkers();
        if (owner.tagName == 'INPUT') owner.focus();
        else owner.click();
    }
    HighlightMarkers();
}