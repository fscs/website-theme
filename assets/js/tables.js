/**
 * scans the element with the given id for table elements
 * and adds bootstraps table styling to it.
 *
 * @param {string} id of the element to patch tables in.
 */
function patch_markdown_tables(id) {
  document
    .getElementById(id)
    .querySelectorAll("table")
    .forEach((e) => {
      e.classList.add("table", "table-striped", "table-hover");
    });
}
