const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('../config/config');

const { botToken, serverUrl, chatId } = config.telegram;
const { port } = config.server;
const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;
const URI = `/webhook/${serverUrl}`;
const WEBHOOK_URL = `${serverUrl}${URI}`;
const app = express();
app.use(bodyParser.json());

const init = async()=>{
    try{
        const { data } = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
        console.log(data);
    }catch(err){
        console.log(err);
    }
}
const sendMessageToChannel = async (message) => {
    try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML", 
            disable_web_page_preview: true // Disables link previews

        });
        console.log("Message sent to channel!");
    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error);
    }
};

app.listen(port, async() => {
    console.log(`Example app listening on port ${port}`);
    await init();
}); 



module.exports = {sendMessageToChannel};
