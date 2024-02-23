var enableDarkmode = false;

if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    enableDarkmode = true;
}

if (document.cookie.includes("theme")) {
    if (document.cookie.includes("theme=dark")) {
        enableDarkmode = true;
    } else {
        enableDarkmode = false;
    }
}

const element = document.getElementById("theme");
if (enableDarkmode) {
    element.setAttribute("data-bs-theme", "dark");
} else {
    element.setAttribute("data-bs-theme", "light");
}

function toggle_dark_mode() {
    var element = document.getElementById("theme");

    if (element.getAttribute("data-bs-theme") == "light") {
        element.setAttribute("data-bs-theme", "dark");
        document.cookie = "theme=dark; path=/";
    } else {
        element.setAttribute("data-bs-theme", "light");
        document.cookie = "theme=light; path=/";
    }
}
