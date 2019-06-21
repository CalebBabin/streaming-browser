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

	mainWindow.setMenuBarVisibility(false);

	mainWindow.loadFile(__dirname + '/browser.html');
	electronLocalshortcut.register(mainWindow, 'F12', () => {
		mainWindow.webContents.executeJavaScript('document.body.classList.toggle("controlsActive")')
	});

	let devtools = false;
	electronLocalshortcut.register(mainWindow, 'CommandOrControl+Shift+I', () => {
		devtools = !devtools;
		if (devtools) {
			mainWindow.setMenuBarVisibility(true);
			mainWindow.openDevTools();
		} else {
			mainWindow.closeDevTools();
			mainWindow.setMenuBarVisibility(false);
		}
	});
});
