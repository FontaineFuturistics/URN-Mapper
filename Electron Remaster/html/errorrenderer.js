// Get close button
const closeButton = document.getElementById("closeButton")

closeButton.addEventListener("click", (event) => {
    window.ipc.errorClose()
})