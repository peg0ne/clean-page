var template = `<a class="link entry" href="">{text}</a>`;
var dataEntries = localStorage.getItem("clean-page-links") ?
    JSON.parse(localStorage.getItem("clean-page-links")) : [];
var bgImgUrl = localStorage.getItem("clean-page-img") ?
    localStorage.getItem("clean-page-img") :
    'https://external-preview.redd.it/opakdiLcvPEPEZTlN5GtN7EiO10KMXfHNeGXAhn1WwY.jpg?auto=webp&s=fd90024d17899799c9548ef3d651530e0d826331';
var usernameValue = localStorage.getItem("clean-page-name") ?
    localStorage.getItem("clean-page-name") :
    'setname <NAME>'

var entryCreator = document.getElementById("entryCreator");
var entryNameInput = document.getElementById("nameInput");
var entryUrlInput = document.getElementById("urlInput");
var entryHolder = document.getElementById("entryHolder");
var inputEl = document.getElementById("searchinputbar");
var usernameText = document.getElementById("usernameText");
var userImage = document.getElementById("userImg");

search_duck(`setimg ${bgImgUrl}`);
search_duck(`setname ${usernameValue}`);
drawDataEntries();

inputEl.onkeydown = (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        search_duck();
    }
}

function search_duck(val) {
    var searchValue = inputEl.value;
    if (val) searchValue = val;
    if (searchValue.startsWith('setname')) {
        var name = searchValue.replace("setname ", '')
        usernameText.innerText = name;
        localStorage.setItem('clean-page-name', name);
    } else if (searchValue.startsWith('setimg')) {
        var imgUrl = searchValue.replace("setimg ", '');
        userImage.style.backgroundImage = `url(${imgUrl})`;
        localStorage.setItem('clean-page-img', imgUrl);
    } else if (searchValue.startsWith("-r")) {
        searchValue = searchValue.replace("-r ", "");
        window.open("https://reddit.com/r/" + searchValue, "_Blank");
    } else if (searchValue.startsWith("-e7")) {
        searchValue = searchValue.replace("-e7 ", "");
        window.open("https://epic7x.com/character/" + searchValue, "_Blank");
    } else {
        searchValue = searchValue.replace(/" "/g, "+");
        window.open("https://duckduckgo.com/?q=" + searchValue, "_Blank");
    }
    inputEl.value = "";
}

function drawDataEntries() {
    if (dataEntries.length > 1) {
        dataEntries.sort(compare);
    }
    dataEntries.forEach(entry => {
        var el = parser(template.replace('{text}', entry["name"]), "text/html");
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
                    if (dataEntries[i].name == e.target.innerText) {
                        dataEntries.splice(i, 1);
                        localStorage.setItem('clean-page-links', JSON.stringify(dataEntries));
                    }
                }
                e.target.remove();
            }
        }
    });
}

function showCreator(isActive = true) {
    entryCreator.style.display = entryCreator.style.display == 'none' && isActive ? 'inline-grid' : 'none';
    if (entryCreator.style.display != 'none') {
        entryNameInput.focus();
    }
}

function addEntry() {
    var entryName = entryNameInput.value;
    var entryUrl = entryUrlInput.value;
    entryNameInput.value = '';
    entryUrlInput.value = '';
    if (entryName == '' || entryUrl == "") {
        alert('Entry name cannot be empty');
        return;
    }
    if (!entryUrl.startsWith('file://') && !entryUrl.startsWith('https://')) {
        alert('Entry url has to be valid');
        return;
    }
    for (var i = 0; i < dataEntries.length; i++) {
        if (dataEntries[i].name == entryName || dataEntries[i].url == entryUrl) {
            alert('Entry already exists');
            entryNameInput = '';
            entryUrlInput = '';
            return;
        }
    }
    dataEntries.push({ "name": entryName, "url": entryUrl });
    localStorage.setItem('clean-page-links', JSON.stringify(dataEntries));
    var entries = document.getElementsByClassName('entry');
    for (var i = entries.length - 1; i >= 0; i--) {
        entries[i].remove();
    }
    drawDataEntries();
}

function parser(htmlString) {
    var el = document.createElement('div');
    el.innerHTML = htmlString;
    return el.firstChild;
}

function compare(a, b) {
    if (!a) return 1;
    if (!b) return -1;
    if (a['name'] < b['name']) {
        return 1;
    }
    if (a['name'] > b['name']) {
        return -1;
    }
    return 0;
}