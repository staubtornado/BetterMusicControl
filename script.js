const {app, BrowserWindow, globalShortcut} = require("electron");

app.whenReady().then(() => {
    globalShortcut.register('MediaPlayPause', () => {
        console.log("Worked")
    });
}).then(createWindow);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: false,
        icon: "./assets/icon.ico"
    });
    win.loadFile("index.html").then(() => {});
}