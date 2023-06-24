const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

// Ping the main process and get a response
const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // Prints out 'pong'
    // This doesn't work because the renderer does not have access to the console
}

console.log("test1")

func()
func()

// Handle orders from main
const box = document.getElementById("msgBox")

window.versions.onOrders((_event, value) => {
    console.log("test2")
    box.innerText = value
})

console.log("test3")

// Handle writes to the list Container from main
const liCon = document.getElementById("listContainer")

window.versions.onListWrite((_event, value) => {
    console.log("List write received for " + value)
    liCon.innerHTML += `<li>${value}</li>\n` // IMPORTANT: Use innterHTML not innerText if you want it parsed as HTML
})

// Bug main
window.versions.bugMain()
