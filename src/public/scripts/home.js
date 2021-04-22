var productKeys = [];
var products = [];
var formattedKeys = false;

var stocksContainer = document.getElementById("stocks");

function getAverageSellMovingWeek() {
  let totalSMW = 0;
  let totalAmount = productKeys.length;
  productKeys.forEach((key) => {
    let item = products[key];
    if (item.quick_status.sellMovingWeek == 0) {
      totalAmount--;
    } else {
      totalSMW += item.quick_status.sellMovingWeek;
    }
  });

  return totalSMW / totalAmount;
}

//When the backend data shows up to the party
function onRecieveKeys(beData) {
  if (formattedKeys) return;

  productKeys = beData.productList;
  products = beData.products;

  let avgSMW = getAverageSellMovingWeek();

  for (let key of productKeys) {
    let divEle = document.createElement("div");

    divEle.onclick = () => { switchToInfo(key) }

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

    priceEle.innerHTML = limitToMaxPriceLength(roundDown(Math.round(quickStatus.sellPrice)));
    priceEle.classList.add("stock-price");

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

  let product = products[key];

  showingInfo = true;
  threadsElement.innerHTML = "";
  itemInfoElement.innerHTML = "";

  document.getElementById("info-title").textContent = getInitials(key.replaceAll("_", " "));

  let quickStatus = product.quick_status;

  let divEle = document.createElement("div");

  itemInfoElement.appendChild(divEle);

  let infos = [
    "Sell Price: " + commaNumber(Math.round(quickStatus.sellPrice)),
    "Sell Moving Week: " + commaNumber(quickStatus.sellMovingWeek) + " (Average: " + commaNumber(Math.round(getAverageSellMovingWeek())) + ")",
    "Sell Volume: " + commaNumber(quickStatus.sellVolume),
    "Current Amount of Sell Orders: " + commaNumber(quickStatus.sellOrders),
    "Buy Price: " + commaNumber(Math.round(quickStatus.buyPrice)),
    "Buy Moving Week: " + commaNumber(quickStatus.buyMovingWeek),
    "Buy Volume: " + commaNumber(quickStatus.buyVolume),
    "Current Amount of Buy Orders: " + commaNumber(quickStatus.buyOrders)
  ];

  for (let info of infos) {
    let pEle = document.createElement("p");
    pEle.textContent = info;
    divEle.appendChild(pEle);
  }

}

function formatCanvas(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#34eb46"; //For green
  // ctx.fillStyle("#e03b22") //For red
  ctx.fillRect(0, 0, 60, 30)
}

var lastHeight = 800;
var infoContainer = document.getElementById("info");

//Height thingy
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

//formats string with a title lol
function titleCase(str) {
  let spltStr = str.split(" ");

  for (let i = 0; i < spltStr.length; i++) {
    let splitWord = spltStr[i].split("")
    let firstChar = splitWord.splice(0, 1)[0];
    spltStr[i] = firstChar.toUpperCase() + splitWord.join("");
  }
  return spltStr.join(" ");
}

//gets the initials of something
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

//changes the cool color buttons and displays fancy numbers
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

//just adds in spacing to make stuff more even
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
function roundDown(n) {
  let logN = Math.floor(Math.log10(n));
  let symbol = "";
  if (inBetween(logN, 3, 5)) {
    symbol = "k";
  } else if (inBetween(logN, 6, 8)) {
    symbol = "m";
  } else if (inBetween(logN, 9, 11)) {
    symbol = "b";
  } else if (inBetween(logN, 12, 14)) {
    symbol = "t";
  } else if (logN > 14) {
    symbol = "q";
  }

  if (symbol != "") {
    let splitStrN = (n + "").split("");
    return splitStrN[0] + "." + splitStrN[1] + splitStrN[2] + symbol;
  }

  return n;
}

//in between numbers
function inBetween(n, min, max) {
  return n >= min && n <= max;
}

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
