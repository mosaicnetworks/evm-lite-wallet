import * as electron from 'electron';
import { default as installExtension, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

const app = electron.app;
let main: electron.BrowserWindow | null;

installExtension(REACT_DEVELOPER_TOOLS)
	.then((name) => console.log(`Added Extension:  ${name}`))
	.catch((err) => console.log('An error occurred: ', err));

function createWindow() {
	main = new electron.BrowserWindow({
		width: 1200,
		height: 820
	});
	// main.loadURL(`file://${__dirname}/index.html`);
	main.loadURL(`http://localhost:8081`);
	main.webContents.openDevTools();

	main.on('closed', () => {
		main = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (main === null) {
		createWindow();
	}
});
