// services/fetchTransactions.js
const axios = require("axios");
const Transaction = require("../models/Transaction");

const config = require('../config/config');
const {pfTx} = config.endpoints;
const fetchTransactions = async (mint) => {
  let offset = 0;
  let transactions = [];
  let retries = 0;
  const maxRetries = 3;

  while (true) {
    const url = `${pfTx}${mint}?limit=200&offset=${offset}&minimumSize=0`;
    try {
      const response = await axios.get(url);
      if (response.data.length === 0) break;
      const txs = response.data.map((tx) => ({
        user: tx.user,
        is_buy: tx.is_buy,
        sol_amount: tx.sol_amount,
        token_amount: tx.token_amount,
        signature: tx.signature,
        timestamp: tx.timestamp,
        tx_index: tx.tx_index,
      }));
      transactions = transactions.concat(txs);
      offset += 200;
    } catch (error) {
      retries++;
      console.error(
        `Failed to fetch transactions for mint ${mint}, attempt ${retries}/${maxRetries}: ${error.message}`
      );
      if (retries >= maxRetries) {
        console.error(`Failed to fetch transactions for mint: ${mint}`);
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }



  return transactions;
};
module.exports = fetchTransactions;