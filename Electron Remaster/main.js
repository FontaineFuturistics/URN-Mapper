const {app, BrowswerWindow, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron') // Import electron stuff
const http = require("http") // Import http module for http server
const fs = require('fs') // Import file system to handle favicon among other things
const path = require('path') // Import path for preload
const AutoLaunch = require('auto-launch') // To make app run on startup

// Handle install
if (require('electron-squirrel-startup')) return;

// Variable for main window
let mainWindow

// Variable for tray reference
let tray

// Variable that holds the entire contents of the terminal
let terminalContents = ["> Welcome to Cerulean"]

// Icon
const foxIcon_path = path.join(__dirname, 'hiresicon.ico')

// createWindow method
const createWindow = () => {

    // Initialize the window
    mainWindow = new BrowserWindow({
        width: 700,
        height: 400,
        icon: path.join(__dirname, 'hiresicon.ico'),
        maximiziable: false,
        resizable: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: true,
        webPreferences: { // Attach preloader
            preload: path.join(__dirname, 'preload.js')
        }
    }) // End mainWindow initialize

    // load the html file
    mainWindow.loadFile('index.html')

    mainWindow.on('close', (e) => {
        e.preventDefault()
        mainWindow.hide()
    })

    // Hide window immediatly
    mainWindow.hide()

} // End createWindow

// When the app is ready load the window
app.whenReady().then(() => {

    // Create the window
    createWindow()
    
    // Configure the tray
    tray = new Tray(nativeImage.createFromPath(foxIcon_path))

    // Create a menu for the tray
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open', click: () => {mainWindow.show()}},
        { label: 'Quit', click: () => {mainWindow.destroy();app.quit()}},
    ]) // End menu init

    tray.setContextMenu(contextMenu)

    // Make the app toggle visible when you click the icon on the tray
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    }) // End tray click settings

    // Give tray tooltip
    tray.setToolTip("Cerulean")
    tray.setTitle("REPORT ME IF YOU SEE ME") // I can't find this


    // Set close settings

    // Load a new window if there are none
    app.on('activate', () => { // I don't know how this will play with Windows honsetly, needs to be tested

        if (BrowserWindow.getAllWindows().length === 0) createWindow()

    mainWindow.on

    }) // End close settings

    // Make it play nice on apple
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
    }) // End make it play nice on apple thing

    // Initialize the settings
    ipcMain.handle("initReady", () => {

        // Set the auto-launch slider
        mainWindow.webContents.send('autoInit', settings["auto-launch"])

    }) // End initReady handler

    // Handle autolaunch
    ipcMain.handle("updateAutoLaunch", (event, msgToMain) => {

        // Change settings variable
        settings["auto-launch"] = msgToMain

        // Change settings file
        fs.writeFile("./settings.json", JSON.stringify(settings), () => {})

        // Update auto-launch accordingly
        let autolaunch = new AutoLaunch({ // Create an autolaunch object
            name: 'ElectronTutorialTest',
            path: app.getPath('exe'),
        });
        
        // Do the logic
        if (settings["auto-launch"]) {
            autolaunch.enable()
        } else {
             autolaunch.disable()
        } // end if gate

    }) // End updateAutoLaunch ipc handler

}) // End whenReady

// Load settings
const settings = require("./settings.json")

