var element = document.getElementById("theme");
var enableDarkmode = false;

if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    enableDarkmode = true;
}

var themeData = getCookieData("theme");
if (themeData == "dark") {
    enableDarkmode = true;
}
if (themeData == "light") {
    enableDarkmode = false;
}

if (enableDarkmode) {
    element.setAttribute("data-bs-theme", "dark");
} else {
    element.setAttribute("data-bs-theme", "light");
}

function toggle_dark_mode() {
    var element = document.getElementById("theme");

    if (element.getAttribute("data-bs-theme") == "light") {
        element.setAttribute("data-bs-theme", "dark");
        setCookie("theme", "dark", 365);
    } else {
        element.setAttribute("data-bs-theme", "light");
        setCookie("theme", "light", 365);
    }
}
