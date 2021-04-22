const path = require("path");
const { BazaarHandler } = require("./bazaar.js")

let bh = new Promise((resolve, reject) => {
  let bh = new BazaarHandler((keys, bhObj) => {
    resolve(bhObj)
  });
});

module.exports = {
  bazaarHandler: bh,
  auctionHandler: null
}
