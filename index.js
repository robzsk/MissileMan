const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

try {
	require('electron-reloader')(module);
} catch (err) {}

let win1, win2;

const createWindows = () => {
  win1 = new BrowserWindow({ width: 800, height: 600 });
  win1.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  win1.on('closed', () => {
    win1 = null;
  });

  // win2 = new BrowserWindow({ width: 800, height: 600 });
  // win2.loadURL(url.format({
  //   pathname: path.join(__dirname, 'views', 'win2.html'),
  //   protocol: 'file:',
  //   slashes: true,
  // }));
  // win2.on('closed', () => {
  //   win2 = null;
  // })
}

// ... and other usual stuff ... //

app.on('ready', () => {
  createWindows();

  // this is all that you have to add to your main app script.
  // run your app normally with electron, then it will be reloaded
  // based on how you define references here
  // elemon({
  //   app: app,
  //   mainFile: 'main.js',
  //   bws: [
  //     {bw: win1, res: ['win1.html', 'win1.js', 'style.css']},
  //     {bw: win2, res: ['win2.html', 'win2.js', 'style.css']}
  //   ]
  // })
});
