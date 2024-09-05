async function get_next_tops() {
    let response = await fetch("/api/topmanager/current_tops/");
    return await response.json();
}

async function get_next_sitzung() {
    let response = await fetch("/api/topmanager/next_sitzung/");
    return await response.json();
}

async function build_announcement(sitzung) {
    if (sitzung == null) {
        let template = document.getElementById("sitzung-template-no-sitzung");
        let clone = document.importNode(template, true);
        return clone.content;
    }

    let template = document.getElementById("sitzung-template");
    let clone = document.importNode(template, true);

    let date = new Date(sitzung.datum);
    let location = sitzung.location || "TBA";
    let type = sitzung.sitzung_type;

    let sitzungTitle;
    switch (type) {
        case "Normal":
            sitzungTitle = "Sitzung";
            break;
        case "VV":
            sitzungTitle = "Voll-Versammlung";
            break;
        case "WahlVV":
            sitzungTitle = "Wahl VV";
            break;
        case "Ersatz":
            sitzungTitle = "Ersatz Sitzung";
            break;
        case "Konsti":
            sitzungTitle = "Konstituierende Sitzung";
            break;
        case "Dringlichkeit":
            sitzungTitle = "Dringlichkeits Sitzung";
            break;
    }

    // fetch tops and sort them by weight
    let tops = await get_next_tops();
    tops.sort((a, b) => {
        return a.weight - b.weight;
    });

    let dateOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };

    let timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };

    // fill in title, date, time, and location
    clone.content.getElementById("title").innerHTML = sitzungTitle;

    clone.content.getElementById("date").innerHTML = date.toLocaleDateString(
        "de-DE",
        dateOptions,
    );

    clone.content.getElementById("clock").innerHTML = date.toLocaleTimeString(
        "de-DE",
        timeOptions,
    );

    clone.content.getElementById("location").innerHTML = location;

    // fill in the top list
    let topList = clone.content.getElementById("tops");

    let normalTops = tops.filter((top) => {
        return top.top_type != "sonstige";
    });

    let sonstigeTops = tops.filter((top) => {
        return top.top_type == "sonstige";
    });

    for (let i = 0; i < normalTops.length; i++) {
        let top = normalTops[i];
        let topIndex = i + 2;

        topList.innerHTML += "<li>Top " + topIndex + ": " + top.name + "</li>";
    }

    for (let i = 0; i < sonstigeTops.length; i++) {
        let top = sonstigeTops[i];
        let topIndex = i + normalTops.length + 2;

        topList.innerHTML += "<li>Top " + topIndex + ": " + top.name + "</li>";
    }

    return clone.content;
}

function init_sitzung_announcement() {
    let sitzungPromise = get_next_sitzung();
    html = "";
    sitzungPromise.then(async (sitzung) => {
        let announcement = await build_announcement(sitzung);
        let elements = document.getElementsByClassName("sitzung-announcement");

        for (var i = 0; i < elements.length; i++) {
            const append = document.importNode(announcement, true);
            elements[i].appendChild(append);
        }
    });
}
