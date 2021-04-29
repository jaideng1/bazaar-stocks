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

/**
  * Updates the data on the page.
*/
function updateSideData(beData) {
  productKeys = beData.productList;
  products = beData.products;

  let avgSMW = getAverageSellMovingWeek();

  for (let key of productKeys) {
    let divEle = document.getElementById(key);
    divEle.innerHTML = "";

    let aEle = document.createElement("p");
    aEle.textContent = getInitials(key.replaceAll("_", " ").toUpperCase());

    let descEle = document.createElement("p");
    descEle.textContent = titleCase(key.replaceAll("_", " ").toLowerCase());
    descEle.classList.add("stock-desc");

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
    }, 10);
  }

  setTimeout(() => {
    let savedMode = mode;
    mode = -1;
    for (let i = -1; i < savedMode; i++) switchMode();
  }, 20);
}

var hoverOverModeButton = false;

var lastClickedOn = "";

/**
  * Creates a canvas with information based off of the order information.
  * @param {Array} buyOrdersInfo
  * @param {Array} sellOrdersInfo
  * @param {Object} [mouseData=null]
  * @param {Object} [orderDataElement=null]
  * @returns {Object}
*/
function createCanvasWithOrdersInfo(BOI, SOI, mouseData=null, orderDataElement=null) {
  //Copy it cause it references the main object
  let buyOrdersInfo = JSON.parse(JSON.stringify(BOI));
  let sellOrdersInfo = JSON.parse(JSON.stringify(SOI));

  let canvas = document.createElement("canvas");
  canvas.height = 300;
  canvas.width = 600;

  var ctx = canvas.getContext("2d");

  if (buyOrdersInfo.length == 0 || sellOrdersInfo.length == 0) {
    ctx.fillStyle = "#adadad";
    ctx.font = "30px Arial";
    ctx.fillText("Not Enough Data", Math.floor((600 / 2) - (("Not Enough Data".length / 2) * 17)), 136);
    return { canvas };
  }

  //Expand the buy orders
  for (let buyOrder of buyOrdersInfo) {
    if (buyOrder.orders > 1) {
      for (let o = 1; o < buyOrder.orders; o++) {
        buyOrdersInfo.push({
          pricePerUnit: buyOrder.pricePerUnit,
          amount: buyOrder.amount,
          orders: 1,
        });
      }
    }
  }

  //Expand the sell orders
  for (let sellOrder of sellOrdersInfo) {
    if (sellOrder.orders > 1) {
      for (let o = 1; o < sellOrder.orders; o++) {
        sellOrdersInfo.push({
          pricePerUnit: sellOrder.pricePerUnit,
          amount: sellOrder.amount,
          orders: 1,
        });
      }
    }
  }

  let len = (buyOrdersInfo.length <= sellOrdersInfo.length) ? buyOrdersInfo.length : sellOrdersInfo.length;
  let widthPer = Math.floor(600 / len);

  let linePerPixels = 40; //Per how many pixels there are between lines

  ctx.fillStyle = "#616161";

  //Fill in horozontal lines
  for (let l = 0; l < (600 / linePerPixels) - 1; l++) {
    ctx.fillRect(0, (l + 1) * linePerPixels, 601, 3);
  }

  //TODO: Make tics to seperate each order
  // var dividedBy = 1; //To space out the lines a bit
  //
  // //Fill in vertical lines
  // for (let ys = 0; ys < Math.round(len / dividedBy) + 1; ys++) {
  //   ctx.fillRect((ys * dividedBy) * widthPer, 0, 3, 601)
  // }


  ctx.fillStyle = "#34eb46";

  //Sort the buy orders from lowest to highest pricePerUnit
  buyOrdersInfo.sort((a, b) => {
    return a.pricePerUnit - b.pricePerUnit;
  });

  //Sort the sell orders from lowest to highest pricePerUnit
  sellOrdersInfo.sort((a, b) => {
    return a.pricePerUnit - b.pricePerUnit;
  });

  sellOrdersInfo.push({
    pricePerUnit: sellOrdersInfo[sellOrdersInfo.length - 1].pricePerUnit,
    amount: sellOrdersInfo[sellOrdersInfo.length - 1].amount,
    orders: 1,
  })

  buyOrdersInfo.push({
    pricePerUnit: buyOrdersInfo[buyOrdersInfo.length - 1].pricePerUnit,
    amount: buyOrdersInfo[buyOrdersInfo.length - 1].amount,
    orders: 1,
  });

  let lowestBuyOrder = buyOrdersInfo[0].pricePerUnit;
  let highestBuyOrder = buyOrdersInfo[buyOrdersInfo.length - 1].pricePerUnit;
  let adjBuyOrderP = highestBuyOrder - lowestBuyOrder;

  let lowestSellOrder = sellOrdersInfo[0].pricePerUnit;
  let highestSellOrder = sellOrdersInfo[sellOrdersInfo.length - 1].pricePerUnit
  let adjSellOrderP = highestSellOrder - lowestSellOrder;

  let lowestPrice = (lowestBuyOrder <= lowestSellOrder) ? lowestBuyOrder : lowestSellOrder;
  let highestPrice = (highestBuyOrder >= highestSellOrder) ? highestBuyOrder : highestSellOrder;
  let adjOrderP = highestPrice - lowestPrice;

  let addlAmount = 1, newInfo = {
    sell: [],
    buy: []
  };

  for (let i = 0; i < len; i++) {
    let thisYCord = 199 - (200 * ((buyOrdersInfo[i].pricePerUnit - lowestPrice) / adjOrderP)) + 10;
    let nextYCord = 199 - (200 * (((buyOrdersInfo[i + 1].pricePerUnit || buyOrdersInfo[i].pricePerUnit) - lowestPrice) / adjOrderP)) + 10;
    ctx.fillRect(i * widthPer, thisYCord, 1, 1);

    let startX = widthPer * i;
    let finishX = (i < len - 1) ? (widthPer * (i + 1)) : 600;

    let f = (x) => {
      let percentAcross = (x - startX) / (finishX - startX);
      return ((nextYCord - thisYCord) * percentAcross) + thisYCord;
    }

    for (let x = startX; x < finishX + 1; x += addlAmount) {
      let yCord = f(x);
      ctx.fillStyle = "#34eb46";

      if (mouseData != null) {
        if (mouseData.x >= startX && mouseData.x < finishX) {
          ctx.fillStyle = "#d0db35";
        }
      }

      if (x == startX) ctx.fillStyle = "#757575";

      ctx.fillRect(x, (x != startX) ? yCord : yCord - 2, 2, (x != startX) ? clamp(f(x - addlAmount) - yCord, 3, 10000) + 2 : clamp(f(x + addlAmount) - yCord, 3, 10000) + 4);
    }

    newInfo.buy.push({
      amount: buyOrdersInfo[i].amount,
      pricePerUnit: buyOrdersInfo[i].pricePerUnit,
      start: {
        x: startX,
        y: f(startX)
      },
      finish: {
        x: finishX,
        y: f(finishX)
      },
      f,
    });
  }

  for (let j = 0; j < len; j++) {
    let thisYCord = 199 - (200 * ((sellOrdersInfo[j].pricePerUnit - lowestPrice) / adjOrderP)) + 10;
    let nextYCord = 199 - (200 * (((sellOrdersInfo[j + 1].pricePerUnit || sellOrdersInfo[j].pricePerUnit) - lowestPrice) / adjOrderP)) + 10;
    ctx.fillRect(j * widthPer, thisYCord, 1, 1);

    let startX = widthPer * j;
    let finishX = (j < len - 1) ? (widthPer * (j + 1)) : 600;

    let f = (x) => {
      let percentAcross = (x - startX) / (finishX - startX);
      return ((nextYCord - thisYCord) * percentAcross) + thisYCord;
    }

    for (let x = startX; x < finishX + 1; x += addlAmount) {
      let yCord = f(x);
      ctx.fillStyle = "#34eb46";

      if (mouseData != null) {
        if (mouseData.x >= startX && mouseData.x < finishX) {
          ctx.fillStyle = "#00c7c0";
        }
      }

      if (x == startX) ctx.fillStyle = "#757575";

      ctx.fillRect(x, (x != startX) ? yCord : yCord - 2, 2, (x != startX) ? clamp(f(x - addlAmount) - yCord, 3, 10000) + 2 : clamp(f(x + addlAmount) - yCord, 3, 10000) + 4);
    }

    newInfo.sell.push({
      amount: sellOrdersInfo[j].amount,
      pricePerUnit: sellOrdersInfo[j].pricePerUnit,
      start: {
        x: startX,
        y: f(startX)
      },
      finish: {
        x: finishX,
        y: f(finishX)
      },
      f,
    });
  }

  if (mouseData != null && mouseData["y"] > 0 && mouseData["y"] < canvas.height) {
    mouseData.x = clamp(mouseData.x, 0, 100000);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(mouseData.x, 0, 1, 301);
    let indexOfOrder = -1;
    for (let i = 0; i < newInfo.buy.length; i++) {
      if (mouseData.x >= newInfo.buy[i].start.x && mouseData.x < newInfo.buy[i].finish.x) {
        indexOfOrder = i;
        break;
      }
    }
    let sideLen = 8;
    ctx.fillStyle = "#d0db35";
    ctx.fillRect(mouseData.x - (sideLen / 2), newInfo.buy[indexOfOrder].f(mouseData.x) - (sideLen / 2) + 2, sideLen, sideLen)
    ctx.fillStyle = "#00c7c0";
    ctx.fillRect(mouseData.x - (sideLen / 2), newInfo.sell[indexOfOrder].f(mouseData.x) - (sideLen / 2) + 2, sideLen, sideLen)

    if (orderDataElement != null) {
      if (indexOfOrder != -1) {
        let pEle = (document.getElementById("order-chart-info") == null) ? document.createElement("p") : document.getElementById("order-chart-info");
        let pEle2 = (document.getElementById("order-chart-info-2") == null) ? document.createElement("p") : document.getElementById("order-chart-info-2");
        if (document.getElementById("order-chart-info") == null) {
          orderDataElement.appendChild(pEle);
          orderDataElement.appendChild(pEle2);
        }

        //Set data on doc

        pEle.innerHTML = "<span style=\"color: #00c7c0;\">Buy Order Data:</span>"

        let unitPriceFormatted = commaNumber((newInfo.sell[indexOfOrder].pricePerUnit + "").split(".")[0]) + (((newInfo.sell[indexOfOrder].pricePerUnit + "").split(".").length > 1) ? "." + (newInfo.sell[indexOfOrder].pricePerUnit + "").split(".")[1] : "")
        pEle.innerHTML += "<br/>Unit Price: " + unitPriceFormatted;
        pEle.innerHTML += "<br/>Amount: " + commaNumber(newInfo.sell[indexOfOrder].amount);

        pEle.id = "order-chart-info";

        pEle2.innerHTML = "<span style=\"color: #d0db35\">Sell Order Data:</span>"

        unitPriceFormatted = commaNumber((newInfo.buy[indexOfOrder].pricePerUnit + "").split(".")[0]) + (((newInfo.buy[indexOfOrder].pricePerUnit + "").split(".").length > 1) ? "." + (newInfo.buy[indexOfOrder].pricePerUnit + "").split(".")[1] : "");
        pEle2.innerHTML += "<br/>Unit Price: " + unitPriceFormatted;
        pEle2.innerHTML += "<br/>Amount: " + commaNumber(newInfo.buy[indexOfOrder].amount);

        pEle2.id = "order-chart-info-2";
      } else {
        let pEle = (document.getElementById("order-chart-info") == null) ? document.createElement("p") : document.getElementById("order-chart-info");
        let pEle2 = (document.getElementById("order-chart-info") == null) ? document.createElement("p") : document.getElementById("order-chart-info-2");
        if (document.getElementById("order-chart-info") == null) {
          orderDataElement.appendChild(pEle);
          orderDataElement.appendChild(pEle2);
        }

        pEle.textContent = "Data Not Found." + ((IN_DEVELOPMENT) ? "mX: " + mouseData.x + ", mY: " + mouseData.y : "")
        pEle.id = "order-chart-info";

        pEle2.innerHTML = "";
        pEle2.id = "order-chart-info-2";
      }
      return { canvas, orderDataElement }
    }
  }

  //they'll both be there
  //depending on if one is higher than another, then it'll be green or red

  return {
    canvas,
  };
}

