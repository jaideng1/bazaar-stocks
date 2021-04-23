var productKeys = [];
var products = [];
var formattedKeys = false;

var stocksContainer = document.getElementById("stocks");

/**
  * Gets the average amount of buy orders went through (how many people were selling it).
  * @returns {number}
*/
function getAverageSellMovingWeek() {
  let totalSMW = 0;
  let totalAmount = productKeys.length;
  productKeys.forEach((key) => {
    let item = products[key];
    if (item.quick_status.sellMovingWeek == 0) {
      totalAmount--;
    } else {
      totalSMW += item.quick_status.buyMovingWeek;
    }
  });

  return totalSMW / totalAmount;
}

/**
 * Called from index.html for when it recieved the data from api.hypixel.net
 * @param {Object} beData
*/
function onRecieveKeys(beData) {
  if (formattedKeys) return;

  productKeys = beData.productList;
  products = beData.products;

  let avgSMW = getAverageSellMovingWeek();

  for (let key of productKeys) {
    let divEle = document.createElement("div");

    divEle.onclick = () => { switchToInfo(key) }

    divEle.id = key;

    stocksContainer.appendChild(divEle);

    let aEle = document.createElement("p");
    aEle.textContent = getInitials(key.replaceAll("_", " ").toUpperCase());

    let descEle = document.createElement("p");
    descEle.textContent = titleCase(key.replaceAll("_", " ").toLowerCase());

    descEle.classList.add("stock-desc");

    // let canvasStats = document.createElement("canvas");
    //
    // canvasStats.height = "30px";
    // canvasStats.width = "60px";
    // canvasStats.style = "height: 30px; width: 60px;"

    let priceEle = document.createElement("p");

    let quickStatus = products[key].quick_status;

    priceEle.innerHTML = limitToMaxPriceLength(roundDown(Math.round(quickStatus.buyPrice)));
    priceEle.classList.add("stock-price");
    priceEle.title = "Sell Price: " + commaNumber(Math.round(quickStatus.buyPrice));

    let mrktCap = document.createElement("p");

    mrktCap.textContent = Math.ceil(Math.random() * 5) + "b";
    mrktCap.classList.add("mrkt-cap");
    mrktCap.id = "mrkt-cap-" + key.toLowerCase();
    mrktCap.onclick = switchMode;
    mrktCap.onmouseover = () => {
      hoverOverModeButton = true;
    }
    mrktCap.onmouseout = () => {
      hoverOverModeButton = false;
    }
    mrktCap.style = "background-color: " + ((products[key].quick_status.sellMovingWeek >= avgSMW) ? "#34eb46" : "#e03b22")

    divEle.appendChild(aEle)
    setTimeout(() => {
      divEle.appendChild(descEle);
      divEle.appendChild(priceEle);
      divEle.appendChild(document.createElement("br"));
      divEle.appendChild(mrktCap)

      // divEle.appendChild(canvasStats);
      //
      // formatCanvas(canvasStats)
    }, 10)
  }

  formattedKeys = true;

  setTimeout(() => {
    switchMode();
  }, 100)
}

var itemInfoElement = document.getElementById("item-info");

var hoverOverModeButton = false;

var lastClickedOn = "";

/**
 * Whenever someone clicks on a side bar div.
 * @param {string} key
*/
function switchToInfo(key) {
  if (hoverOverModeButton) return;

  if (key == "news") {
    if (showingInfo) {
      showingInfo = false;
      document.getElementById("info-title").textContent = "Recent Threads";

      getGeneralDiscussion();
    }
    return;
  }

  if (lastClickedOn != "") document.getElementById(lastClickedOn).classList.remove("scroll-news-clicked"); //Non-active color

  lastClickedOn = key;

  document.getElementById(key).classList.add("scroll-news-clicked"); //Active color

  let product = products[key];

  showingInfo = true;
  threadsElement.innerHTML = "";
  itemInfoElement.innerHTML = "";

  document.getElementById("info-title").textContent = getInitials(key.replaceAll("_", " "));

  let quickStatus = product.quick_status;

  let divEle = document.createElement("div");

  itemInfoElement.appendChild(divEle);

  //Note: Buy and Sell are flipped around.
  //Buy is how much you can sell it for, and sell is how much you can buy it for
  let infos = [
    "Buy Price (Instant Sell Price): " + commaNumber(Math.round(quickStatus.sellPrice)),
    "Buy Moving Week: " + commaNumber(quickStatus.sellMovingWeek) + " (Average: " + commaNumber(Math.round(getAverageSellMovingWeek())) + ")",
    "Buy Volume: " + commaNumber(quickStatus.sellVolume),
    "Current Amount of Buy Orders: " + commaNumber(quickStatus.sellOrders),
    "Sell Price (Instant Buy Price): " + commaNumber(Math.round(quickStatus.buyPrice)),
    "Sell Moving Week: " + commaNumber(quickStatus.buyMovingWeek),
    "Sell Volume: " + commaNumber(quickStatus.buyVolume),
    "Current Amount of Sell Orders: " + commaNumber(quickStatus.buyOrders)
  ];

  for (let info of infos) {
    let pEle = document.createElement("p");
    pEle.textContent = info;
    divEle.appendChild(pEle);
  }

}

/**
  * Eventually if I use a canvas, this would be the function to draw on it.
  * @param {Object} canvas
*/
function formatCanvas(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#34eb46"; //For green
  // ctx.fillStyle("#e03b22") //For red
  ctx.fillRect(0, 0, 60, 30)
}

var lastHeight = 800;
var infoContainer = document.getElementById("info");

