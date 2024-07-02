function showToc() {
    let toc_options = document.getElementById("toc-options");

    if (toc_options.style.display === "none") {
        toc_options.style.display = "block";
    }
    else {
        toc_options.style.display = "none";
    }

    for (let i = 0; i < toc_options.children[1].children.length; i++) {
        let child = toc_options.children[1].children[i];
        child.onclick = function() {
            toc_options.style.display = "none";
        }
    }
}
