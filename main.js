// Electron obal pro Test reakce – kiosk režim (celá obrazovka, bez menu)
const { app, BrowserWindow } = require('electron');
const path = require('path');

// plynulejší animace a přesnější měření: bez omezování obnovovací frekvence
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-pinch');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    kiosk: true,              // celá obrazovka bez rámu, nejde minimalizovat běžným způsobem
    autoHideMenuBar: true,
    backgroundColor: '#03113a',
    title: 'Test reakce – překonej pilota Formule 1',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'index.html'));

  // klávesy pro obsluhu: Ctrl+Q ukončí aplikaci, F11 přepne kiosk / okno
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    if (input.control && input.key.toLowerCase() === 'q') { event.preventDefault(); app.quit(); }
    if (input.key === 'F11') { event.preventDefault(); win.setKiosk(!win.isKiosk()); }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());
