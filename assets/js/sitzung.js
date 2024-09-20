async function get_next_sitzung() {
    let now = new Date();
    let response = await fetch(
        "/api/sitzungen/first-after/?timestamp=" + now.toISOString(),
    );
    return await response.json();
}

function build_announcement(sitzung) {
    let template = document.getElementById("sitzung-template");
    let clone = document.importNode(template, true);

    let date = new Date(sitzung.datetime);
    let location = sitzung.location || "TBA";
    let type = sitzung.kind;

    let sitzungTitle;
    switch (type) {
        case "normal":
            sitzungTitle = "Sitzung";
            break;
        case "vv":
            sitzungTitle = "Voll-Versammlung";
            break;
        case "wahlvv":
            sitzungTitle = "Wahl VV";
            break;
        case "ersatz":
            sitzungTitle = "Ersatz Sitzung";
            break;
        case "konsti":
            sitzungTitle = "Konstituierende Sitzung";
            break;
        case "dringlichkeit":
            sitzungTitle = "Dringlichkeits Sitzung";
            break;
    }

    // fetch tops and sort them by weight
    let tops = sitzung.tops;

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
        return top.kind != "sonstige";
    });

    let sonstigeTops = tops.filter((top) => {
        return top.kind == "sonstige";
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
    sitzungPromise
        .then((sitzung) => {
            let announcement = build_announcement(sitzung);
            let elements = document.getElementsByClassName("sitzung-announcement");

            for (var i = 0; i < elements.length; i++) {
                const append = document.importNode(announcement, true);
                elements[i].appendChild(append);
            }
        })
        .catch(() => {
            let template = document.getElementById("sitzung-template-no-sitzung");

            let elements = document.getElementsByClassName("sitzung-announcement");

            for (var i = 0; i < elements.length; i++) {
                const append = document.importNode(template, true);
                elements[i].appendChild(append.content);
            }
        });
}
