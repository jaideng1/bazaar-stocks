const axios = require('axios');
const $ = require('cheerio');

const GITHUB_LINKS = {
  REPOS: "https://api.github.com/users/jaideng1/repos",
  THIS_REPO: "https://github.com/jaideng1/bazaar-stocks",
  THIS_REPO_RELEASES: "https://github.com/jaideng1/bazaar-stocks/releases"
};

/**
  * Gets the current number of commits from the GitHub page.
*/
function getCurrentCommits() {
  return new Promise((resolve, reject) => {
    axios.get(GITHUB_LINKS.THIS_REPO).then((data) => {
      //https://github.com/jaideng1/bazaar-stocks/commits/main
      let html = data.data;

      let aElements = $("a", html);

      for (let aElement of aElements) {
        if (aElement.attribs.href.includes("jaideng1/bazaar-stocks/commits/main")) {
          let children = aElement.children;

          for (let child of children) {
            if (child.name == "span") {
              let _children = child.children;
              for (let _child of _children) {
                if (_child.name == "strong") {
                  console.log("Current Repo Commits: " + _child.children[0].data);
                  let n = 0;
                  try {
                    n = parseInt(_child.children[0].data);
                  } catch (e) {
                    reject("Error on parsing int.")
                  }

                  resolve(n);
                }
              }
            }
          }
        }
      }
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
  * Gets the current version from the GitHub page.
*/
function getCurrentVersion() {
  return new Promise((resolve, reject) => {
    axios.get(GITHUB_LINKS.THIS_REPO_RELEASES).then((data) => {
      let html = data.data;
      let releases = $(".release-entry", html);

      for (let release of releases) {
        let chEle = null;
        release.children.forEach((el) => {
          if (el.name == "div") {
            chEle = el;
          }
        })
        let divEle = chEle.children[1];

        for (let ele of divEle.children) {
          if (ele.name == "ul") {
            let aEle = ele.children[1].children[1];
            for (let _ele of aEle.children) {
              if (_ele.name == "span") {
                console.log("Latest App Version: " + _ele.children[0].data);

                resolve(_ele.children[0].data)
                return;
              }
            }
          }
        }
      }
    }).catch((err) => {
      reject(err);
    })
  });
}

module.exports = { getCurrentCommits, getCurrentVersion }
