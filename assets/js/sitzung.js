async function build_all_sitzungen(sitzungKind) {
  let data = await fetch("/api/sitzungen/after?timestamp=1970-01-01T00:00:00Z");
  let sitzungen = data.json();

  /**
   * Fetches the calendar data from the server and generates the calendar cards.
   * The calendar cards are then appended to the calendar-body.
   */

  document.getElementById("calendar-body").innerHTML = "";
  sitzungen.then(async (sitzungen) => {
    console.log(sitzungen);
    for (let sitzung of sitzungen) {
      //kind mapping
      let type = sitzung.kind;
      if (sitzungKind && sitzungKind !== type) {
        continue;
      }
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

      let description = "Tagesordnungspunkte:<ul>";

      for (let top of sitzung.tops) {
        description += "<li>" + top.name;
        if (top.anträge.length > 0) {
          description += "<ul>";
          for (let antrag of top.anträge) {
            description += "<li>" + antrag.titel + "</li>";
          }
          description += "</ul>";
        }
        description += "</li>";
      }

      description += "</ul>";

      let event = {
        start: sitzung.datetime,
        summary: sitzungTitle,
        location: sitzung.location,
        description: description,
      };
      let card = await generateCalendarCard(event);
      document.getElementById("calendar-body").appendChild(card);
    }
  });
}

async function build_sitzungs_filter() {
  let data = await fetch("/api/sitzungen/after?timestamp=1970-01-01T00:00:00Z");
  let sitzungen = data.json();
  sitzungen.then(async (sitzungen) => {
    let filter = document.getElementById("sitzungs-filter");
    let types = new Map();
    for (let sitzung of sitzungen) {
      let sitzungTitle;
      switch (sitzung.kind) {
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
      types.set(sitzung.kind, sitzungTitle);
    }
    let button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-outline-primary");
    button.innerHTML = "Alle";
    button.onclick = function () {
      build_all_sitzungen();
    };
    filter.appendChild(button);
    for (let [key, value] of types) {
      let button = document.createElement("button");
      button.classList.add("btn");
      button.classList.add("btn-outline-primary");
      button.innerHTML = value;
      button.onclick = function () {
        build_all_sitzungen(key);
      };
      filter.appendChild(button);
    }
  });
}

async function get_next_sitzungen() {
  let time = new Date();
  time.setTime(time.getTime() - 2 * 60 * 60 * 1000);

  let response = await fetch(
    "/api/sitzungen/after?timestamp=" + time.toISOString(),
  );
  return await response.json();
}

function build_announcement(sitzung) {
  let template = document.getElementById("sitzung-template");
  let clone = document.importNode(template, true);

  let date = new Date(sitzung.datetime);
  console.log(sitzung.datetime);
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
  let sitzungenPromise = get_next_sitzungen();
  sitzungenPromise
    .then((sitzungen) => {
      if (sitzungen.length == 0) {
        let template = document.getElementById("sitzung-template-no-sitzung");
        let elements = document.getElementsByClassName("sitzung-announcement");
        for (var i = 0; i < elements.length; i++) {
          const append = document.importNode(template, true);
          elements[i].appendChild(append.content);
        }
      }
      for (let sitzung of sitzungen) {
        let announcement = build_announcement(sitzung);
        let elements = document.getElementsByClassName("sitzung-announcement");
        for (var i = 0; i < elements.length; i++) {
          const append = document.importNode(announcement, true);
          elements[i].appendChild(append);
        }
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