// Create HTTP server
http.createServer(function (req, res) {

    // Try block to prevent server crashes
    try {

        // Handle special server requests
        if (req.url == "/favicon.ico") { // Server icon request
            
            // Respond with the webicon (to differentiate from electron's favicon)
            res.write(fs.readFileSync(path.join(__dirname, 'webicon.ico')))
            res.end()
            return

        } else if (req.url == "/openserver.xml") { // Firefox's opensearch request

            res.write(fs.readFileSync("./opensearch.xml"))
            res.end()
            console.log("Responded to opensearch.xml query")
            return

        } // End special request handler

        // Load the mappings (do this for every request so they get updated)
        let mappings = require("./mappings.json")

        // Extract all the keys for matching later
        let map_keys = Object.keys(mappings).sort()

        // Extract the search term from the URL
        let search = req.url.split("search?q=")[1].toLowerCase().split("+") // All searches are done in lower case

        // Get base key
        let search_key = search[0]

        // If search has multiple terms, add them to search terms
        let search_terms = []
        if (search.length > 1) {
            search_terms = search.slice(1)
        }

        // Initialize value for response key and list
        let response_url
        let response_key_list = []

        /* * * * * * * * * *
         *  Do the Search  *
         * * * * * * * * * */

        // Try a direct lookup
        response_url = mappings[search_key]

        // If that failed try the matching function
        if (response_url === undefined) {

            // Call getMatches
            response_key_list = getMatches(search_key, map_keys)

            // If there is only 1 match, collapse the list
            if (response_key_list.length == 1) {response_url = response_key_list[0]}
        }

        /* * * * * * *
         *  Respond  *
         * * * * * * */

        // HTML formatting
        res.write("<!DOCTYPE html>")
        res.write("<title>Cerulean</title>") // v Really should make this several lines
        res.write('<head><link rel="search" type="application/opensearchdescription+xml" title="Cerulean" href="/opensearch.xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet"></head>')
        res.write(`<style>* {font-family: 'IBM Plex Mono', monospace;}</style>`)
        res.write('<body style="background-image:linear-gradient(to right bottom, #6ce0cd, #2abbb8, #049eaa, #006b8b, #015383, #013a67);background-attachment:fixed;">')

        // If there is a single response, give it
        if (response_url != undefined) {

            // Write the redirect link
            res.write(`<meta http-equiv="refresh" content = "0; URL=${response_url.replace("%s", search_terms.join("+"))}" />`)

            // Log it
            logToRenderer(`Routed user ${req.socket.remoteAddress.replace("::1", "localhost")} to ${response_url} from search ${search_key}`)

        } else if (search_key === settings["documentation"]) {

            // Give the response a header
            res.write("All mappings:\n")

            // Create an unordered list
            res.write("<ul>")

            // For every mappings
            for (i = 0; i < map_keys.length; i++) {

                // Get the key
                let ckey = map_keys[i]

                // Skip anything which is hidden in the settings
                if (settings["hide"][ckey]) continue // This is for easter eggs primarily

                // Create the docs entry
                res.write(`<li><a href="${mappings[ckey]}">${ckey.replace("%3f", "?").replace("%2b","+")}${mappings[ckey].includes("%s") ? " Add search term after key to preform searches" : ""}</a></li>`)

            }

            // End the unordered list
            res.write("</ul>")

            // Log it
            logToRenderer(`Showed user ${req.socket.remoteAddress.replace("::1", "localhost")} docs`)

        } else if (search_key === settings["json"]) {

            // Turn the json into html
            res.write(fs.readFileSync("./mappings.json").toString('utf-8').replace(new RegExp("\n", 'g'), "</br >"))

            // Log it
            logToRenderer(`Showed user ${req.socket.remoteAddress.replace("::1", "localhost")} json mappings`)


        } else if (response_key_list.length > 0) { // If there were multiple responses, present them

            // Give a header to the list
            res.write("<p>Did you mean:\n</p>")
            
            // Create an unordered list tag
            res.write("<ul>")

            // Print response key list
            console.log(response_key_list)

            // Dump all possible options
            for (j = 0; j < response_key_list.length; j++) {
                res.write(`<li><a href="${mappings[response_key_list[j]]}">${response_key_list[j]}</a></li>\n`)
            } // End option dump

            // End the unordered list
            res.write("</ul>")

            // Give user a hint
            res.write(`See <a hre="http://localhost:${settings["port"]}/search?q=docs">Go docs</a> or all mappings`)

            // Log it
            logToRenderer(`Gave user ${req.socket.remoteAddress.replace("::1", "localhost")} ${response_key_list.length} options from search ${search_key}`)

        } else { // If no possible responses were found, try something else

            // If true-search is on, do a search
            if (settings["true-search"]) {
                res.write(`<meta http-equiv="refresh" content = "0; URL=${search.join("+")}" />`)
                logToRenderer(`Preformed a true-search after failed key-matching on ${search_key}`)
            } else { // If true-search is turned off, tell the user they failed
                res.write(`Your query has failed, check your spelling or check <a href="http://localhost:${settings["port"]}/search?q=docs">Go Docs</a> for more mappings`)
                logToRenderer(`Search with key ${search_key} has failed`)
            } // End true-search handling

        } // End response composition

        // Put the html footer
        res.write("</body>")

        // End the response
        res.end()

        // Return
        return

    } catch (e) {
        // Another try block in case its a really bad error
        try {
            logToRenderer("Error caught from " + req.url)
            logToRenderer(e) // Log the error
            res.write("Oops! An error has occured, try again")
            res.end()
            return // Tell the user
        } catch {
            logToRenderer("Critical error caught from catch block")
        } // End server response try-catch
    } // End server try-catch

}).listen(settings["port"])

// Log to renderer function
function logToRenderer(logText) {
    console.log(logText) // Log it
    terminalContents.push("> " + logText) // Update the terminal
    try{ // This will only happen if there is not currently a window open
        mainWindow.webContents.send('log', terminalContents) // Send the new terminal
    } catch {
        console.log("Failed to update renderer")
    }
}

// Key matching function
function getMatches(search_key, keys) {

    // Get the tolerance
    const TOL = settings["tolerance"]

    // Initialize list to hold response
    let response_key_list = []

    // For each key
    for (i = 0; i < keys.length; i++) {

        // Get the current key
        let key = keys[i]

        // See if the strings are similar
        if (linearStringDiff(search_key, key, TOL)) {
            response_key_list.push(key) // If they are add the key to the response list
        } // End compare

    } // End for each key

    // Return the response list
    return response_key_list

} // End getMatches

// Function that does a simple comparison between two strings
function linearStringDiff(string1, string2, tolerance) {

    // Initialize value to hold difference count
    let diff_count = 0

    // Get the maximum length
    let max_len = string1.length
    if (string2.length > max_len) {max_len = string2.length}

    // Determine max allowable different characters
    let max_allow_diff = Math.ceil(tolerance * max_len)

    // Compare the character at each index
    for (k = 0; k < max_len; k++) {
        if (string1[k] != string2[k]) diff_count++
    } // End character compare

    // See if the diff_count exceeds the tolerance percentage
    if (diff_count > max_allow_diff) {
        return false
    } else {
        return true
    } // End diff check
 
} // End linearStringDiff