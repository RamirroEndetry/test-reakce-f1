// Electron obal pro Test reakce – kiosk režim (celá obrazovka, bez menu)
const { app, BrowserWindow, ipcMain, dialog, powerSaveBlocker } = require('electron');
const path = require('path');
const fs = require('fs');

// ---------- žebříček v souboru ----------
// Ukládá se do %APPDATA%\Test reakce F1\zebricek.json. Zápis je okamžitý a bezpečný
// (dočasný soubor + fsync + přejmenování), takže výsledky přežijí i výpadek proudu.
// Smazat je jde jen resetem s heslem v aplikaci.
const boardFile = () => path.join(app.getPath('userData'), 'zebricek.json');

function readJson(file) {
  try { const b = JSON.parse(fs.readFileSync(file, 'utf8')); return Array.isArray(b) ? b : null; }
  catch (e) { return null; }
}

ipcMain.on('board:load', (event) => {
  // při poškození hlavního souboru použij zálohu předchozí verze
  event.returnValue = readJson(boardFile()) ?? readJson(boardFile() + '.bak');
});

ipcMain.on('board:save', (event, board) => {
  try {
    const file = boardFile();
    const tmp = file + '.tmp';
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const fd = fs.openSync(tmp, 'w');
    fs.writeSync(fd, JSON.stringify(Array.isArray(board) ? board : [], null, 1));
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    if (fs.existsSync(file)) fs.copyFileSync(file, file + '.bak');
    fs.renameSync(tmp, file);
    event.returnValue = true;
  } catch (e) {
    console.error('Uložení žebříčku selhalo:', e);
    event.returnValue = false;
  }
});

// ---------- export kontaktů do PDF ----------
// Stránka pošle hotovou HTML tabulku; ta se ve skrytém okně vytiskne do PDF (A4 na šířku),
// obsluha zvolí, kam soubor uložit, a PDF se rovnou otevře v okně nad aplikací.
ipcMain.handle('contacts:pdf', async (event, html) => {
  const parent = BrowserWindow.fromWebContents(event.sender);
  const tmp = path.join(app.getPath('temp'), `brembo-f1-kontakty-${Date.now()}.html`);
  const work = new BrowserWindow({ show: false, webPreferences: { javascript: false } });
  try {
    fs.writeFileSync(tmp, String(html), 'utf8');
    await work.loadFile(tmp);
    const pdf = await work.webContents.printToPDF({ pageSize: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true });
    const { canceled, filePath } = await dialog.showSaveDialog(parent, {
      title: 'Uložit kontakty do PDF',
      defaultPath: path.join(app.getPath('desktop'), `brembo-f1-kontakty-${new Date().toISOString().slice(0, 10)}.pdf`),
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (canceled || !filePath) return { canceled: true };
    fs.writeFileSync(filePath, pdf);
    const viewer = new BrowserWindow({
      parent, width: 1200, height: 800, autoHideMenuBar: true, backgroundColor: '#ffffff',
      title: 'Kontakty – PDF', webPreferences: { plugins: true },
    });
    viewer.setMenuBarVisibility(false);
    viewer.maximize();
    viewer.loadFile(filePath).catch(() => {});
    return { path: filePath };
  } catch (e) {
    console.error('Export PDF selhal:', e);
    return { error: String((e && e.message) || e) };
  } finally {
    work.destroy();
    fs.rm(tmp, { force: true }, () => {});
  }
});

// plynulejší animace a přesnější měření: bez omezování obnovovací frekvence
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-pinch');
// Kiosk nesmí „usnout“: když Windows označí okno za zakryté (dialog, okno s PDF, zhasnutý displej, zámek
// obrazovky), Chromium jinak zpomalí časovače stránky až na jedno tiknutí za minutu – tlačítka s krátkým
// zámkem (Rozumím, Pokračovat) by zůstala neaktivní a červená by nepřecházela na zelenou.
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    kiosk: true,              // celá obrazovka bez rámu, nejde minimalizovat běžným způsobem
    autoHideMenuBar: true,
    backgroundColor: '#0f0f13',
    title: 'Test reakce – překonej pilota Formule 1',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
      backgroundThrottling: false,   // časovače a animace běží naplno, i když okno „není vidět“
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

app.whenReady().then(() => {
  powerSaveBlocker.start('prevent-display-sleep');   // na akci nesmí displej zhasnout
  createWindow();
});

app.on('window-all-closed', () => app.quit());
