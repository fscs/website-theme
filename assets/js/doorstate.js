async function get_doorstate() {
    let response = await fetch(
        "/api/doorstate/"
    );
    return await response.json().is_open;
}

async function init_doorstate() {
    let div = document.getElementById("doorstate");
    let doorstate = await get_doorstate();
    if (doorstate) {
        div.innerHTML = document.getElementById("doorstate_open").innerHTML;
    } else {
        div.innerHTML = document.getElementById("doorstate_closed").innerHTML;
    }
}
