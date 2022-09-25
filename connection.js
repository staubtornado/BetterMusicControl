const net = require("net");
const {shell} = require("electron");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

class Connection {
    client = new net.Socket();
    closed = true;
    win;

    uID;
    sessionID;

    constructor(win) {
        this.client.on("data", async (data) => {
            data = data.toString().replaceAll("'", '"');
            try {
                data = JSON.parse('' + data);
                const code = `updateSong("${data["title"]}", "${data["uploader"]}", "${data["url"]}", "${data["thumbnail"]}");`
                win.webContents.executeJavaScript(code).then(() => {
                });

                await delay(10000);
                if (!this.closed) {
                    this.client.write(JSON.stringify({
                        "uID": this.uID,
                        "sessionID": this.sessionID,
                        "message": "FETCH"
                    }));
                }
            } catch (e) {
                win.webContents.executeJavaScript(`alert(${data.valueOf()});`).then(() => {
                });
                this.client.destroy();
                console.log("Connection ended...");
                win.webContents.executeJavaScript("updateConnectionState(\"disconnected\");").then(() => {
                });
                this.closed = true;
            }
        });
        this.client.on("end", () => {
            console.log("Connection ended...");
            win.webContents.executeJavaScript("updateConnectionState(\"disconnected\");").then(() => {});
            this.closed = true;
        });
        this.win = win;
    }

    connect(address, port, uID, sessionID) {
        this.client.connect({port: port, host: address}, () => {
            console.log(`Initialized connection to ${address}:${port}`);
            this.client.write(JSON.stringify({
                "uID": uID,
                "sessionID": sessionID,
                "message": "FETCH"
            }));
            this.win.webContents.executeJavaScript("updateConnectionState(\"connected\");").then(() => {});
            this.closed = false;
            this.uID = uID;
            this.sessionID = sessionID;
        });
    }

    disconnect() {
        this.client.write("END");
        this.client.destroy();
        this.win.webContents.executeJavaScript("updateConnectionState(\"disconnected\");").then(() => {});
        this.closed = true;
    }

    send(data) {  // Data should already be converted with JSON.stringify to String if not "END".
        try {
            if (!this.closed) {
                this.client.write(String(data));
            }
        } catch (e) {
            console.log(e);
            shell.beep();
        }
    }
}

module.exports = {
    connection: Connection
}
