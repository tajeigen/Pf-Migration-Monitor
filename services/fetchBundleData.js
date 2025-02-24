const axios = require("axios");
const config = require('../config/config');


const {bundleData} = config.endpoints;
const fetchBundleData = async (mint) => {
    const url = `${bundleData}${mint}`;

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": `https://trench.bot/bundles/${mint}`,
                "Origin": "https://trench.bot",
                "Accept": "application/json",
                "Connection": "keep-alive",
            },
            decompress: true, // Ensures Axios handles gzip decompression
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch transactions for mint ${mint}`, error.message);
    }
};


module.exports = fetchBundleData;