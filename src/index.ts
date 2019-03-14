import * as path from 'path';
import * as electron from 'electron';

const app = electron.app;
let main: electron.BrowserWindow | null;

function createWindow() {
	main = new electron.BrowserWindow({
		width: 1200,
		height: 820,
		icon: path.join(__dirname, 'assets/monet.png')
	});
	main.loadURL(`file://${__dirname}/index.html`);
	// main.loadURL(`http://localhost:8081`);

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
