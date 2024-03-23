async function get_next_tops() {
    let html = "";
    let response = await fetch("/api/topmanager/current_tops");
    let tops = await response.json();
    html += "<ul>";
    tops.forEach((top) => {
        html += "<li> Top " + top.position + ": " + top.name + "</li>";
    });
    html += "</ul>";
    return html;
}

async function get_next_sitzung() {
    let response = await fetch("/api/topmanager/next_sitzung");
    if (response.status != 200) {
        cal;
        return "Keine Sitzung gefunden";
    }
    let sitzung = await response.json();
    return sitzung;
}

function build_next_sitzung_announcement() {
    let sitzungPromise = get_next_sitzung();
    html = "";
    sitzungPromise.then(async (sitzung) => {
        if (sitzung == "Keine Sitzung gefunden") {
            document.getElementById("next-sitzung-announcement").innerHTML =
                "<h4>Keine Sitzung angekündigt</h4>";
            return;
        }
        let tops = await get_next_tops();
        let announcement = document.getElementById("next-sitzung-announcement");
        let date = new Date(sitzung.datum);
        let options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        html += "<h2>Sitzung:</h2>";
        html +=
            "<span>" + date.toLocaleTimeString("de-DE", options) + "</span>";
        html += "<h3>Tops:</h3>";
        html += tops;
        announcement.innerHTML = html;
    });
}
