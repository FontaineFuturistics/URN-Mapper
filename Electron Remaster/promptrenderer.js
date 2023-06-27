console.log("Renderer up")

// Function to handle logging to the renderer and main
function logToMain(content) {window.ipc.logMsg(content)}

// Get the items
const keyBox = document.getElementById('keyInput')
const valueBox = document.getElementById('valueInput')
const cancelButton = document.getElementById('cancelButton')
const addButton = document.getElementById('addButton')

// Handle cancel button
cancelButton.addEventListener('click', (event) => {

    // Close the window
    window.ipc.cancelMapping()

})

// Handle add button
addButton.addEventListener('click', (event) => {

    // Close the window
    window.ipc.addMapping([keyBox.value,valueBox.value])

})