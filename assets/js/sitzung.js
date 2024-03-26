async function get_next_tops() {
    let html = "";
    let response = await fetch("/api/topmanager/current_tops");
    let tops = await response.json();
    html += "<ul style='list-style:none; padding-left:.5em'>";
    tops.forEach((top) => {
        html += "<li>Top " + top.position + ": " + top.name + "</li>";
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
        let dateOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            //no time
        };

        let timeOptions = {
            hour: "2-digit",
            minute: "2-digit",
        };
        html += "<h3>Sitzung</h2>";
        html +=
            '<span> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-month"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /> <path d="M16 3v4" /> <path d="M8 3v4" /> <path d="M4 11h16" /> <path d="M7 14h.013" /> <path d="M10.01 14h.005" /> <path d="M13.01 14h.005" /> <path d="M16.015 14h.005" /> <path d="M13.015 17h.005" /> <path d="M7.01 17h.005" /> <path d="M10.01 17h.005" /> </svg>' + date.toLocaleDateString("de-DE", dateOptions) + "</span>";
        html +=
            '<span> <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clock"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /> <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /> <path d="M12 7v5l3 3" /> </svg>' + date.toLocaleTimeString("de-DE", timeOptions) + "</span>";
        html += "<h4>Tops</h3>";
        html += tops;
        announcement.innerHTML = html;
    });
}
