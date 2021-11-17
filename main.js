var template = `<a class="link entry" href="">{text}</a>`;
var dataEntries = localStorage.getItem("clean-page-links") ?
    JSON.parse(localStorage.getItem("clean-page-links")) : [];
var bgImgUrl = localStorage.getItem("clean-page-img") ?
    localStorage.getItem("clean-page-img") :
    'https://external-preview.redd.it/opakdiLcvPEPEZTlN5GtN7EiO10KMXfHNeGXAhn1WwY.jpg?auto=webp&s=fd90024d17899799c9548ef3d651530e0d826331';
var usernameValue = localStorage.getItem("clean-page-name") ?
    localStorage.getItem("clean-page-name") :
    'setname <NAME>'

var isOpen = false;
var current = "";
var alphabet = [
    'a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'
];
var entryCreator = document.getElementById("entryCreator");
var entryNameInput = document.getElementById("nameInput");
var entryUrlInput = document.getElementById("urlInput");
var entryHolder = document.getElementById("entryHolder");
var inputEl = document.getElementById("searchinputbar");
var usernameText = document.getElementById("usernameText");
var userImage = document.getElementById("userImg");
var configInput = document.getElementById("config");

SetUserName(usernameValue);
SetUserImg(bgImgUrl);
DrawDataEntries();

inputEl.onkeydown = (e) => {
    if (e.key == 'Enter') {
        PreventAndDo(e, HandleSearchBarEvent, []);
    }
}

function compare(a, b) { return !a ? 1 : !b ? -1 : a['name'] < b['name'] ? 1 : a['name'] > b['name'] ? -1 : 0 }

function PreventAndDo(e, callback, args) {
    e.preventDefault();
    callback.apply(this, args);
}

function IfKeyPreventAndDO(e, key, callback, args) { if (e.key == key) PreventAndDo(e, callback, args); }

function Search(baseUrl, value, replacer, exchanger) { window.open(`${baseUrl}${value.replace(replacer, exchanger)}`, "_Blank"); }

