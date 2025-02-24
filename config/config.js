require('dotenv').config();

const config = {
    telegram: {
        botToken: process.env.BOT_TOKEN_ACCESS,
        serverUrl: process.env.SERVER_URL,
        chatId: process.env.CHAT_ID,
        apiId: process.env.API_ID,
        apiHash: process.env.API_HASH,
        phoneNumber: process.env.PHONE_NUMBER,
        channelId: process.env.CHANNEL_ID
    },
    database: {
        url: process.env.DB_NAME
    },
    endpoints: {
        pfTx: process.env.PF_TX,
        bundleData: process.env.BUNDLE_DATA,
        wsBullX: process.env.WS_BULLX_MIGRATING_COINS,
        bullXEvent: process.env.BULLX_EVENT
    },
    server: {
        port: process.env.PORT || 4040
    }
};

module.exports = config;