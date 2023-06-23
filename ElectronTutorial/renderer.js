const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

// Ping the main process and get a response
const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // Prints out 'pong'
    // This doesn't work because the renderer does not have access to the console
}

func()