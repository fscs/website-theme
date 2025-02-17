async function get_doorstate() {
    let response = await fetch("/api/doorstate");
    let json = await response.json();
    return json.is_open;
}

async function init_doorstate() {
    let elements = document.getElementsByClassName("doorstate");
    let is_open = await get_doorstate();

    let icon_id = is_open ? "doorstate-open" : "doorstate-closed";
    let icon = document.getElementById(icon_id);

    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = icon.innerHTML;
    }
}
