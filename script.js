const {app, BrowserWindow, globalShortcut} = require("electron");

app.whenReady().then(() => {
    globalShortcut.register('MediaPlayPause', () => {
        const net = require('net');

        const client = new net.Socket();
        client.connect({port: 65432, host: "164.92.185.110"}, () => {
            client.write("Hello World\r");
        });
        client.on('data', (data) => {
            console.log(data.toString('utf-8'));
            client.end(() => {});
        });
    });
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