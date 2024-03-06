let calendarPromise = fetchCalendarJson("/calendar/");

/**
 * Fetches the calendar data from the server and generates the calendar cards.
 * The calendar cards are then appended to the calendar-body.
 */
calendarPromise.then((calendar) =>
    calendar
        .map(generateCalendarCard)
        .forEach((node) =>
            document.getElementById("calendar-body").appendChild(node)
        )
);

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
function generateCalendarCard(event) {
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
    clone.content.getElementById("location").innerHTML = event.location;

    return clone.content;
}
