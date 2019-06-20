const { app, BrowserWindow } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
let mainWindow;

app.on('window-all-closed', function () {
	app.quit();
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			webviewTag: true,
		}
	});

	mainWindow.loadFile(__dirname + '/browser.html');
	mainWindow.openDevTools();
	electronLocalshortcut.register(mainWindow, 'F12', () => {
		mainWindow.openDevTools();
		// Open DevTools
		mainWindow.webContents.executeJavaScript('document.body.classList.toggle("controlsActive")')
		mainWindow.webContents.executeJavaScript('console.log("poop")')
	});
});
