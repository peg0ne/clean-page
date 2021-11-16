var template = `<a class="link entry" href="">{text}</a>`;
var kbwtemplate = `<p id="kbwmarker-666-69-420" style="background-color: var(--color2); color: var(--color0)">{text}</p>`;
var dataEntries = localStorage.getItem("clean-page-links") ?
    JSON.parse(localStorage.getItem("clean-page-links")) : [];
var bgImgUrl = localStorage.getItem("clean-page-img") ?
    localStorage.getItem("clean-page-img") :
    '';
var usernameValue = localStorage.getItem("clean-page-name") ?
    localStorage.getItem("clean-page-name") :
    'undefined'

var entryCreator = document.getElementById("entryCreator");
var entryNameInput = document.getElementById("nameInput");
var entryUrlInput = document.getElementById("urlInput");
var entryHolder = document.getElementById("entryHolder");
var inputEl = document.getElementById("searchinputbar");
var usernameText = document.getElementById("usernameText");
var userImage = document.getElementById("userImg");
var configInput = document.getElementById("config");
var isOpen = false;
var current = "";
var alphabet = ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'];

SetUserName(usernameValue);
SetUserImg(bgImgUrl);
DrawDataEntries();

inputEl.onkeydown = (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        HandleSearchBarEvent();
    }
}

document.onkeydown = function(e) {
    if (e.key == 'Tab') return;
    else e.preventDefault();
    if (e.key != 'f' && e.key != 'Escape' && e.key != 'Tab' && isOpen) AddToCurrent(e.key);
    else if (e.key.match(/^(Escape|c|s|f)$/)) {
        if (e.key == 'Escape') CloseAll();
        else if (e.key == 'c' && !isOpen && !IsActiveInput()) ShowConfig();
        else if (e.key == 's' && !isOpen && !IsActiveInput()) inputEl.focus();
        else if (e.key == 'f' && !IsActiveInput()) {
            if (isOpen) RemoveMarkers();
            else CreateMarkers();
        }
    }
};

function GetEntryInputValues() {
    return (entryNameInput.value, entryUrlInput.value);
}

function ClearInputValues() {
    entryNameInput.value = '';
    entryUrlInput.value = '';
}

function SetUserName(name) {
    usernameText.innerText = name;
    usernameValue = name;
    localStorage.setItem('clean-page-name', name);
}

function SetUserImg(imgUrl) {
    bgImgUrl = imgUrl;
    userImage.style.backgroundImage = `url(${imgUrl})`;
    localStorage.setItem('clean-page-img', imgUrl);
}

function GetConfig() {
    return `CONFIG:\nname=${usernameValue}\nimg=${bgImgUrl}\n\nENTRIES:\n${dataEntries.map(e => `\nentryName=${e['name']}\nentryUrl=${e['url']}`).join('\n')}`;
}

function WriteConfig() {
    var split = configInput.value.split('\n');
    let nameValue;
    let imgValue;
    let cName;
    var newEntries = [];
    split.forEach(line => {
        if (line.startsWith('name=')) nameValue = line.replace('name=', '');
        else if (line.startsWith('img=')) imgValue = line.replace('img=', '');
        else if (line.startsWith('entryName=')) cName = line.replace('entryName=', '');
        else if (line.startsWith('entryUrl=')) {
            var cUrl = line.replace('entryUrl=', '')
            newEntries.push({ "name": cName, "url": cUrl });
        }
    });
    var entries = document.getElementsByClassName('entry');
    for (var i = entries.length - 1; i >= 0; i--) {
        entries[i].remove();
    }
    dataEntries = newEntries;
    localStorage.setItem('clean-page-links', JSON.stringify(dataEntries));
    SetUserName(nameValue);
    SetUserImg(imgValue);
    DrawDataEntries();
}

function EntryExists(entryName, entryUrl) {
    for (var i = 0; i < dataEntries.length; i++) {
        if (dataEntries[i].name == entryName || dataEntries[i].url == entryUrl) {

            entryNameInput = '';
            entryUrlInput = '';
            return true;
        }
    }
    return false;
}

function AddEntry(entryName, entryUrl) {
    dataEntries.push({ "name": entryName, "url": entryUrl });
    localStorage.setItem('clean-page-links', JSON.stringify(dataEntries));
    var entries = document.getElementsByClassName('entry');
    for (var i = entries.length - 1; i >= 0; i--) {
        entries[i].remove();
    }
}

function ConfirmEntry() {
    var entryName, entryUrl = GetEntryInputValues();
    if (IsEmpty(entryName) || IsEmpty(entryUrl)) return alert('Entry name cannot be empty');
    else if (IsValidUrl(entryUrl)) return alert('Entry url has to be valid');
    else if (EntryExists(entryName, entryUrl)) return alert('Entry already exists');
    AddEntry(entryName, entryUrl);
    ClearInputValues();
    ShowCreator(false);
    DrawDataEntries();
}

function HandleSearchBarEvent(val) {
    var searchValue = inputEl.value;
    if (val) searchValue = val;
    if (searchValue.startsWith('setname')) {
        SetUserName(searchValue.replace("setname ", ''));
    } else if (searchValue.startsWith('setimg')) {
        SetUserImg(searchValue.replace("setimg ", ''));
    } else {
        Search();
    }
    inputEl.value = "";
}

function DrawDataEntries() {
    if (dataEntries.length > 1) {
        dataEntries.sort(Compare);
    }
    dataEntries.forEach(entry => {
        var el = ParseToHTML(template.replace('{text}', entry["name"]), "text/html");
        entryHolder.prepend(el);
        el['url'] = entry['url'];
        el.onclick = (e) => {
            e.preventDefault();
            window.open(el['url'], "_Blank");
        }
        el.onkeydown = (e) => {
            if (e.key == 'Delete') {
                e.preventDefault();
                for (var i = 0; i < dataEntries.length; i++) {
                    if (dataEntries[i].name == e.target.innerText || dataEntries[i].name == e.target.innerHTML) {
                        dataEntries.splice(i, 1);
                        localStorage.setItem('clean-page-links', JSON.stringify(dataEntries));
                    }
                }
                e.target.remove();
            }
        }
    });
}

function ShowConfig(isActive = true) {
    var wasActive = IsActive(configInput);
    if (ShowPopUp(configInput, 'block', isActive)) {
        configInput.focus();
    }
    if (isActive) {
        configInput.value = GetConfig();
    } else if (wasActive) {
        WriteConfig();
    }
}

function ShowCreator(toggle = true) {
    SetActive(entryCreator, 'inline-grid', toggle);
    if (IsActive(entryCreator)) {
        entryNameInput.focus();
    } else {
        inputEl.focus();
    }
}

function CloseAll() {
    ShowCreator(false);
    ShowConfig(false);
    RemoveMarkers();
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

function GetMarkerOwner() {
    var markers = document.getElementsByTagName('p');
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].innerText == current) {
            return markers[i].nextSibling;
        }
    }
}

function CreateMarkers() {
    isOpen = true;
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
    if (!v || v.length > 1 && v != 'Backspace')
        return;
    else if (v == 'Backspace')
        current = current.slice(0, -1);
    else if (current.length <= 1)
        current += v;
    if (current.length > 1) {
        var owner = GetMarkerOwner();
        RemoveMarkers();
        if (owner.tagName == 'INPUT')
            owner.focus();
        else
            owner.click();
    }
    HighlightMarkers();
}