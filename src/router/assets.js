const express = require("express");
const path = require("path");
const fs = require("fs");
var router = express.Router();

var imagesPath = path.join(__dirname, "../assets")


/**
  * Loads in all of the files in the `/assets` directory, then hosts them with Express.
  * @param {function} resolve
  * @param {function} reject
*/
function loadFiles(resolve, reject) {
  const files = fs.readdir(imagesPath, (err, files) => {
    if (err) {
      reject(err);
      return;
    }

    files.forEach((file) => {
      if (!file.startsWith(".")) {
        router.get('/' + file, (req, res) => {
          res.sendFile(path.join(imagesPath, file));
        });
      }
    });
    resolve(router);
  });
}


module.exports = new Promise(loadFiles);
