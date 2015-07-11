'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
const console = require('console');

// report crashes to the Electron project
require('crash-reporter').start();
// better debug tooling
require('electron-debug')();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow (path, width, height, offsetX) {
	const win = new BrowserWindow({
		x: offsetX || 0,
		width: width || 600,
		height: height || 400,
		resizable: true
	});

	win.loadUrl(`file://${__dirname}/${path}`);
	win.on('closed', onClosed);

	return win;
}

function onClosed() {
	// deref the window
	// for multiple windows store them in an array
	controlPanel = null;
}

// prevent window being GC'd
let controlPanel;
let displayPanel;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!controlPanel) {
		controlPanel = createMainWindow();
	}
});

const competitionTime = 5 * 60 * 1000; //5min

app.on('ready', function () {
	displayPanel = createMainWindow('display-panel.html', 600, 400, 5000);
	controlPanel = createMainWindow('control-panel.html', 600, 400, 0);

	controlPanel.webContents.on('did-finish-load', function() {
		//do something
  });
	displayPanel.webContents.on('did-finish-load', function() {
		displayPanel.webContents.send('timer', {clear: true});
	});

	var ipc = require('ipc');

	ipc.on('timer', function(event, arg) {
		displayPanel.webContents.send('timer', arg);
	});
});
