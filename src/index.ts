import * as electron from 'electron';

const app = electron.app;
let mainWindow: electron.BrowserWindow | null;

function createWindow() {
    mainWindow = new electron.BrowserWindow({width: 1000, height: 600});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});
