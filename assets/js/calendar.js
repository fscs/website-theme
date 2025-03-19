function build_calendar(url) {
  let calendarPromise = fetchCalendarJson(url);

  /**
   * Fetches the calendar data from the server and generates the calendar cards.
   * The calendar cards are then appended to the calendar-body.
   */
  calendarPromise.then(async (calendar) => {
    for (let event of calendar) {
      let card = await generateCalendarCard(event);
      document.getElementById("calendar-body").appendChild(card);
    }
  });
}

/**
 * Fetches the calendar data from the backend
 * @param {*} url The url to the calendar json
 */
async function fetchCalendarJson(url) {
  let data = await fetch(url);
  return await data.json();
}

/**
 * Generates a calendar card for the given event
 * @param {*} event The event to generate the card for
 * @returns The generated calendar card as html
 * using the predefined template at website-theme/layouts/partials/calendar.html
 */
async function generateCalendarCard(event) {
  let template = document.getElementById("calendar-card-template");
  let clone = document.importNode(template, true);

  let start_date = new Date(event.start);

  clone.content.getElementById("heading").innerHTML = event.summary;
  clone.content.getElementById("date").innerHTML =
    start_date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  clone.content.getElementById("clock").innerHTML =
    start_date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  clone.content
    .getElementById("open-calendar")
    .setAttribute("data-bs-cal-title", event.summary);
  clone.content
    .getElementById("open-calendar")
    .setAttribute("data-bs-cal-location", event.location);

  clone.content
    .getElementById("open-calendar")
    .setAttribute("data-bs-cal-desc", event.description);

  clone.content.getElementById("open-calendar").setAttribute(
    "data-bs-cal-date",
    start_date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  );

  clone.content.getElementById("open-calendar").setAttribute(
    "data-bs-cal-time",
    start_date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  clone.content.getElementById("location").innerHTML = event.location;

  return clone.content;
}

function init_cal_modal(id) {
  var calendarModal = document.getElementById(id);

  calendarModal.addEventListener("show.bs.modal", async function (event) {
    var button = event.relatedTarget;
    var title = button.getAttribute("data-bs-cal-title");
    var date = button.getAttribute("data-bs-cal-date");
    var time = button.getAttribute("data-bs-cal-time");
    var location = button.getAttribute("data-bs-cal-location");
    var description = button.getAttribute("data-bs-cal-desc");

    if (description === "null") {
      description = "Keine Beschreibung verfügbar";
    }

    var modalTitle = calendarModal.querySelector(".modal-title");
    var modalDate = calendarModal.querySelector(".modal-calendar-date");
    var modalTime = calendarModal.querySelector(".modal-calendar-time");
    var modalLocation = calendarModal.querySelector(".modal-calendar-location");

    var modalDescription = calendarModal.querySelector(
      ".modal-calendar-description",
    );

    modalTitle.textContent = title;
    modalDate.textContent = date;
    modalTime.textContent = time;
    modalLocation.textContent = location;
    modalDescription.innerHTML = description;
  });
}
