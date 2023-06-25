console.log("Renderer up")

// Get the terminal window
const terminal = document.getElementById("terminal")

// When main gives us something new to log, log it
window.ipc.onLog((_event, terminalContents) => {

    console.log("Recieved new log")

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

// Tell main we are ready to init
window.ipc.initReady()

// When the slider is selected, update main
autoSlider.addEventListener("change", (e) => {

    // Update main
    window.ipc.updateAutoLaunch(autoSlider.checked)

})