// import Alert from "js/bootstrap/src/alert";
import Button from "js/bootstrap/src/button";
// import Carousel from "js/bootstrap/src/carousel";
import Collapse from "js/bootstrap/src/collapse";
// import Dropdown from "js/bootstrap/src/dropdown";
import Modal from "js/bootstrap/src/modal";
import Offcanvas from "js/bootstrap/src/offcanvas";
// import Popover from "js/bootstrap/src/popover";
import Scrollspy from "js/bootstrap/src/scrollspy";
// import Tab from "js/bootstrap/src/tab";
// import Toast from "js/bootstrap/src/toast";
import Tooltip from "js/bootstrap/src/tooltip";

(function() {
    const tooltipTriggerList = document.querySelectorAll("[data-bs-tooltip]");
    const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl),
    );
})();
