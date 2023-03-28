const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 5,
                page: 1,
                sparkline: false,
            },
        });

        const coins = response.data;
        res.render('coingecko', {
            coins
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from CoinGecko API');
    }
});

module.exports = router;