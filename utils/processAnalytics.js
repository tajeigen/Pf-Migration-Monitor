const {TransactionAnalytics} = require('./analytics.js');
const {convertSoltoLampard} = require('./analytics.js');

const printBundleInfo = (element) => {
  return `
🛑🛑🛑Bundle Info🛑🛑🛑
<b>Bundled Wallets:</b> ${element.total_bundles}
<b>Sol Spent:</b> ${element.total_sol_spent}
<b>Bundle Percentage:</b> ${element.total_percentage_bundled}
<b>Held Percentage:</b> ${element.total_holding_percentage}`
}
const printCoinInfo = (element)  =>{
  const socialLinks = element.w && Object.keys(element.w).length
    ? Object.entries(element.w)
        .map(([key, value]) => `<a href="${value}" target="_blank">${key}</a>`)
        .join(", ")
    : "No socials available";

  return `
🎉🎉<b>New Coin Detected: <a href="https://neo.bullx.io/terminal?chainId=1399811149&address=${element.a}">BullX</a></b>🎉🎉\n
<b>Name:</b> ${element.b}
<b>Address:</b> ${element.a}
<b>Socials:</b> ${socialLinks}

<b>Top Holder:</b> ${element.ai} | <b>Rats:</b> ${element.am} | <b>DV:</b> ${element.ad}
<b>Snipers:</b> ${element.aj} | <b>Bots:</b> ${element.al} | <b>Holders:</b> ${element.f}`;
}
const printAnalytics = (obj) => {
    // Print analytics
    return `
🔶🔶<b>Transaction Analysis:</b>🔶🔶
⏳ <b>Duration:</b> ${obj.humanReadableDuration}
💰 <b>Highest Buy:</b> ${convertSoltoLampard(obj.highestBuy, false)} | <b>Sell:</b> ${convertSoltoLampard(obj.highestSell, false)}

📊 <b>Total TXs:</b> ${obj.num_buys_sells.txcount} 
    📈Buys: ${obj.num_buys_sells.totalbuysCount} | 📉Sells: ${obj.num_buys_sells.totalSellCount}

🟥 <b>Less than 1 SOL: </b>
    📈Buys: ${obj.sol_amount_lessthan1.countBuys} | 📉Sells: ${obj.sol_amount_lessthan1.countSells}

🟨 <b>Between 1 and 3 SOL: </b>
    📈Buys: ${obj.sol_amount_lt3_gt1.countBuys} | 📉Sells: ${obj.sol_amount_lt3_gt1.countSells}

🟩 <b>Greater than 4 SOL:</b> 
    📈Buys: ${obj.sol_amount_gt4.countBuys} | 📉Sells: ${obj.sol_amount_gt4.countSells}
    `;
}

const processAnalytics =  (transactions) => {
        // Run analytics
        const duration  = TransactionAnalytics.duration(transactions); //duration in seconds
        const humanReadableDuration = TransactionAnalytics.convertDuration(duration);
        const num_buys_sells = TransactionAnalytics.calculateTotalTX(transactions);
        const sol_amount_lessthan1 = TransactionAnalytics.countTransactionsInRange(
          transactions,
          convertSoltoLampard(0.1),
          convertSoltoLampard(1)
        );
        const sol_amount_lt3_gt1 = TransactionAnalytics.countTransactionsInRange(
          transactions,
          convertSoltoLampard(1),
          convertSoltoLampard(3)
        );
        const sol_amount_gt4 = TransactionAnalytics.countTransactionsInRange(
          transactions,
          convertSoltoLampard(4),
          convertSoltoLampard(100)
        );
        const highestBuy = TransactionAnalytics.biggestBuy(transactions);
        const highestSell = TransactionAnalytics.biggestSell(transactions);

        return {
            duration,
            humanReadableDuration,
             num_buys_sells,
             sol_amount_lessthan1,
             sol_amount_lt3_gt1,
             sol_amount_gt4,
             highestBuy,
             highestSell

        }
}
module.exports = {processAnalytics,printAnalytics,printCoinInfo,printBundleInfo};
