// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: String,
  is_buy: Boolean,
  sol_amount: Number,
  token_amount: Number,
  signature: String,
  timestamp: Number,
  tx_index: Number,
  mintAddress: String,
});
const mintTransactionSchema = new mongoose.Schema({
    mintAddress: {
        type: String,
        required: true,
        unique: true,
    },
    transactions: [transactionSchema],
    highestBuy: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },});
module.exports = mongoose.model('MintTransaction', mintTransactionSchema);