require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT || 5555;

/**
  * Starts hosting a server with Express, then hosts all of the needed files.
*/
function startServer() {
  var app = express();

  app.get('/', (req, res) => {
    res.sendStatus(404);
  });

  app.listen(PORT, () => {
    console.log("Server started on port " + PORT + ".");
  });

  let scriptsPromise = require("./router/scripts.js");
  let stylesheetsPromise = require("./router/stylesheets.js");
  let assetsPromise = require("./router/assets.js")

  scriptsPromise.then((scriptRouter) => {
    app.use("/scripts", scriptRouter)
  }).catch((err) => {
    console.error(err)
  })

  stylesheetsPromise.then((stylesheetRouter) => {
    app.use("/stylesheets", stylesheetRouter);
  }).catch((err) => {
    console.error(err);
  });

  assetsPromise.then((assetsRouter) => {
    app.use("/assets", assetsRouter);
  }).catch((err) => {
    console.error(err);
  });

  return app;
}

module.exports = startServer;
