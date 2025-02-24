require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const { BOT_TOKEN_ACCESS, SERVER_URL } = process.env;
const port = process.env.PORT || 4040;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN_ACCESS}`;
const URI = `/webhook/${SERVER_URL}`;
const WEBHOOK_URL = `${SERVER_URL}${URI}`;
const CHAT_ID = process.env.CHAT_ID;
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
            chat_id: CHAT_ID,
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
