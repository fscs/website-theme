/**
 * set the value of a cookie
 *
 * @param {string} name name under which the cookie will be stored
 * @param {string} value value to store in the cookie
 * @param {number} expire_days number of days the cookie will expire in
 *
 */
function setCookie(name, value, expire_days) {
    var d = new Date();

    d.setTime(d.getTime() + expire_days * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();

    document.cookie =
        name + "=" + value + ";" + expires + ";path=/; SameSite=None; Secure";
}

/**
 * get the value of a cookie
 * @param {string} cname the name of the cookie
 * @returns {string} the value of the cookie
 *
 * @example getCookieData('search')
 * @returns 'value of search cookie'
 * @example getCookieData('nonexistent')
 * @returns ''
 */
function getCookieData(cname) {
    var name = cname + "="; // cookies are stored as 'name=value'
    var decodedCookie = decodeURIComponent(document.cookie); // decode the cookie
    var ca = decodedCookie.split(";"); // cookies are stored as strings with a ; between them

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i]; // get the current cookie

        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }

        // if the cookie is found, return the value
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    // if the cookie is not found, return an empty string
    return "";
}
