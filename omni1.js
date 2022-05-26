// Import http module
let http = require("http");

// Import mappings
let mappings = require("./mappings.json") 

//TODO: I'd like to be able to change mappings dynamically during runtime

// Create the HTTP server
http.createServer(function (req, res) {

    let req_str = req.url.split('=', 2)[1] // Split the url on the equals

    let key = req_str.split("+")[0] // Create the key

    let map_url // Initialize the return url

    // Try to do a direct dictionary access
    map_url = mappings[key]

    // If that didn't work, move to plan B
    if (map_url == undefined) {

        console.log(str_diff(key, "test"))

    } // End of diff system loop

    
    
}).listen(8080);

// str_diff function
function str_diff(base, ref) {

    // Initialize arrays
    base_array = base.split('')
    ref_array = ref.split('')

    // Initialize diff
    let diff = 0

    // For each index in the ref_array
    for (i = 0; i < ref_array.length; i++) {

        // If the arrays are not equal at the given index increase the diff
        if (base_array[i] != ref_array[i]) {
            diff++
        } // End of diff++ gate

    } // End of ref_array for loop

    return diff

} // End of str_diff function

// Print server status to the console
console.log("Server Live")