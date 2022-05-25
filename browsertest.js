// https://www.geeksforgeeks.org/how-to-access-variables-from-another-file-using-javascript/#:~:text=In%20JavaScript%2C%20variables%20can%20be%20accessed%20from%20another,client-side%20scripting%20as%20well%20as%20for%20server-side%20scripting.
let http = require('http');

// NOTE: hangs with invalid urn

http.createServer(function (req, res) {
    var mappings = require('./mappings.json') // Reload the json each time so the user can make changes NOTE: This doesn't actually work rn
    let key = req.url.slice(10).toLowerCase() // Convert the search query to lower case and splice out the url header
    if (key == undefined || key == "co") { // Ignore the weird second query that has "co" in it, don't know where it comes from but I just ignore all queries on "co"
        return
    } else if (key === "mappings") {
        // TODO: Later
    } else {
        let value = mappings[key] // Get the value from mappings

        if (value == undefined) { // If the key isn't in mappings, try to figure it out and change value accordingly
            let keys = Object.keys(mappings)
            let sorted_key =  key.split('').sort().join('') // Start by seeing if the user just messed up the order of the letters
            for (i=0; i < keys.length; i++) { // Run on each key
                ckey = keys[i].split('').sort().join('') // Sort the keys alphabetically
                if (ckey == sorted_key) { // If the key and the sorted key match
                    value = mappings[keys[i]] // Set value appropriatly
                    break
                }
            }
        } // End of anagram search

        if (value == undefined) { // If there is no found key, report that to the user (later on make this be suggestions)

            res.write("Key \"" + key + "\" not found"); // Report the error temporarily
            res.end();
            console.log("Key Error: " + key);

        } else { // If there was a found key, use it
            res.write("<!DOCTYPE html>\n"); // Start an HTML document
            res.write("<meta http-equiv=\"refresh\" content=\"0; URL=" + value + "\" />"); // Reroute the user
            console.log("Routed user to " + value); // Log it in the console
            res.end(); // End the response
        } // End of output block
    }  // End of anti-co block
}).listen(8080); // Set the listen port

console.log("Server Live")