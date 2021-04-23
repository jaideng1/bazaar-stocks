//Server is for Scripts and Stylesheets so I can use src="/scripts" or src="/stylesheets"
var server = require("./start-server")();

const { app, BrowserWindow } = require('electron')
const path = require('path');
//One day... it'll work...
// const { setTimeout } = require('timers/promises');
var apiHandler = require("./api-handler/api-handler.js");

/*
Any JS scripts, CSS files,  for the app will be automatically hosted if they are in the right location.

Put JS scripts in `/public/scripts`
Put CSS scripts in `/public/stylesheets`

Put assets in `/assets`

It will not host any files starting with `.`

It's hosted at localhost:5555.
You can change the port in `.env`, but you will have to replace all of the 5555 ports used in `index.html`

To reference something, use:
http://localhost:5555/<assets/scripts/stylesheets>/<file>.[?]

You can look at `start-server.js` if you want to look for yourself.

This program will only request data from hypixel.net, api.hypixel.net and any links for forum avatars.
*/

var bazaarHandler, auctionHandler, win;

var sentBazaarData = false;

/**
  * Gets the BazaarHandler's data, then sends the data to the app window.
  * @param {Object} bh
*/
apiHandler.bazaarHandler.then((bh) => {
  bazaarHandler = bh;

  win.webContents.send("data", {
    productList: bh.productList,
    products: bh.products
  });

  sentBazaarData = true;
});

/**
  * Creates the app window.
*/
function createWindow () {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    }, // TODO: Maybe preload?
    frame: false,
    titleBarStyle: 'hidden'
  })

  win.loadFile(__dirname + '/app-pages/index.html')

  win.once('ready-to-show', () => {
    //Just send the data again if it was already sent out.
    if (sentBazaarData) {
      setTimeout(() => {
        win.webContents.send("data", {
          productList: bazaarHandler.productList,
          products: bazaarHandler.products
        });
      }, 100);
    }
  });


}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
