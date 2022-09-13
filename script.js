const {app, BrowserWindow, globalShortcut} = require("electron");

app.whenReady().then(() => {
    globalShortcut.register('MediaPlayPause', () => {});
}).then(createWindow);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: false,
        icon: "./assets/icon.ico"
    });
    // win.setMenu(null);
    win.loadFile("index.html").then(() => {});
}