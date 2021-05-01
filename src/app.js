/*
* Bazaar Stocks
* Made by jaideng1
* Link: https://github.com/jaideng1/bazaar-stocks
*/

//TODO: change the data.json file to be stored in another location instead of the local one.

//Server is for Scripts and Stylesheets so I can use src="/scripts" or src="/stylesheets"
var server = require("./start-server")();

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const request = require('request');
const fs = require('fs');

const colors = require('colors');

var apiHandler = require("./api-handler/api-handler.js");
var { getCurrentCommits, getCurrentVersion } = require("./getGithubData.js")

//Check if a .env file exists to set the IN_DEVELOPMENT variable
var IN_DEVELOPMENT = false;
inDevelopment().then((bool) => {
  IN_DEVELOPMENT = bool;
});

var APPLICATION_DATA_PATH = process.env.APPDATA || "NOT_STORED_IN_ENV";

//Could've done a one-liner, but it's easier to see like this.
if (APPLICATION_DATA_PATH == "NOT_STORED_IN_ENV") {
  if (process.platform == "darwin") {
    //IK it should prob be different, but yeah
    APPLICATION_DATA_PATH = path.join(process.env.HOME, "/Library");
  } else if (process.platform == "win32") {
    //This is a bit unnecessary, but just in case ¯\_(ツ)_/¯
    APPLICATION_DATA_PATH = path.join(process.env.HOME, "/AppData/Roaming");
  } else if (process.platform == "linux") {
    APPLICATION_DATA_PATH = path.join(process.env.HOME, "/.local/share");
  } else {
    APPLICATION_DATA_PATH = process.env.HOME;
  }
}

console.log("Application Data path set as: " + APPLICATION_DATA_PATH)

/**
  * Creates the bazaar-stocks-data folder if it's not created yet in the app data folder.
*/
function checkAndCreateApplicationDataFolder() {
  let folderPath = path.join(APPLICATION_DATA_PATH, "bazaar-stocks-data");

  fs.access(folderPath, (err) => {
    if (err) { //File Doesn't Exist
      console.log("Application data folder for this program doesn't exist, creating it.");
      fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
          throw err;
        }

        createDataFile(folderPath);
      })
      return;
    }
    console.log("Application data folder for this program exists. Setting the data path to refer to it.");
    createDataFile(folderPath)
  });
}

var pathToDataFile = path.join(__dirname, "data.json");

/**
  * Creates the data.json in the app data folder.
*/
function createDataFile(folderPath) {
  let json_path = path.join(folderPath, "data.json");
  fs.access(json_path, (err) => {
    if (err) {
      console.log(colors.red("data.json doesn't exist - creating it."))

      fs.readFile(path.join(__dirname, "data.json"), (err, data) => {
        if (err) throw err;

        fs.writeFile(json_path, data, (err) => {
          if (err) throw err;

          console.log(colors.green("✓ Finished writing to " + json_path));

          pathToDataFile = json_path;
        })
      })

      return;
    }

    console.log(colors.green("✓ data.json exists."))
    console.log("Path: " + json_path)

    pathToDataFile = json_path;
  });
}

if (IN_DEVELOPMENT) checkAndCreateApplicationDataFolder();

/*
Any JS scripts, CSS files, or assets for the app will be automatically hosted if they are in the right location.

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
function createWindow() {
  let options = {}; // TODO: Maybe preload?
  if (process.platform == "darwin") { //MacOS works with the frame disabled.
    options = {
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
      frame: false,
      titleBarStyle: 'hidden'
    };
  } else {
    options = {
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
      frame: true //For now, it's a bit weird on other systems, so it's easier if it's enabled.
    };
  }

  win = new BrowserWindow(options);

  win.loadFile(__dirname + '/app-pages/index.html')

  win.once('ready-to-show', () => {
    loadInStoredData()

    //Just send the data again if it was already sent out.
    if (sentBazaarData) {
      setTimeout(() => {
        win.webContents.send("data", {
          productList: bazaarHandler.productList,
          products: bazaarHandler.products
        });
      }, 100);

      //Every 3 minutes, update
      setInterval(() => {
        bazaarHandler.getProductList((productList, bh) => {
          if (win == null) return;

          win.webContents.send("dataupdate", {
            productList: productList,
            products: bh.products
          });
        });
      }, 3 * 60 * 1000)
    }
  });

}

function createUpdateWindow() {
  let updateWin = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    }
  });

  updateWin.loadFile(path.join(__dirname, "app-pages/update.html"));

  updateWin.once('ready-to-show', () => {
    setTimeout(() => {
      updateWin.webContents.send("update-info", {
        oldVersion: repoData.stored.version,
        newVersion: repoData.current.version
      })
    }, 50)
  })
}

ipcMain.on("no-show-update", (e, dt) => {
  if (dt) {
    console.log("Not going to show update info for " + repoData.current.version + " until there is a new version.")

    let dataPath = pathToDataFile;
    fs.readFile(dataPath, (err, dt) => {
      if (err) throw err;

      dt = JSON.parse(dt);
      dt.showAgain = false;

      fs.writeFile(dataPath, JSON.stringify(dt), (err) => {
        if (err) throw err;
      })
    })
  }
})

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
});

/**
  * Gets a certain file to see if this is in development or in production
  * @returns {Promise}
*/
function inDevelopment() {
  return new Promise((resolve, reject) => {
    fs.access(path.join(__dirname, "../.env"), fs.F_OK, (err) => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    })
  });
}


