const connection_control = document.getElementById("controls");
const song_view = document.getElementById("player");

function submitConnection() {
    let input = document.getElementById("address");
    if (!/^\d{1,3}(.\d{1,3}){3}:\d{1,5}\?[\dA-F]{8}=[\dA-F]{2}$/.test(input.value)) {
        input.style.borderColor = "red";
        return;
    }
    input = input.value;

    const address = input.split(/:/)[0];
    const port = input.split(/:/)[1].split(/\?/)[0];
    const sessionID = input.split(/:/)[1].split(/\?/)[1];
    window.electronAPI.requestToUpdateConnection("CONNECT", [address, port, sessionID]);
}

function endConnected() {
    window.electronAPI.requestToUpdateConnection("DISCONNECT", []);
    updateSong(undefined, undefined, undefined, undefined);
}


const STATUS_UI = {
    "disconnected":
        '<div class="status"><span>Status: </span><span style="color: red">Disconnected</span>\</div>' +
        '<div class="input"><label for="address"></label>' +
        '<input type="text" id="address" placeholder="Session ID"/>' +
    '   <button id="con" onclick="submitConnection()">Connect</button></div>',
    "connecting":
        '<span>Connecting...<span\>',
    "connected":
        '<div class="status"><span>Status: </span><span style="color: limegreen">Connected</span>\</div>' +
        '<div class="input"><button onclick="endConnected()">Disconnect</button></div>'
};

let status; // connection.js writes to this using updateConnectionState(state);
function updateConnectionState(state) {
    status = state;
    if (status !== "disconnected") {
        song_view.innerHTML = "";
    }
    connection_control.innerHTML = STATUS_UI[status];
}
updateConnectionState("disconnected");

function updateSong(title, uploader, url, thumbnail) {
    if (typeof title === "undefined" || title === "") {
        song_view.innerHTML = "";
        return
    }

    song_view.innerHTML =
        `<div id="video_information">
                <span>${title} by ${uploader}</span><br/>
                <a href="${url}" target="_blank">Video</a>
        </div>
            <img src="${thumbnail}" alt="thumbnail" id="thumbnail" style="width: 80px; height: 40px">
        `;
}
