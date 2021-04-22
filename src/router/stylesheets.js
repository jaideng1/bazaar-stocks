const express = require("express");
const path = require("path");
const fs = require("fs");
var router = express.Router();

var stylesheetsPath = path.join(__dirname, "../public/stylesheets")


function loadFiles(resolve, reject) {
  const files = fs.readdir(stylesheetsPath, (err, files) => {
    if (err) {
      reject(err)
      return;
    }

    files.forEach((file) => {
      if (!file.startsWith(".")) {
        router.get('/' + file, (req, res) => {
          res.sendFile(path.join(stylesheetsPath, file));
        });
      }
    });
    resolve(router);
  });
}


module.exports = new Promise(loadFiles);
