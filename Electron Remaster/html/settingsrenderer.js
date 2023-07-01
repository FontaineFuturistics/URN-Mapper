console.log("Settings up")

// Function to handle logging to the renderer and main
function logToMain(content) {window.ipc.logMsg(content)}

/*
CLOSE BUTTON
*/

// Get the close button
let closeButton = document.getElementById("closeButton")

// Close when the button is pressed
closeButton.addEventListener("click", (event) => {

    // Tell main to close us
    window.ipc.closeSettings();

})

/*
EXIT CERULEAN BUTTON
*/

// Get the exit button
let exitButton = document.getElementById("exitButton")

// Alert main when button is pressed
exitButton.addEventListener("click", (event) => {

    // Tell main to quit
    window.ipc.quitApp()

})

/*
AUTOLAUNCH SLIDER
*/

// Get the autoslider
const autoSlider = document.getElementById("autoSlider")

// Set slider when init
window.ipc.onAutoInit((_event, status) => {

    // Set the slider
    autoSlider.checked = status

})

// When the slider is selected, update main
autoSlider.addEventListener("change", (event) => {

    // Update main
    window.ipc.updateAutoLaunch(autoSlider.checked)

})

/*
FILE PATH TO MAPPINGS
*/

// Get the mappings file path

// Get the button
const mapFileSelectButton = document.getElementById("mapFileInput")

// When the button is pressed, do something
mapFileSelectButton.addEventListener("click", async (event) => {

    // Tell main the user wants to pick a file
    window.ipc.selMapFile()

})

/*
ADD A NEW MAPPING
*/

// Display new mapping window

// Get the button
const newMappingButton = document.getElementById("launchNewMappingButton")

// When the button is pressed, do something
newMappingButton.addEventListener("click", async (event) => {

    // Tell main the user wants to pick a file
    window.ipc.launchNewMapping()

})

/*
INIT STUFF
*/

// Tell main we are ready to init
window.ipc.initReady()