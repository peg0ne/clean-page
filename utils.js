function compare(a, b) { return !a ? 1 : !b ? -1 : a['name'] < b['name'] ? 1 : a['name'] > b['name'] ? -1 : 0 }

function Search(baseUrl, value, replacer, exchanger) { window.open(`${baseUrl}${value.replace(replacer, exchanger)}`, "_Blank"); }

function IsSelectedInputSource() { return document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'; }

function IsVisible(el) { return el.style.display != "none" && el.style.visibility != "hidden"; }

function IsActive(el) { return el.style.display != 'none'; }

function IsAnyActive(els) { for (var i = 0; i < els.length; i++) { if (IsActive(els[i])) return true; } return false; }

function SetActive(el, visibleStyle, isActive = true) { el.style.display = el.style.display == 'none' && isActive ? visibleStyle : 'none'; return IsActive(el); }

function IfKeyPreventAndDO(e, key, callback, args = []) { if (e.key == key) PreventAndDo(e, callback, args); }

function PreventAndDo(e, callback, args = []) {
    e.preventDefault();
    callback.apply(this, args);
}

function ExtractAndReset(el) {
    var value = el.value;
    el.value = "";
    return value;
}

function ParseToHTML(htmlString) {
    var el = document.createElement('div');
    el.innerHTML = htmlString;
    return el.firstChild;
}