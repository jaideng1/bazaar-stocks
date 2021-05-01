const { getCurrentCommits, getCurrentVersion } = require("./src/getGithubData.js");
const path = require("path");
const colors = require("colors");
const fs = require("fs");

function main() {
  getCurrentCommits().then((n) => {
    getCurrentVersion().then((v) => {

      console.log(colors.green("Updating saved info to the file."))
      console.log(colors.yellow("⚠ Warning: This does not mean that the program is being updated. It just removes the message until there is another commit."))

      fs.readFile(path.join(__dirname, "src/data.json"), (err, data) => {
        if (err) throw err;

        data = JSON.parse(data);

        data.last_commits = n;
        data.last_version = v;

        fs.writeFile(path.join(__dirname, "src/data.json"), JSON.stringify(data), (err) => {
          if (err) throw err;

          console.log(colors.green("Finished."))
        })
      })
    }).catch((err) => { console.error(err); });
  }).catch((err) => { console.error(err); });
}


main();