function IsSelectedInputSource() { return document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'; }

function IsVisible(el) { return el.style.display != "none" && el.style.visibility != "hidden"; }

function IsActive(el) { return el.style.display != 'none'; }

function IsAnyActive(els) { for (var i = 0; i < els.length; i++) { if (IsActive(els[i])) return true; } return false; }

function SetActive(el, visibleStyle, isActive = true) { el.style.display = el.style.display == 'none' && isActive ? visibleStyle : 'none'; return IsActive(el); }

function ExtractAndReset(el) {
    var value = el.value;
    el.value = "";
    return value;
}

function SetUserName(value) {
    usernameText.innerText = value;
    usernameValue = value;
    localStorage.setItem('clean-page-name', value);
}

function SetUserImg(value) {
    bgImgUrl = value;
    userImage.style.backgroundImage = `url(${value})`;
    localStorage.setItem('clean-page-img', value);
}

function ParseToHTML(htmlString) {
    var el = document.createElement('div');
    el.innerHTML = htmlString;
    return el.firstChild;
}

function Config() { return `CONFIG:\nname=${usernameValue}\nimg=${bgImgUrl}\n\nENTRIES:\n${dataEntries.map(e => `\nentryName=${e['name']}\nentryUrl=${e['url']}`).join('\n')}`}

function SaveConfig() {
    var split = configInput.value.split('\n');
    let nameValue;
    let imgValue;
    let cName;
    var newEntries = [];
    split.forEach(line => {
        if (line.startsWith('name=')) nameValue = line.replace('name=', '');
        else if (line.startsWith('img=')) imgValue = line.replace('img=', '');
        else if (line.startsWith('entryName=')) cName = line.replace('entryName=','');
        else if (line.startsWith('entryUrl=')) {
            var cUrl = line.replace('entryUrl=','')
            newEntries.push({ "name": cName, "url": cUrl });
        }
    });
    var entries = document.getElementsByClassName('entry');
    for (var i = entries.length - 1; i >= 0; i--) {
        entries[i].remove();
    }
    dataEntries = newEntries;
    localStorage.setItem('clean-page-links', JSON.stringify(dataEntries));
    SetUserName(usernameValue);
    SetUserImg(bgImgUrl);
    DrawDataEntries();
    usernameValue = nameValue;
    bgImgUrl = imgValue
}

function CloseAllWindows() {
    isOpen = false;
    ShowCreator(false);
    ShowConfig(false);
    RemoveMarkers();
}

function HandleSearchBarEvent() {
    var searchValue = ExtractAndReset(inputEl);
    if (searchValue.startsWith('setname')) SetUserName(searchValue.replace("setname ", ""));
    else if (searchValue.startsWith('setimg')) SetUserImg(searchValue.replace("setimg ", ''));
    else if (searchValue.startsWith("-r")) Search("https://reddit.com/r/", searchValue, "-r ", "");
    else if (searchValue.startsWith("-e7")) Search("https://epic7x.com/character/", searchValue, "-e7 ", "");
    else Search("https://duckduckgo.com/?q=", searchValue, /" "/g, "+");
}

function RemoveEntry(entry) {
    for (var i = 0; i < dataEntries.length; i++) {
        if (dataEntries[i].name == entry.innerText || dataEntries[i].name == entry.innerHTML) {
            dataEntries.splice(i, 1);
            localStorage.setItem('clean-page-links', JSON.stringify(dataEntries));
        }
    }
    entry.remove();
}

function DrawDataEntries() {
    var entries = document.getElementsByClassName('entry');
    for (var i = entries.length - 1; i >= 0; i--) { entries[i].remove(); }
    if (dataEntries.length > 1) dataEntries.sort(compare);
    dataEntries.forEach(entry => {
        var el = ParseToHTML(template.replace('{text}', entry["name"]), "text/html");
        entryHolder.prepend(el);
        el['url'] = entry['url'];
        el.onclick = (e) => { PreventAndDo(e, window.open, [el['url'], "_Blank"]); }
        el.onkeydown = (e) => { IfKeyPreventAndDO(e, 'Delete', RemoveEntry, [e.target]); }
    });
}

function ShowCreator(isActive = true) {
    if (SetActive(entryCreator, "inline-grid", isActive)) entryNameInput.focus();
    else inputEl.focus();
}

function ShowConfig(isActive = true) {
    var wasActive = IsActive(configInput);
    if (SetActive(configInput, 'block', isActive)) configInput.focus();
    if (isActive) configInput.value = Config();
    else if (wasActive) SaveConfig();
}

function AddEntry() {
    if (entryNameInput.value + entryUrlInput.value == '') return alert('Entry name cannot be empty');
    if (!entryUrlInput.value.startsWith('file://') && !entryUrlInput.value.startsWith('https://')) return alert('Entry url has to be valid');
    var entryName = ExtractAndReset(entryNameInput);
    var entryUrl = ExtractAndReset(entryUrlInput);
    for (var i = 0; i < dataEntries.length; i++) { if (dataEntries[i].name == entryName || dataEntries[i].url == entryUrl) return alert('Entry already exists'); }
    dataEntries.push({ "name": entryName, "url": entryUrl });
    localStorage.setItem('clean-page-links', JSON.stringify(dataEntries));
    ShowCreator(false);
    DrawDataEntries();
}

document.onkeydown = function(e) {
    if (e.key == 'Tab') return;
    if (e.key == 'Escape') { CloseAllWindows(); return; }
    if (!IsAnyActive([entryCreator, configInput]) && !IsSelectedInputSource()) {
        if (!isOpen) {
            IfKeyPreventAndDO(e, 'c', ShowConfig, [true]);
            IfKeyPreventAndDO(e, 's', inputEl.focus, []);
        }
        if (isOpen && e.key != 'f') PreventAndDo(e, AddToCurrent, [e.key]);
        if (e.key == 'f') {
            e.preventDefault();
            if (isOpen) RemoveMarkers();
            else CreateMarkers();
            isOpen = !isOpen;
        }
    }
};

function GetMarkerParent() { return GetMarker(current).nextSibling;}
function GetMarker(value) {
    var markers = document.getElementsByTagName("p");
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].innerText == value) {
            return markers[i];
        }
    }
}

function RemoveMarkers() {
    current = "";
    document.getElementById('kbw').innerText = current;
    var markers = document.getElementsByTagName("p");
    for (var i = markers.length - 1; i >= 0; i--) {
        if (markers[i].id == "kbwmarker-666-69-420") {
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
        if (!IsVisible(l[i])) return;
        var newText =  i >= alphabet.length ? `${secondary}${alphabet[i-alphabet.length]}` : `${letter}${alphabet[i]}`;
        var marker = ParseToHTML(`<p id="kbwmarker-666-69-420" style="color: var(--color0); background-color: var(--color2);">${newText}</p>`);
        l[i].parentElement.insertBefore(marker, l[i]);
        posY = l[i].getBoundingClientRect().top + document.documentElement.scrollTop;
        posX = l[i].getBoundingClientRect().left + document.documentElement.scrollLeft;
        marker.style.top = (posY - 30) + 'px';
        marker.style.left = (posX - 40) + 'px';
    }
}

function HighlightMarkers() {
    document.getElementById('kbw').innerText = current;
    var markers = document.getElementsByTagName("p");
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

function AddToCurrent(v) {
    if (!v) return;
    if (v == 'Backspace') current = current.slice(0, -1);
    current += v.length > 1 ? "" : v;
    HighlightMarkers();
    if (current.length > 1) {
        parent = GetMarkerParent();
        RemoveMarkers();
        isOpen = !isOpen;
        current = '';
        if (parent.tagName == 'INPUT') parent.focus();
        else parent.click();
    }
}