//var credObj = document.getElementById("credits");

/**
 * Whenever someone clicks on a side bar div.
 * @param {string} key
 * @param {Object} mouseMoveInfo
*/
function switchToInfo(key, mouseMoveInfo=null) {
  if (hoverOverModeButton) return;

  if (key == "news") {
    if (showingInfo) {
      showingInfo = false;
      document.getElementById("info-title").textContent = "Recent Threads";

      //credObj.style = "opacity: 0;";

      for (let ele of document.getElementsByClassName("scroll-news-clicked")) {
        ele.classList.remove("scroll-news-clicked");
      }

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

  //credObj.style = "opacity: 1;"

  //Note: Buy and Sell are flipped around.
  //Buy is how much you can sell it for, and sell is how much you can buy it for
  let infos = [
    "Buy Price (Instant Sell Price): " + commaNumber(Math.round(quickStatus.sellPrice)),
    "Buy Moving Week: <span style=\"color: " + ((getAverageSellMovingWeek() < quickStatus.sellMovingWeek) ? "#34eb46" : "#e03b22") + "\">" + commaNumber(quickStatus.sellMovingWeek) + "</span> (Average: " + commaNumber(Math.round(getAverageSellMovingWeek())) + ")",
    "Buy Volume: " + commaNumber(quickStatus.sellVolume),
    "Current Amount of Buy Orders: " + commaNumber(quickStatus.sellOrders),
    "Sell Price (Instant Buy Price): " + commaNumber(Math.round(quickStatus.buyPrice)),
    "Sell Moving Week: " + commaNumber(quickStatus.buyMovingWeek),
    "Sell Volume: " + commaNumber(quickStatus.buyVolume),
    "Current Amount of Sell Orders: " + commaNumber(quickStatus.buyOrders)
  ];


  let canvasInfo = createCanvasWithOrdersInfo(product.buy_summary, product.sell_summary, mouseMoveInfo, document.createElement("div"));
  let canvas = canvasInfo.canvas;

  canvas.id = "info-canvas";
  canvas.addEventListener('mousemove', e => {
    onMouseMove(e);
  });
  canvas.addEventListener('mouseout', e => {
    onMouseMoveOff();
  });

  itemInfoElement.appendChild(canvas);

  if (canvasInfo["orderDataElement"] != null) {
    itemInfoElement.appendChild(canvasInfo["orderDataElement"]);
  }

  for (let info of infos) {
    let pEle = document.createElement("p");
    pEle.innerHTML = info;
    divEle.appendChild(pEle);
  }

  itemInfoElement.appendChild(divEle);
}

function onMouseMove(evt) {
  if (itemInfoElement.innerHTML != "") {
    let mousePos = getMousePos(document.getElementById("info-canvas"), evt);
    itemInfoElement.innerHTML = "";
    switchToInfo(lastClickedOn, mousePos);
  }
}

function onMouseMoveOff() {
  if (itemInfoElement.innerHTML != "") {
    itemInfoElement.innerHTML = "";
    switchToInfo(lastClickedOn, null);
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

/**
  * Clamps the number
  * @param {number} n
  * @param {number} min
  * @param {number} max
  * @returns {number}
*/
function clamp(n, min, max) {
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
}

/**
  * Gets the mouse position on a canvas
  * Source: https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
  * @param {Object} canvas
  * @param {Object} evt
  * @returns {Object}
*/
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
