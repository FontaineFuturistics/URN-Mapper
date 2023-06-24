const { app, BrowserWindow, ipcMain } = require('electron') // Import electron
const path = require('path') // import path to preload
const AutoLaunch = require('auto-launch'); // To make app run on startup

// Handle install
if (require('electron-squirrel-startup')) return;

// Constructor for BrowserWindow
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { // Attach the preload script
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')

    const INCREMENT = 0.01
    const INTERVAL_DELAY = 50 // ms

    let c = 0.1
    progressInterval = setInterval(() => {
        // Update progress bar to next value
        // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
        win.setProgressBar(Math.abs(c - 1))

        // increment or reset progress bar
        if (c < 1.9) {
            c += INCREMENT
        } else {
            c = 0.1
        }
    }, INTERVAL_DELAY)
}

app.whenReady().then(() => {

    // Configure auto-launch here for some reason
    let autolaunch = new AutoLaunch({ // Create an autolaunch object
        name: 'ElectronTutorialTest',
        path: app.getPath('exe'),
    });
    autolaunch.isEnabled().then((isEnabled) => { // Check if it is enabled?
        if (!isEnabled) autolaunch.enable(); // If it is not enabled, enable it
    })


    ipcMain.handle('ping', () => 'pong') // We set up the handler before creating the window
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Before the app is terminated, clear both timers
app.on('before-quit', () => {
    clearInterval(progressInterval)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })