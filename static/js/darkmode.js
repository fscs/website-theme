
init();
function init() {
    // check if the user has a theme cookie
    if (document.cookie.includes("theme")) {
        console.log("cookie found");
        var element = document.getElementById("theme");
        if (document.cookie.includes("theme=dark")) {
            element.setAttribute("data-bs-theme", "dark");
        } else {
            element.setAttribute("data-bs-theme", "light");
        }
    }else{
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            var element = document.getElementById("theme");
            element.setAttribute("data-bs-theme", "dark");
        }
    }
}


function toggle_dark_mode() {
    document.cookie = "theme=light";
    var element = document.getElementById("theme");
    if (element.getAttribute("data-bs-theme") == "light") {
        element.setAttribute("data-bs-theme", "dark");
        document.cookie = "theme=dark; path=/";
    } else {
        element.setAttribute("data-bs-theme", "light");
        document.cookie = "theme=light; path=/";
    }
}
