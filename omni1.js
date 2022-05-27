// Import http module
let http = require("http");

// Import mappings
let mappings = require("./mappings.json") 

// Get mapping keys
let map_keys = Object.keys(mappings)

// Set diff tolerance fraction
const diff_tol = 0.25

//TODO: I'd like to be able to change mappings dynamically during runtime

// Create the HTTP server
http.createServer(function (req, res) {

    // If the request is favicon.ico skip for now TODO: Figure out how to handle this
    if (req.url == "/favicon.ico") {

        return

    }

    let req_str = req.url.split('=', 2)[1] // Split the url on the equals

    let key = req_str.split("+")[0] // Create the key

    let map_url // Initialize the return url

    // Try to do a direct dictionary access
    map_url = mappings[key]

    // If that didn't work, move to plan B
    if (map_url == undefined) {

        map_url_list = []

        // Run against each key 
        for (i = 0; i < map_keys.length; i++) {

            // Get current key
            let ckey = map_keys[i]

            // Calculate maximum allowable difference
            let max_diff = Math.ceil(diff_tol * ckey.length)

            // See if diff is low enough
            if (str_diff(key, ckey) <= max_diff) {
                map_url_list.push(mappings[ckey])
            } // End of output add

        } // End of each key loop

        // If there is only one option, set map_url to it
        if (map_url_list.length == 1) {

            map_url = map_url_list[0]

        }

    } // End of diff system loop

    // Return the value
    if (map_url) {

        res.write("<!DOCTYPE html>\n"); // Start an HTML document
        res.write("<meta http-equiv=\"refresh\" content=\"0; URL=" + map_url + "\" />"); // Reroute the user
        res.end(); // End the response

        // Log it in the console
        console.log("Routed user to " + map_url + " from search " + key);

        // return out of void
        return

    } else if (map_url_list[0]) { // If there is a list of options, list them

        // TODO: Write header
        res.write("<!DOCTYPE html>")
        res.write("Did you mean:\n")

        // Write the options as a list
        for (i = 0; i < map_url_list.length; i++) {
            res.write("<li><a href=\"" + map_url_list[i] + "\">" + map_url_list[i] + "</a></li>\n")
        } // End list formatting for loop

        res.end()
        
        console.log("Gave user " + map_url_list + " options from search " + key) // Log it
        return

    } else { // If no redirect options were found, indicate

        // Return failed query
        res.write("Your query has failed, check your spelling")
        res.end();
        console.log("Search " + key + " has failed")
        return

    }
    
}).listen(8080);

// str_diff function to determine the difference between two strings
function str_diff(base, ref) {

    // Initialize arrays
    base_array = base.split('')
    ref_array = ref.split('')

    // Initialize diff
    let diff = 0

    // Get longest length
    if (base_array.length > ref_array.length) {
        longest_array = base_array.length
    } else {
        longest_array = ref_array.length
    }

    // For each index in the ref_array
    for (k = 0; k < longest_array; k++) {

        // If the arrays are not equal at the given index increase the diff
        if (base_array[k] != ref_array[k]) {
            diff++
        } // End of diff++ gate

    } // End of ref_array for loop

    return diff

} // End of str_diff function

// Print server status to the console
console.log("Server Live")