//UPDATING CONTENT
//The content below is best not to be touched if you aren't making your own branch.

/**
  * Gets all of my (jaideng1's) repos and gets *this* repo data.
*/
async function loadInStoredData() {
  fs.readFile(pathToDataFile, (err, data) => {
    if (err) throw err;

    data = JSON.parse(data);

    repoData.stored.commits = data.last_commits;
    repoData.stored.version = data.last_version;

    repoData.last_seen.commits = data.latest_seen_commits;
    repoData.last_seen.version = data.latest_seen_version;

    displayUpdateWindow = data.showAgain;

    getCurrentCommits().then((n) => {
      repoData.current.commits = n;

      getCurrentVersion().then((v) => {
        repoData.current.version = v;

        storeLatestSeenData();
      }).catch((err) => { console.error(err); });
    }).catch((err) => { console.error(err); });
  });
}

var repoData = {
  stored: {
    commits: 0,
    version: ""
  },
  current: {
    commits: 0,
    version: ""
  },
  last_seen: {
    commits: 0,
    version: ""
  }
}

var displayUpdateWindow = true;

/**
  * Stores the latest seen version/commits
*/
function storeLatestSeenData() {
  let dataPath = pathToDataFile;
  fs.readFile(dataPath, (err, dt) => {
    if (err) throw err;

    dt = JSON.parse(dt);

    dt.latest_seen_commits = repoData.current.commits;
    dt.latest_seen_version = repoData.current.version;

    fs.writeFile(dataPath, JSON.stringify(dt), (err) => {
      if (err) throw err;

      checkUpdates();
    })
  })
}

/**
  * Warns the user if their copy of bazaar-stocks is behind the current version.
*/
function checkUpdates() {
  let differentLastSeenData = false;
  let dataFile = pathToDataFile;

  if (repoData.stored.version == "v0" || repoData.stored.commits == -1) {
    //This means that it's a new version of the app, so you can just skip the bottom process.

    fs.readFile(dataFile, (err, dt) => {
      if (err) throw err;

      dt = JSON.parse(dt);

      dt.last_commits = repoData.current.commits;
      dt.last_version = repoData.current.version;

      fs.writeFile(dataFile, JSON.stringify(dt), (err) => { if (err) throw err; })

      return;
    })

  }

  if (repoData.last_seen.commits != repoData.current.commits || repoData.last_seen.version != repoData.current.version) {
    differentLastSeenData = true;
  }

  if (IN_DEVELOPMENT) {
    if (repoData.current.commits > repoData.stored.commits) {
      console.log(colors.yellow("⚠ Warning: There have been new commits made to the GitHub page."))
      console.log(colors.yellow("This bazaar-stocks fork only has " + repoData.stored.commits + " commits, and the GitHub page has " + repoData.current.commits + " commits."))
    } else if (repoData.current.commits == repoData.stored.commits) {
      console.log(colors.green("✓ Up to date. (Commits: " + repoData.current.commits + ")"))
    } else {
      console.log(colors.red("✖ Error! The commits stored (" + repoData.stored.commits + " commits) is larger than the GitHub page commits (" + repoData.current.commits + " commits)."))
      console.log(colors.red("This won't do anything, but it's unwise to edit the ") + colors.magenta("data.json") + colors.red(" file."))
    }
  } else {
    if (repoData.current.version != repoData.stored.version) {

      console.log(colors.yellow("⚠ Warning: The currently installed version of the app is behind the latest verison."))
      console.log(colors.yellow("Downloaded version: " + repoData.stored.version + ", latest version: " + repoData.current.version + "."))

      if (!displayUpdateWindow && !differentLastSeenData) {
        console.log(colors.yellow("The update window won't display due to the 'do not show again' button."))
        return;
      }

      if (differentLastSeenData) {
        console.log(colors.yellow("The new update is different than the last seen latest update, so a prompt will be displayed."));

        fs.readFile(dataFile, (err, data) => {
          if (err) throw err;

          data = JSON.parse(data);

          data.showAgain = true;
          fs.writeFile(dataFile, JSON.stringify(data), (err) => { if (err) throw err; })
        })
      }

      createUpdateWindow();
    } else {
      console.log(colors.green("✓ Up to date. (Version: " + repoData.current.version + ")"))
    }
  }
}
