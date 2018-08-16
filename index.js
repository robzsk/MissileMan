const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

try {
	require('electron-reloader')(module);
} catch (err) {}

let win;

const createWindows = () => {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', () => {
  createWindows();
});
