function SetActive(el, activeDisplay, isActive) { el.style.display = el.style.display == 'none' && isActive ? activeDisplay : 'none'; }

function IsActive(el) { return el.style.display != 'none'; }

function IsActiveInput() { return document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'; }

function IsVisible(el) { return el.style.visibility != 'hidden'; }

function IsSome(value) { return value ? true : false }

function IsEmpty(value) { return !value || value == ""; }

function IsValidUrl(value) { return value && value.startsWith('file:///') || value && value.startsWith('https://'); }

function Compare(a, b) { return !a ? 1 : !b ? -1 : a['name'] < b['name'] ? 1 : a['name'] > b['name'] ? -1 : 0 }

function OpenInNewTab(base, value) { window.open(`${base}${value}`, "_Blank"); }

function ShowPopUp(el, activeDisplay, isActive) { SetActive(el, activeDisplay, isActive); return IsActive(el); }

function ParseToHTML(htmlString) {
    var el = document.createElement('div');
    el.innerHTML = htmlString;
    return el.firstChild;
}

function Search(searchValue) {
    if (searchValue.startsWith("-r")) OpenInNewTab("https://reddit.com/r/", searchValue.replace("-r ", ""));
    else if (searchValue.startsWith("-e7")) OpenInNewTab("https://epic7x.com/character/", searchValue.replace("-e7 ", ""));
    else OpenInNewTab("https://duckduckgo.com/?q=", searchValue.replace(/" "/g, "+"));
}

function IsAnySelected(elements = []) {
    for (var i = 0; i < elements.lenght; i++) { if (document.activeElement == elements[i]) return true; }
    return false;
}