console.log("Renderer up")

// Function to handle logging to the renderer and main
function logToMain(content) {window.ipc.logMsg(content)}

// Get the terminal window
const terminal = document.getElementById("terminal")

// When main gives us something new to log, log it
window.ipc.onLog((_event, terminalContents) => {

    // Format the terminal contents and write to the terminal
    terminal.innerText = terminalContents.join("\n")

})

// Get the autoslider
const autoSlider = document.getElementById("autoSlider")

// Set slider when init
window.ipc.onAutoInit((_event, status) => {

    // Set the slider
    autoSlider.checked = status

})

// Get the mappings file path

// Get the button
const mapFileSelectButton = document.getElementById("mapFileInput")

// When the button is pressed, do something
mapFileSelectButton.addEventListener("click", async (event) => {

    // Tell main the user wants to pick a file
    window.ipc.selMapFile()

})


// Display new mapping window

// Get the button
const newMappingButton = document.getElementById("launchNewMappingButton")

// When the button is pressed, do something
newMappingButton.addEventListener("click", async (event) => {

    // Tell main the user wants to pick a file
    window.ipc.launchNewMapping()

})

// Tell main we are ready to init
window.ipc.initReady()

// When the slider is selected, update main
autoSlider.addEventListener("change", (event) => {

    // Update main
    window.ipc.updateAutoLaunch(autoSlider.checked)

})