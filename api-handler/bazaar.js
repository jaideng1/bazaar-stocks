const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const request = require("request");

const API_KEY = process.env.API_KEY || "";

const BAZAAR_LINK = "https://api.hypixel.net/skyblock/bazaar";

class BazaarHandler {
  constructor(onLoad=function(keys) {}) {
    if (API_KEY == "") throw "API Key not found!";

    this.productList = [];

    this.products = [];

    this.getProductList(onLoad);
  }
  getProductList(callback) {
    var options = {
			url: BAZAAR_LINK,
			method: "GET",
			headers: {},
		};

    request(options, (err, response, body) => {
      if (response.statusCode === 200) {
        body = JSON.parse(body);
        if (body.success == true) {
          this.productList = Object.keys(body.products).sort();
          this.products = body.products;
          callback(this.productList, this);
        } else {
          console.error("There was an error getting the product keys.")
        }
      }
    })


  }
}


module.exports = { BazaarHandler }
