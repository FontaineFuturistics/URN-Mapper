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

    console.log("Request received: " + req.url)
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


        console.log("Plan B")
        map_url = []

        console.log(map_keys.length)

        // Run against each key 
        for (i = 0; i < map_keys.length; i++) {

            console.log("Iteration" + i)

            // Get current key
            let ckey = map_keys[i]

            // Calculate maximum allowable difference
            let max_diff = Math.ceil(diff_tol * ckey.length)

            // See if diff is low enough
            if (str_diff(key, ckey) <= max_diff) {
                map_url.push(mappings[ckey])
            } // End of output add

        } // End of each key loop

    } // End of diff system loop

    console.log("progress")
    res.write("output: " + map_url);
    res.end();
    
}).listen(8080);

// str_diff function to determine the difference between two strings
function str_diff(base, ref) {

    // Initialize arrays
    base_array = base.split('')
    ref_array = ref.split('')

    // Initialize diff
    let diff = 0

    // For each index in the ref_array
    for (k = 0; k < ref_array.length; k++) {

        // If the arrays are not equal at the given index increase the diff
        if (base_array[k] != ref_array[k]) {
            diff++
        } // End of diff++ gate

    } // End of ref_array for loop

    return diff

} // End of str_diff function

// Print server status to the console
console.log("Server Live")