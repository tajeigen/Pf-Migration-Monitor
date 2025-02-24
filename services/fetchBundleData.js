const axios = require("axios");
require("dotenv").config();
const bundle_url = process.env.BUNDLE_DATA;
const fetchBundleData = async (mint) => {
    const url = `${bundle_url}${mint}`;

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