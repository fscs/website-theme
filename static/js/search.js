
var pagefind;
async function initSearch(query, searchID, resultsID) {
    pagefind = await import("/pagefind/pagefind.js");

    const inputElement = document.getElementById(searchID);
    await generateFilter(searchID, resultsID);

    inputElement.addEventListener('input', async () => {
        await resetFilters(resultsID + ".filter")
        searchPage(inputElement.value, resultsID).await;
    })

    if (query !== "") {
        searchPage(query, resultsID);
        inputElement.value = query;
    }
}

async function resetFilters(filterID) {
    let filters = document.getElementById(filterID);

    for (let i = 0; i < filters.getElementsByTagName("select").length; i++) {
        filters.getElementsByTagName("select")[i].selectedIndex = 0;
    }
}


async function searchPage(query, resultID) {
    pagefind.preload(query);

    var filter = getSelectedFilters(resultID);
    var search_results = document.getElementById(resultID);
    var search_results_content = document.getElementById(resultID + ".content");
    
    // Search for the query
    const search = await pagefind.debouncedSearch(query, {
        sort: {
            date: "desc"
        },
        filters: filter
    }, 300);

    if (search !== null) {
        // Get the first 5 results
        const fiveResults = await Promise.all(search.results.slice(0, 5).map(r => r.data()));

        // Display the results
        if (query === "") { 
            search_results.style.display = "none"; 
            return;
        }
        if (search.results.length === 0) {
            search_results_content.innerHTML = "No results found";
            search_results_content.style.display = "block";
            return;
        }

        search_results.style.display = "flex";
        search_results_content.innerHTML = "";

        for (let i = 0; i < fiveResults.length; i++) {
            var a = document.createElement("a");
            a.href = fiveResults[i].url;
            a.innerHTML = fiveResults[i].meta.title;
            var content = document.createElement("p");
            content.innerHTML = fiveResults[i].excerpt;
            search_results_content.appendChild(a);
            search_results_content.appendChild(content);
        }

        // retun the first 5 results
        return fiveResults;
    }
}

async function getAvailableFilters() {
    let filters = await pagefind.filters();
    return filters;
}


function getSelectedFilters(resultID) {
    let filter = document.getElementById(resultID + ".filter");
    let dropdown = filter.getElementsByTagName("select")[0];
    let selected = dropdown.options[dropdown.selectedIndex].value;
    if (selected === "all") {
        return {};
    }
    let filters = {};
    filters[dropdown.parentElement.getElementsByTagName("h3")[0].innerHTML.toLowerCase()] = selected;
    return filters;
}

async function generateFilter(searchID, resultsID) {
    let filters = await getAvailableFilters();
    let filter = document.getElementById(resultsID + ".filter");
    let dropdown = document.createElement("select");

    dropdown.appendChild(new Option("All", "all"));

    //iterate over json object
    for ( [key, value] of Object.entries(filters)) {
        let h3 = document.createElement("h3");
        h3.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);
        filter.appendChild(h3);
        for( [keys, values] of Object.entries(value)) {
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

    dropdown.onchange = function() {
        searchPage(document.getElementById(searchID).value, resultsID)
    }

    filter.appendChild(dropdown);
}
