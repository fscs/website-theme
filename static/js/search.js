var pagefind;

/**
 * initialize search for the given input and result elements.
 * expects an element <resultsID>.filter to place filter pills in
 * and an element <resultsID>.content to place the results in
 *
 * @param {0} searchBoxID id of the box where the search query will be entered
 * @param {1} resultsID id of the box where results will be displayed
 * @param {3} resultLimit optional, if specified only shows that number of results
 */
async function initSearch(searchID, resultsID, resultCount) {
    pagefind = await import("/pagefind/pagefind.js");

    const inputElement = document.getElementById(searchID);
    await generateFilter(searchID, resultsID);

    inputElement.addEventListener('input', async () => {
        await resetFilters(resultsID + ".filter")
        searchPage(inputElement.value, resultsID, resultCount).await;
    })

    if (resultCount !== 0) {
        //close search results if clicked outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest("#" + resultsID) && !event.target.closest("#" + searchID)) {
                document.getElementById(resultsID).style.display = "none";
            }
        });

        //close search results if scrolled
        document.addEventListener('scroll', function() {
            document.getElementById(resultsID).style.display = "none";
        });

        //close search results if esc key is pressed
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape") {
                document.getElementById(resultsID).style.display = "none";
            }
        });
    }

}


//reset filters
async function resetFilters(filterID) {
    let filters = document.getElementById(filterID);

    for (let i = 0; i < filters.getElementsByTagName("select").length; i++) {
        filters.getElementsByTagName("select")[i].selectedIndex = 0;
    }
}


async function searchPage(query, resultID, resultCount) {
    await pagefind.destroy();
    await pagefind.init();

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
        var results;
        if(resultCount === 0){
            results = await Promise.all(search.results.map(r => r.data()));
        } else {
            results = await Promise.all(search.results.slice(0, resultCount).map(r => r.data()));
        }


        console.log(query);
        // Display the results
        if (query === "") { 
            search_results.style.display = "none"; 
            return;
        }

        if (results.length === 0) {
            search_results.style.display = "flex";
            search_results_content.innerHTML = "No results found";
            return;
        }
        

        search_results.style.display = "flex";
        console.log("asd");
        search_results_content.innerHTML = "";

        for (let i = 0; i < results.length; i++) {
            var a = document.createElement("a");
            a.href = results[i].url;
            a.innerHTML = results[i].meta.title;
            var content = document.createElement("p");
            content.innerHTML = results[i].excerpt;
            search_results_content.appendChild(a);
            search_results_content.appendChild(content);
        }
        
        if(document.getElementById("fullSearchLoading") !== null){
            document.getElementById("fullSearchLoading").style.display = "none";
        }

        // retun the first 5 results
        return results;
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
