var pagefind;

/**
 * initialize search for the given input and result elements.
 * expects an element <resultsID>.filter to place filter pills in
 * and an element <resultsID>.content to place the results in
 *
 * @param {string} searchID id of the box where the search query will be entered
 * @param {string} resultsID id of the box where results will be displayed
 * @param {number | undefined} resultLimit optional, if specified only shows that number of results
 */
async function initSearch(searchID, resultsID, resultLimit) {
    pagefind = await import("/pagefind/pagefind.js");

    const inputElement = document.getElementById(searchID);
    await generateFilter(searchID, resultsID);

    if (inputElement == null) {
        console.log("oh no " + searchID);
    }

    inputElement.addEventListener("input", async () => {
        await resetFilters(resultsID + ".filter");
        searchPage(inputElement.value, resultsID, resultLimit).await;
    });
}

/**
 * utility function to setup some event handlers to dismiss the result box
 * when escape is pressed, some other part is clicked or the page is scrolled
 *
 * @param {string} searchID id of the box where the search query is entered
 * @param {string} resultsID id of the box where results will be displayed
 */
function setupDismissHandlers(searchID, resultsID) {
    //close search results if clicked outside
    document.addEventListener("click", function(event) {
        if (
            !event.target.closest("#" + resultsID) &&
            !event.target.closest("#" + searchID)
        ) {
            document.getElementById(resultsID).style.display = "none";
        }
    });

    //close search results if scrolled
    document.addEventListener("scroll", function() {
        document.getElementById(resultsID).style.display = "none";
    });

    //close search results if esc key is pressed
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            document.getElementById(resultsID).style.display = "none";
        }
    });
}

/**
 * search the page for the given query and insert results in the element with the given id.
 * expects an element <resultsID>.content to place results in
 *
 * @param {string} query the query to search. if empty, the result box will be automatically hidden
 * @param {string} resultID id of the element to place results in
 * @param {number | undefined} resultLimit optional, if specified only show this amount of results
 *
 */
async function searchPage(query, resultID, resultLimit) {
    var search_results = document.getElementById(resultID);
    var search_results_content = document.getElementById(resultID + ".content");

    // if we receive an empty query we hide the result box since the user
    // has most likely deleted their previous query
    if (query === "") {
        search_results.style.display = "none";
        return;
    }

    const filter = getSelectedFilters(resultID);

    // Search for the query
    const search = await pagefind.debouncedSearch(
        query,
        {
            sort: {
                date: "desc",
            },
            filters: filter,
        },
        300,
    );

    if (search == null) {
        return;
    }

    var results;

    if (resultLimit !== undefined) {
        results = await Promise.all(search.results.map((r) => r.data()));
    } else {
        results = await Promise.all(
            search.results.slice(0, resultLimit).map((r) => r.data()),
        );
    }

    if (results.length === 0) {
        search_results.style.display = "flex";
        search_results_content.innerHTML = "No results found";
        return;
    }

    search_results.style.display = "flex";
    search_results_content.innerHTML = "";

    for (let i = 0; i < results.length; i++) {
        const thisresult = results[i];
        var div = document.createElement("div");
        var a = document.createElement("a");
        a.href = thisresult.url;
        a.innerHTML = thisresult.meta.title;

        var content = document.createElement("p");
        content.innerHTML = thisresult.excerpt;

        div.classList.add("card");
        div.classList.add("search-result");

        div.appendChild(a);
        div.appendChild(content);
        search_results_content.appendChild(div);
    }

    if (document.getElementById("fullSearchLoading") !== null) {
        document.getElementById("fullSearchLoading").style.display = "none";
    }

    return results;
}

/**
 * returns a list of filters pagefind was able to detect
 */
async function getAvailableFilters() {
    let filters = await pagefind.filters();
    return filters;
}

/**
 * resets the filter with the given id to its default value
 *
 * @param {string} filterID id of the filter select element
 */
async function resetFilters(filterID) {
    let filters = document.getElementById(filterID);

    for (let i = 0; i < filters.getElementsByTagName("select").length; i++) {
        filters.getElementsByTagName("select")[i].selectedIndex = 0;
    }
}

function getSelectedFilters(resultID) {
    let filter = document.getElementById(resultID + ".filter");
    let dropdown = filter.getElementsByTagName("select")[0];

    let selected = dropdown.options[dropdown.selectedIndex].value;

    if (selected === "all") {
        return {};
    }

    // hack to get the type of the filter.
    let filter_type = dropdown.parentElement
        .getElementsByTagName("h3")[0]
        .innerHTML.toLowerCase();

    let filters = {};
    filters[filter_type] = selected;

    return filters;
}

/**
 * generate filter pills for filters pagefind was able to find.
 * expects an element <resultsID>.filter to place filter pills in
 *
 * @param {string} searchID id of the element the query will be entered in
 * @param {string} resultsID id of the element the results will be placed in
 */
async function generateFilter(searchID, resultsID) {
    let filters = await getAvailableFilters();
    let filter = document.getElementById(resultsID + ".filter");
    let dropdown = document.createElement("select");

    dropdown.appendChild(new Option("All", "all"));

    //iterate over json object
    for ([key, value] of Object.entries(filters)) {
        let h3 = document.createElement("h3");
        h3.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);

        filter.appendChild(h3);
        for ([keys, values] of Object.entries(value)) {
            let option = document.createElement("option");
            option.value = keys;
            option.innerHTML = keys.charAt(0).toUpperCase() + keys.slice(1);
            dropdown.appendChild(option);
        }
    }

    //select all by default
    for (let i = 0; i < dropdown.options.length; i++) {
        if (dropdown.options[i].value === "all") {
            dropdown.selectedIndex = i;
            break;
        }
    }

    // if the selected filter changes, redo the search
    dropdown.onchange = function() {
        searchPage(document.getElementById(searchID).value, resultsID);
    };

    filter.appendChild(dropdown);
}

function toggleMobileSearch() {
    var search = document.getElementById("modal-search");
    var body = document.getElementsByTagName("body")[0];

    if (search.style.display === "none" || search.style.display === "") {
        search.style.display = "block";
        body.classList.add("modal-open");
    } else {
        search.style.display = "none";
        body.classList.remove("modal-open");
    }
}
