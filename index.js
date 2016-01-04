'use strict';
var app = require('app'),
  BrowserWindow = require('browser-window'),
  client = require('electron-connect').client;

app.on('ready', function (n) {
  var mainWindow = new BrowserWindow({
    transparent: true,
    'auto-hide-menu-bar': true,
    'enable-larger-than-screen': true,
    width: 800,
    height: 600
  });
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  client.create(mainWindow);
});
