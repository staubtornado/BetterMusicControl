// Stackoverflow

// document.addEventListener('keydown', (event) => {
//     const name = event.key;
//     const code = event.code;
//     // Alert the key name and key code on keydown
//     alert(`Key pressed ${name} \r\n Key code value: ${code}`);
// }, false);

const net = require('net');
const client = new net.Socket();

const HOST = "164.92.185.110";
const PORT = 65432;

const STATUS_UI = {
    "disconnected": "<input>"
}




let connected = false;

function onDataArrival(data) {
    console.log(data.toString());
}

function establishConnection() {
    client.connect({port: PORT, host: HOST}, () => {
        client.write("Hello World\r");
    });
    client.on('data', onDataArrival);
    connected = true;
}

function closeConnection() {
    client.end(() => {
        connected = false;
    });
}

function sendData(data) {
    client.write(String(data));
}

function hotkeyEvent() {
    sendData("MediaPlay/Pause Button Pressed.");
}
establishConnection();
