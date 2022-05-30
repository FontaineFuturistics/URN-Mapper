// Import http module for server and fs module to load mappings
const http = require("http");
const fs = require("fs");

// Load settings
const settings = require("./settings.json")

// Set diff tolerance fraction
const diff_tol = settings["tolerance"]

// Set the documentation key
const doc_key = settings["documentation"]

// Create the HTTP server
http.createServer(function (req, res) {

    // Try block to prevent server crashes
    try {

        // If the request is favicon.ico return the icon
        if (req.url == "/favicon.ico") {

            res.write(fs.readFileSync("./favicon.ico"))
            res.end()
            return

        } // End favicon strip

        // Load the mappings
        let mappings = rtJSON("./mappings.json")

        // Load keys
        let map_keys = Object.keys(mappings)

        let req_str = req.url.split('=', 2)[1] // Split the url on the equals

        let key = req_str.split("+")[0].toLowerCase() // Create the search key

        let map_url // Initialize the return url

        // Start the HTML response
        res.write("<!DOCTYPE html>")
        res.write("<title>Go! Search</title>")

        // Try to do a direct dictionary access
        map_url = mappings[key]

        // If that didn't work, move to plan B
        if (map_url == undefined) {

            // Create list to hold all potential mappings
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

            // Remove duplicate results
            map_url_list = removeDuplicates(map_url_list)

            // If there is only one option, set map_url to it
            if (map_url_list.length == 1) {

                map_url = map_url_list[0]

            } // End map_url_list concatanation if gate

        } // End of diff system loop

        // If the map_url is mappings["docs"] display the mappings in custom format
        if (map_url == mappings[doc_key]) {

            // Create the header
            res.write("All mappings:\n")

            // Run against each mapping
            for (i = 0; i < map_keys.length; i++) {
                // Get the key
                let ckey = map_keys[i]

                // Skip docs
                if (settings["hide"][ckey]) {
                    continue
                } // Skip hidden mappings

                // Get the url
                let cval = mappings[ckey]

                // Replace html characters
                ckey = ckey.replace("%3F", "?").replace("%2B", "+")

                // If there is a %s, tell the user how to use it
                if (cval.includes("%s")) {

                    ckey += " (Add search term after key to preform searches)"

                } // %s documentation gate

                // Write the list item
                res.write("<li><a href=" + cval + ">" + ckey + "</a></li>\n")

            } // For loop for all mappings


            // Finish the response
            res.end()
            console.log("Showed user documentation")
            return

        } else if (map_url == mappings["json"]) { // If the key is json dump the raw mappings

            res.write(arep(fs.readFileSync("./mappings.json").toString('utf8'), "\n", "</br >"))
            res.end()
            console.log("Showed user json mappings")
            return

        } // End of documentation if gate

        // Return the value
        if (map_url) {

            res.write("<meta http-equiv=\"refresh\" content=\"0; URL=" + arep(map_url, "%s", req_str.split("+", ).slice(1).join("+")) + "\" />"); // Reroute the user
            res.end(); // End the response

            // Log it in the console
            console.log("Routed user to " + map_url + " from search " + key);

            // return out of void
            return

        } else if (map_url_list[0]) { // If there is a list of options, list them

            // Write header
            res.write("Did you mean:\n")

            // Write the options as a list
            for (i = 0; i < map_url_list.length; i++) {
                res.write("<li><a href=\"" + map_url_list[i] + "\">" + map_url_list[i] + "</a></li>\n")
            } // End list formatting for loop

            // Tell useer where to see all mappings
            res.write("See <a href=\"http://" + settings["address"] + "/search?q=docs\">Go docs</a> for all mappings")

            // End response
            res.end()

            console.log("Gave user " + map_url_list + " options from search " + key) // Log it
            return

        } else { // If no redirect options were found, indicate

            if (!settings["true-search"]) { // If true-search is false inform the user that their query failed

            // Return failed query
            res.write("Your query has failed, check your spelling or check <a href=\"http://" + settings["address"] + "/search?q=docs\">Go docs</a> for mappings") // May need to do somethign special once implemented on serverside to do with the variable port system
            res.end();
            console.log("Search " + key + " has failed")
            return

            } else { // If true-search is true do a google search
                
                // Create the redirect tag
                res.write("<meta http-equiv=\"refresh\" content=\"0; URL=https://google.com/search?q=" + req_str +"\" />"); // Reroute the user

                // End the response
                res.end()
                return
            }


        } // End output if-else chain

    } catch {
        try { // Try in case the error is really severe
            console.log("Error caught from " + req.url) // Log it
            res.write("Oops! An error has occured, try again") // Indicate the error to the user
            res.end() // End the response
        } catch {console.log("Critical error caught from catch block")} // Log the error, if the console isn't working all hope is lost anyway
    } // Catch any error from the try block
    
}).listen(settings["port"]);

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

function arep(input, term, substitute) {

    if (term == substitute) {
        return input // Close out if they are equal
    }

    while (input.includes(term)) { // Until the term is gone

        input = input.replace(term, substitute) // Replace the first instance of term with substitute

    } // End while loop

    return input // Return

} // End arep function

function removeDuplicates (array) {
    // Create variable for the output array
    let output = []

    // For each value in array, if it is unique add it to output
    for (i = 0; i < array.length; i++) {

        // If the value is not found
        if (!output.includes(array[i])) {

            output.push(array[i]) // Add it to the output

        } // End of if gate

    } // End of each value for loop

    return output // Return the output

} // End of removeDuplicates function

// Print server status to the console
console.log("Server Live on port " + settings["port"])