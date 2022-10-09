const closeControlEl = document.getElementById('close-control')
const minimizeControlEl = document.getElementById('minimize-control')

closeControlEl.addEventListener('click', () => {
    window.electronAPI.closeWindow();
});

minimizeControlEl.addEventListener('click', () => {
    window.electronAPI.minimizeWindow();
});
