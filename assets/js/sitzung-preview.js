
function build_sitzung_preview(sitzung) {
  let top_template = document.getElementById("top-template");
  let antrags_template = document.getElementById("antrags-template");
 
  let date = new Date(sitzung.datetime);
  let location = sitzung.ort || "TBA";
  let antragsfrist = new Date(sitzung.antragsfrist);
  let type = sitzung.typ;

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

  let dateAndTimeOptions = {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };


  document.querySelector("#sitzungstitel").textContent = sitzungTitle;

  document.querySelector("#date").textContent = date.toLocaleDateString(
    "de-DE",
    dateOptions,
  );

  document.querySelector("#time").textContent = date.toLocaleTimeString(
    "de-DE",
    timeOptions,
  );

  document.querySelector("#location").textContent = location;


  // fill in the top list
  let topList = document.querySelector("#tops");

  let normalTops = tops.filter((top) => {
    return top.typ != "sonstige";
  });

  let sonstigeTops = tops.filter((top) => {
    return top.typ == "sonstige";
  });

  for (let i = 0; i < normalTops.length; i++) {
    let top = normalTops[i];
    let top_element = document.importNode(top_template, true);
    let topIndex = i + 2;

    top_element.content.getElementById("top-titel").textContent = "Top " + topIndex + ": " + top.name + "";
    topList.appendChild(top_element.content);

    for (const antrag of top.antraege) {
      let antrag_element = document.importNode(antrags_template, true);

      antrag_element.content.getElementById("antrags-titel").textContent = "Antrag: " + antrag.titel;
      antrag_element.content.getElementById("antrags-text").textContent = antrag.antragstext;
      antrag_element.content.getElementById("antrags-begruendung").textContent = antrag.begruendung;
      topList.appendChild(antrag_element.content);
    }
  }

  for (let i = 0; i < sonstigeTops.length; i++) {
    let top = sonstigeTops[i];
    let topIndex = i + normalTops.length + 2;

    top_element.content.getElementById("top-titel").textContent = "Top " + topIndex + ": " + top.name + "";
    topList.appendChild(top_element.content);
  }
}

async function init_sitzung_preview(url) {
  const urlParams = new URLSearchParams(window.location.search);
  const sitzung_id = urlParams.get('sitzung_id');
  const sitzung = await fetch(url + sitzung_id).then(s => s.json());

  build_sitzung_preview(sitzung);
}