/**
  * Adjusts the height of the different elements on the page.
*/
function adjustHeight() {
  if (window.innerHeight != lastHeight) {
    lastHeight = window.innerHeight;
    stocksContainer.style = "height: " + (lastHeight - 100) + "px";
    infoContainer.style = "height: " + (lastHeight - 190) + "px";
  }
}

//Change heights of stuff idk
window.onresize = adjustHeight;

adjustHeight();

/**
  * Formats strings in title case.
  * @param {string} str
  * @returns {string}
*/
function titleCase(str) {
  let spltStr = str.split(" ");

  for (let i = 0; i < spltStr.length; i++) {
    let splitWord = spltStr[i].split("")
    let firstChar = splitWord.splice(0, 1)[0];
    spltStr[i] = firstChar.toUpperCase() + splitWord.join("");
  }
  return spltStr.join(" ");
}

/**
  * Gets the initials of a string.
  * @param {string} str
  * @returns {string}
*/
function getInitials(str) {
  let splitStr = str.split(" ");
  let newStr = [];

  for (let splitst of splitStr) {
    newStr.push(splitst.split("")[0]);
  }

  return newStr.join("");
}

var mode = -1;
//or something like thhs idk
//0: Sell Moving Week, how many items sold were actually sold (over the last 7 days)
//1: loop through, order amount * order price per unit, add up the sum - is this market cap? idk economics
//2: Buy Volume

/**
  * Whenever you click on the small bubbles on the side bar, it'll call this to switch the data around;
*/
function switchMode() {
  let infoEles = document.getElementsByClassName("mrkt-cap");

  mode = (mode + 1) % 3;

  document.getElementById("mrkt-cap-title").innerHTML = (mode == 0) ? "SMW" : ((mode == 1) ? "MC" : "Orders")
  document.getElementById("mrkt-cap-title").title = (mode == 0) ? "Sell Moving Week" : ((mode == 1) ? "Market Cap" : "Buy Orders");

  switch (mode) {
    case 0:
      //Get the Gain
      for (let ele of infoEles) {
        let key = ele.id.replace("mrkt-cap-", "").toUpperCase();
        if (key == "TITLE") continue;

        let quickStatus = products[key].quick_status;

        ele.textContent = limitToMaxPriceLength(roundDown(quickStatus.sellMovingWeek), 4);
      }
      break;
    case 1:
      //Market Cap
      for (let ele of infoEles) {
        let key = ele.id.replace("mrkt-cap-", "").toUpperCase();
        if (key == "TITLE") continue;

        let quickStatus = products[key].quick_status;
        let finalAmount = 0;
        for (let sellOrder of products[key].sell_summary) {
          finalAmount += sellOrder.amount * sellOrder.pricePerUnit;
        }
        ele.textContent = limitToMaxPriceLength(roundDown(Math.round(finalAmount)), 4);
      }
      break;
    default:
      //Get Market Data
      for (let ele of infoEles) {
        let key = ele.id.replace("mrkt-cap-", "").toUpperCase();
        if (key == "TITLE") continue;

        let quickStatus = products[key].quick_status;
        ele.innerHTML = limitToMaxPriceLength(roundDown(Math.round(quickStatus.buyVolume)), 4);
      }

  }
}

const MAX_PRICE_LENGTH = 5; //How many characters it can be.
const HTML_SPACE = "&nbsp;";

/**
  * Adds in `&nbsp;`s to strings that are shorter than the specified length.
  * @param {string} str
  * @param {string} [len=MAX_PRICE_LENGTH]
  * @returns {string}
*/
function limitToMaxPriceLength(str, len=MAX_PRICE_LENGTH) {
  if (str.length < len) {
    let splitStr = str.split("");
    for (let i = 0; i < len - str.length; i++) {
      splitStr.unshift(HTML_SPACE);
    }
    return splitStr.join("");
  }
  return str;
}

//did you know that i randomly found that log had a good use when i was messing with a calculator
//thank you past myself for messing with a calculator
/**
  * Adds in symbols to numbers (such as: k, m, b, ect.)
  * @param {number} n
  * @returns {string}
*/
function roundDown(n) {
  let logN = Math.floor(Math.log10(n));
  let symbol = "";
  let away = 0;
  if (inBetween(logN, 3, 5)) {
    symbol = "k";
    away = logN - 3;
  } else if (inBetween(logN, 6, 8)) {
    symbol = "m";
    away = logN - 6;
  } else if (inBetween(logN, 9, 11)) {
    symbol = "b";
    away = logN - 9;
  } else if (inBetween(logN, 12, 14)) {
    symbol = "t";
    away = logN - 12;
  } else if (logN > 14) {
    symbol = "q+";
    away = logN - 14;
  }

  if (symbol != "") {
    let splitStrN = (n + "").split("");
    return splitStrN[0] + ((away == 0) ? "." : "") + splitStrN[1] + ((away == 1) ? "." : "") + splitStrN[2] + symbol;
  }

  return n;
}

/**
  * Gets if the specified number is between/equals the min and/or max.
  * @param {number} n
  * @param {number} min
  * @param {number} max
  * @returns {boolean}
*/
function inBetween(n, min, max) {
  return n >= min && n <= max;
}

/**
  * Puts commas in a number to make it easier to read.
  * @param {number} n
  * @returns {string}
*/
function commaNumber(n) {
  let splitN = (n + "").split("").reverse();
  let finaln = [];
  for (let i = 0; i < splitN.length; i++) {
    finaln.unshift(splitN[i]);
    if (i <= splitN.length - 2 && (i + 1) % 3 == 0 && i != 0) {
      finaln.unshift(",");
    }
  }
  return finaln.join("");
}
