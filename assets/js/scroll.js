function updateFragId() {
    var sections = document.getElementsByTagName('h2');
    for (var i = 0; i < sections.length; i++) {
        var id = sections[i].id;
        var rect = sections[i].getBoundingClientRect();
        if (rect.top > 0 && rect.top < 400) {
            if (id !== location.hash.substr(1)) {
                history.replaceState(null, null, '#' + id);
            }
        }
    }
}

window.addEventListener('scroll', updateFragId);

