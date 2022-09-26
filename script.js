const {app, BrowserWindow, globalShortcut, ipcMain, shell} = require("electron");
const {connection} = require("./connection");
const path = require('path');
const dotenv = require('dotenv');

let sessionID;
dotenv.config();
const uID = `${process.env.uID}`; // Needs to be String due to JavaScript Max-Safe-Integer
let con;

function processUpdateConnection(event, args) {
    if (args[0] === "CONNECT") {
        if (!con.closed) {
            con.disconnect();
        }

        con.connect(args[1], args[2], uID, args[3]);
        sessionID = args[3];
    }
    if (args[0] === "DISCONNECT") {
        con.disconnect();
    }
}


app.whenReady().then(() => {
    ipcMain.on('connectionUpdateRequest', processUpdateConnection);
    createWindow();
})

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: false,
        icon: path.join(__dirname, 'assets/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.setMenu(null);
    win.loadFile("./ui/index.html").then(() => {});
    win.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url).then(() => {});
        return {action: 'deny'};
    });
    con = new connection(win);

    globalShortcut.register('MediaPlayPause', () => {
        if (con.closed) {
            shell.beep();
            return;
        }

        console.log("Sending toggle request to server.");

        con.send(JSON.stringify({
            "uID": uID,
            "sessionID": sessionID,
            "message": "TOGGLE"
        }));
    });
}