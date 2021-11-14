var template = `<a class="link" href="">{text}</a>`;
var dataEntries = localStorage.getItem("clean-page-links") ?
    JSON.parse(localStorage.getItem("clean-page-links")) : [{ "name": "test", "url": "file:///C:/Users/Olive/git-repos/start-page/index.html" }];


var entryCreator = document.getElementById("entryCreator");
var entryNameInput = document.getElementById("nameInput");
var entryUrlInput = document.getElementById("urlInput");
var entryHolder = document.getElementById("entryHolder");
var inputEl = document.getElementById("searchinputbar");

drawDataEntries();

document.onkeydown = (e) => {
    if (e.key == 'Escape') {
        showCreator(false)
    }
}

inputEl.onkeydown = (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        search_duck();
    }
}

function search_duck() {
    var searchValue = inputEl.value;
    if (searchValue.startsWith("-e7")) {
        searchValue = searchValue.replace("-e7 ", "");
        inputEl.value = "";
        window.open("https://epic7x.com/character/" + searchValue, "_Blank");
    } else {
        inputEl.value = "";
        searchValue = searchValue.replace(/" "/g, "+");
        window.open("https://duckduckgo.com/?q=" + searchValue, "_Blank");
    }
}

function drawDataEntries() {
    dataEntries.forEach(entry => {
        var el = parser(template.replace('{text}', entry["name"]), "text/html");
        entryHolder.prepend(el);
        el['url'] = entry['url'];
        el.onclick = (e) => {
            e.preventDefault();
            window.open(el['url'], "_Blank");
        }
    });
}

function showCreator(isActive = true) {
    entryCreator.style.display = entryCreator.style.display == 'none' && isActive ? 'inline-grid' : 'none';
    if (entryCreator.style.display != 'none') {
        entryNameInput.focus();
    }
}

function parser(htmlString) {
    var el = document.createElement('div');
    el.innerHTML = htmlString;
    return el.firstChild;
}