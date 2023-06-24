console.log("Renderer up")

// Get the terminal window
const terminal = document.getElementById("terminal")

// When main gives us something new to log, log it
window.ipc.onLog((_event, terminalContents) => {

    console.log("Recieved new log")

    // Format the terminal contents and write to the terminal
    terminal.innerText = terminalContents.join("\n")

})