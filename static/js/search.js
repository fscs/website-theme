
search();
var pagefind;
async function search() {
    pagefind = await import("/pagefind/pagefind.js");
    const inputElement = document.getElementById("search");
    inputElement.addEventListener('input', async (e) => {
        pagefind.preload(e.target.value);
        const search = await pagefind.debouncedSearch(e.target.value, {
            sort: {
                date: "desc"
            }
        }, 300);
        var search_results = document.getElementById("results");
        if (search === null) {
            // a more recent search call has been made, nothing to do
        } else {
            if (search.results.length === 0) {
                search_results.style.display = "none";
                return;
            }
            search_results.style.display = "block";
            const fiveResults = await Promise.all(search.results.slice(0, 5).map(r => r.data()));
            console.log(fiveResults);
            search_results.innerHTML = "";
            for (let i = 0; i < fiveResults.length; i++) {
                var a = document.createElement("a");
                a.href = fiveResults[i].url;
                a.innerHTML = fiveResults[i].meta.title;
                var content = document.createElement("p");
                content.innerHTML = fiveResults[i].excerpt;
                search_results.appendChild(a);
                search_results.appendChild(content);
            }
            return fiveResults;
        }
    })
}
