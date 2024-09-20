async function get_doorstate() {
    // let response = await fetch(
    //     "/api/doorstate/"
    // );
    return true;
    // return await response.json().is_open;
}

function init_doorstate() {
    let div = document.getElementById("doorstate");
    let doorstate = get_doorstate();
    if (doorstate)
        div.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\"  width=\"1em\"  height=\"1em\"  viewBox=\"0 0 24 24\"  fill=\"none\"  stroke=\"currentColor\"  stroke-width=\"2\"  stroke-linecap=\"round\"  stroke-linejoin=\"round\"  class=\"icon icon-tabler icons-tabler-outline icon-tabler-lock-open\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z\" /><path d=\"M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /><path d=\"M8 11v-5a4 4 0 0 1 8 0\" /></svg>"
    else 
        div.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\"  width=\"1em\"  height=\"1em\"  viewBox=\"0 0 24 24\"  fill=\"none\"  stroke=\"currentColor\"  stroke-width=\"2\"  stroke-linecap=\"round\"  stroke-linejoin=\"round\"  class=\"icon icon-tabler icons-tabler-outline icon-tabler-lock\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z\" /><path d=\"M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0\" /><path d=\"M8 11v-4a4 4 0 1 1 8 0v4\" /></svg>"
}
