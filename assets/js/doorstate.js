let doorstate = fetch("/api/doorstate/");

doorstate.then(async (response) => {
    let doorstate = await response.json();
    let state = doorstate.state;
    let door = document.getElementsByClassName("fs_status");

    for (let i = 0; i < door.length; i++) {
        if (state === true) {
            door[i].innerHTML = "<span class='dot green'></span>";
        } else {
            door[i].innerHTML = "<span class='dot red'></span>";
        }
    }
});
