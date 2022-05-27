// Import http module
let http = require("http");
let fs = require("fs");

// Set diff tolerance fraction
const diff_tol = 0.25

// Create the HTTP server
http.createServer(function (req, res) {

    // If the request is favicon.ico skip for now TODO: Figure out how to handle this
    if (req.url == "/favicon.ico") {

        return

    } // End favicon strip

    // Load the mappings
    let mappings = rtJSON("./mappings.json")

    // Load keys
    let map_keys = Object.keys(mappings)

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

        } // End map_url_list concatanation if gate

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

    } // End output if-else chain
    
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

function rtJSON(fp) {
    // This will strictly enforce using newline characters because that makes it easier

    file_string = fs.readFileSync("./mappings.json").toString('utf8') // Load the file

    file_array = file_string.split("\n") // Convert it to an array

    let output = {} // Create a variable to hold the output

    //file_array = file_array[1, file_array.length - 1] // Remove the leading and trailing brackets

    for (line = 1; line < file_array.length - 1; line++) {     

        line_data = file_array[line] // Get the line string

        line_data_array = line_data.split("\"") // Split on quotations

        output[line_data_array[1]] = line_data_array[3] // Apply the dict

    } // End each line for loop

    return output // Return the output
    
} // rtJSON function

// Print server status to the console
console.log("Server Live")