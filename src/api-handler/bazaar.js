const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const request = require("request");

var useCredentialsFile = false;
if (process.env["API_KEY"] == null) {
  useCredentialsFile = true;
}

var API_KEY = (!useCredentialsFile) ? (process.env.API_KEY || "") : "";

if (useCredentialsFile) {
  fs.readFile(path.join(__dirname, "../credentials.json"), (err, data) => {
    if (err) throw err;

    API_KEY = JSON.parse(data).API_KEY;

    if (API_KEY == "") {
      console.error("API Key not found.")
    }
  });
}

const BAZAAR_LINK = "https://api.hypixel.net/skyblock/bazaar";

class BazaarHandler {
  constructor(onLoad=function(keys) {}) {
    if (API_KEY == "" && !useCredentialsFile) throw "API Key not found!";

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
