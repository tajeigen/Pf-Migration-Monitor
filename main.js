// main.js
const WebSocketHandler = require("./services/getMigratingCoinsBullX");
const fetchTransactions = require("./services/fetchTransactions");
const fetchBundleData = require("./services/fetchBundleData");
// const { sendMessageToChannel, getChannelInfo } = require("./messaging_tg/sendTelegramMessage"); // to use personal tg account without a bot 
const {sendMessageToChannel} = require("./messaging_tg/sendMsgBotTG");
const connectDB = require("./config/db");
const mongoose = require('mongoose');
const logger  = require('./logs/logger');   // Import logger
const MintTransaction = require("./models/Transaction"); // Import MintTransaction model
const {processAnalytics,printAnalytics,printBundleInfo} = require("./utils/processAnalytics");
require("dotenv").config();
const CHANNEL_ID = process.env.CHANNEL_ID;

// Function to perform analytics on a given mint address
async function analyzeMint(mintAddress, logMessage) {
  try {
    
    const transactions = await fetchTransactions(mintAddress);

    if (!transactions.length) {
      console.log(`⚠️ No transactions found for ${mintAddress}.`);
      return;
    }
    const analysis = processAnalytics(transactions);
    const analysisMessage = printAnalytics(analysis);
    // const bundleMessage = printBundleInfo(bundleData);

    // Save or update the mint transaction document in MongoDB
    const mintTransactionDoc = await MintTransaction.findOneAndUpdate(
      { mintAddress }, // Filter by mint address
      {
        $set: { "highestBuy" : analysis.highestBuy }, // Update highestBuy
        $push: { transactions: { $each: transactions } }, // Push new transactions
      },
      { upsert: true, new: true } // Create the document if it doesn't exist and return the updated document
    );


    // get bundle info if needed
    // const bundleData = await fetchBundleData(mintAddress);
    // const combinedMessage = `${logMessage}\n${analysisMessage}\n${bundleMessage}`;//with bundle info

    const combinedMessage = `${logMessage}\n${analysisMessage}`;//no bundle info

    logger.info(combinedMessage);  // Log the combined message

    //OPTION1: the bot way:
    await sendMessageToChannel(combinedMessage);

    //OPTION2: the personal tg account way:
    // Send the analysis message to Telegram using the user's personal account
    // const groupData = await getChannelInfo(CHANNEL_ID);
    // await sendMessageToChannel(
    //   groupData.chat_id,
    //   groupData.access_hash,
    //   combinedMessage
    // );
  } catch (error) {
    console.error("❌ Error in analyzeMint:", error);
  }
}

// Initialize WebSocket Handler
const wsHandler = new WebSocketHandler();
wsHandler.connect();

// Listen for new coins and trigger analysis
wsHandler.on("newCoin", ({ mintAddress, logMessage }) => {
    analyzeMint(mintAddress, logMessage);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  wsHandler.close();
  await mongoose.connection.close();
  process.exit(0);
});

// Connect to MongoDB
connectDB();
