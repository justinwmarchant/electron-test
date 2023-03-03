// Modules
const {app, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state')
const readItem = require('./readItem')
const express = require('express');
// const app = express();
const mongoose = require('mongoose')
const path = require('path')
const Item = require("./testModel")
const net = require('net');
const http = require('http');
const fs = require('fs');

mongoose.connect(
  "mongodb+srv://jmarchant:GQJcyHIgfvlDzlCo@cluster0.w0qihrr.mongodb.net/gradAssessment?retryWrites=true&w=majority")
  .then(() => console.log("connected")
  .catch((err) => console.log(err))
)

//record the HTTP requests made by the proxy server.
// const logFile = fs.createWriteStream('proxy.log', { flags: 'a' });

//receiving an instance of the Node.js net module's createServer() method, which creates a new TCP server. cb is //executed whenever a new client connects to the server.
// const server = net.createServer((socket) => {
  // used to listen for the first chunk of data sent by the client, using the socket.once() method.
  // socket.once('data', (buffer) => {
      //data converted to a string and parsed to extract the HTTP method and URL.
      // const reqData = buffer.toString();
      // const [method, url] = reqData.split(' ');

      // const requestOptions = {
      //     host: '',
      //     port: 80,
      //     path: url,
      //     method: method
      // };
      //new instance of the Node.js http module is created, with the appropriate request options (including the host and path), and a request is made to the desired website using the http.request() method.
      // const req = http.request(requestOptions, (res) => {
          //response from the website is then piped back to the client using the res.pipe() method.
      //     res.pipe(socket);
      // });

      // req.end();
      //URL of the requested website and the HTTP method are logged to a file
  //     logFile.write(`${method} ${url}\n`);
  // });
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Listen for new item request
// ipcMain.on('new-item', (e, itemUrl) => {

//   // Get new item and send back to renderer
//   readItem( itemUrl, item => {
//     e.sender.send('new-item-success', item)
//   })
// })

ipcMain.on('save-item', (e, item) => {

  // Get new item and send back to renderer
  readItem( itemUrl, item => {
    e.sender.send('new-item-success', item)
  })
})

ipcMain.handle("new-item", async (e, item) => {
  const {name, message} = item
  const newItem = new Item(item)
  const savedItem = await newItem.save()
  console.log("savedItem:", savedItem)
  const stringified = JSON.stringify(savedItem)

  // const result = 'hi'
  return stringified
  // e.reply('hi')
  //somearg.then(arg) => {e.reply("", arg)}
})

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  // express()

  // Win state keeper
  let state = windowStateKeeper({
    defaultWidth: 800, defaultHeight: 800
  })

  mainWindow = new BrowserWindow({
    x: 0, y: 0,
    width: state.defaultWidth, height: state.defaultHeight,
    minWidth: 350, minHeight: 300,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html')
  // mainWindow.loadURL('https://www.google.com')

  // Manage new window state
  state.manage(mainWindow)

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)
// app.whenReady().then(() => {
//   session.defaultSession.setProxy({
//       proxyRules: 'http://localhost:8080'
//   });

//   createWindow();
// });



// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

// server.listen(5000);