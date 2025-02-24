function convertSoltoLampard(sol, order = true) {
    if (order == true) {
      return sol * 1000000000;
    }
    return (sol / 1000000000).toFixed(2);
  }
  class TransactionAnalytics {
    /**
     * Calculates the duration between the first and last transaction
     * @param {Array} transactions - List of transaction objects
     * @returns {number} Duration in seconds
     */
    static duration(transactions) {
      if (transactions.length < 2) return 0;
  
      const startTransaction = transactions[transactions.length - 1];
      const endTransaction = transactions[0];
      return endTransaction.timestamp - startTransaction.timestamp;
    }
    /**
     * format the duration in to seconds, minutes, hours and days
     * @param {number} durationSeconds - number of seconds
     * @returns {string} Duration in seconds
     */
    static convertDuration(durationSeconds) {
      const days = Math.floor(durationSeconds / 86400);
      const hours = Math.floor((durationSeconds % 86400) / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      const seconds = durationSeconds % 60;
  
      // Dynamically build the output string
      let parts = [];
      if (days > 0) parts.push(`${days} d`);
      if (hours > 0) parts.push(`${hours} h`);
      if (minutes > 0) parts.push(`${minutes} m`);
      if (seconds > 0 || parts.length === 0) parts.push(`${seconds} s`); // Always show seconds if nothing else
  
      return parts.join(" ");
    }
    /**
     * Analyzes transactions within a given time frame
     * @param {string} creator - Wallet address of the creator
     * @param {Array} transactions - List of transactions
     * @param {number} timeLimitInSec - Time limit in seconds
     * @returns {Object} Analysis results (buys, sells, volume)
     *
     * need to adjust this function to start returnning dinamically the latest tradable time frame
     * for example: some coins are created long time ago like a month, but they revive the coin in the last 10 min so we need to fix this function to check the last 10 min txs only
     */
    static analyzeTransactionsInTimeFrame(creator, transactions, timeLimitInSec) {
      if (!transactions.length) return {};
  
      const startTransaction = transactions[transactions.length - 1];
      const startTime = startTransaction.timestamp;
      const endTime = startTime + timeLimitInSec;
  
      let totalSOLBought = 0;
      let totalSOLSold = 0;
      let numberOfBuys = 0;
      let numberOfSells = 0;
  
      for (const transaction of transactions) {
        if (
          transaction.timestamp >= startTime &&
          transaction.timestamp <= endTime &&
          !(creator === transaction.user && transaction.tx_index === 2)
        ) {
          if (transaction.is_buy) {
            totalSOLBought += transaction.sol_amount;
            numberOfBuys++;
          } else {
            totalSOLSold += transaction.sol_amount;
            numberOfSells++;
          }
        }
      }
  
      return {
        numberOfBuys,
        numberOfSells,
        totalSOLBought,
        totalSOLSold,
      };
    }
  
    /**
     * format the duration in to seconds, minutes, hours and days
     * @param {number} transactions - number of seconds
     * @returns {string} Duration in seconds
     */
    static calculateTotalTX(transactions) {
      let txcount = transactions.length;
      let totalbuysCount = 0;
      let totalSellCount = 0;
  
      // Iterate over the transaction array from the last to the first
      for (const transaction of transactions) {
        if (transaction.is_buy) {
          totalbuysCount++;
        } else {
          totalSellCount++;
        }
      }
  
      return { txcount, totalbuysCount, totalSellCount };
    }
    static devWallet(transactions) {
      const creator = transactions[transactions.length - 1].user;
      // console.log("DEV is : ", creator);
      return creator;
    }
    // //return the number of buy/sells greater than for example 4 sol and less than 10 sol
    static countTransactionsInRange(transactions, lowerBound, upperBound) {
      let countBuys = 0;
      let countSells = 0;
      var buysarr = [];
      var sellsarr = [];
      transactions.forEach((transaction) => {
        //here we dont care if the tx is from the dev or not
  
        if (
          transaction.sol_amount >= lowerBound &&
          transaction.sol_amount <= upperBound
        ) {
          if (transaction.is_buy) {
            countBuys++;
            buysarr.push(convertSoltoLampard(transaction.sol_amount, false));
          } else {
            countSells++;
            sellsarr.push(convertSoltoLampard(transaction.sol_amount, false));
          }
        }
      });
  
      return {
        countBuys,
        countSells,
        buysarr,
        sellsarr,
      };
    }
    static biggestBuy(transactions) {
      let biggestBuy = 0;
      transactions.forEach((transaction) => {
        if (transaction.is_buy && transaction.sol_amount > biggestBuy) {
          biggestBuy = transaction.sol_amount;
        }
      });
      return biggestBuy;
    }
    static biggestSell(transactions) {
      let biggestSell = 0;
      transactions.forEach((transaction) => {
        if (transaction.is_buy == false && transaction.sol_amount > biggestSell) {
          biggestSell = transaction.sol_amount;
        }
      });
      return biggestSell;
    }

    //need to add most common buy/sell amount
  }
  
  module.exports = { TransactionAnalytics, convertSoltoLampard };  