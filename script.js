const {app, globalShortcut, ipcMain, shell, nativeTheme } = require("electron");
const {BrowserWindow, setVibrancy} = require("electron-acrylic-window")
const {connection} = require("./connection");
const path = require('path');
const dotenv = require('dotenv');

let sessionID;
dotenv.config();
const uID = `${process.env.uID}`; // Needs to be String due to JavaScript Max-Safe-Integer
let con;
let win;

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
function minimize() {
    win.minimize();
}
function close() {
    win.close();
}

app.whenReady().then(() => {
    ipcMain.on('connectionUpdateRequest', processUpdateConnection);
    ipcMain.on('minimize', minimize);
    ipcMain.on('close', close);
    createWindow();
});

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 650,
        resizable: false,
        frame: false,
        icon: path.join(__dirname, 'assets/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true
        },
    });

    const vibrancy = {
        theme: "#FFFFFF00",
        effect: 'acrylic',
        useCustomWindowRefreshMethod: true,
        disableOnBlur: true,
        debug: false,
    }
    if (nativeTheme.shouldUseDarkColors) {
        vibrancy["theme"] = "#20202000";
    }
    setVibrancy(win, vibrancy);

    win.setMenu(null);
    win.loadFile("./ui/index.html").then(() => {});
    win.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url).then(() => {});
        return { action: 'deny' };
    });
    win.webContents.openDevTools({ mode: 'detach' })
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
    globalShortcut.register('MediaNextTrack', () => {
        if (con.closed) {
            shell.beep();
            return;
        }

        console.log("Sending skip request to server.");
        con.send(JSON.stringify({
            "uID": uID,
            "sessionID": sessionID,
            "message": "SKIP"
        }));
    });
}