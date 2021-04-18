let express = require('express');
let stocks = require('../constant/stocks.storage');
let router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json(stocks);
});

router.put('/', function ({body}, res) {
    const lastUpdatedAt = new Date().getTime();
    stocks = stocks.map((stock) => {
        if (Array.isArray(body)) {
            const foundStock = body.find((val) => val.name === stock.name);
            if (foundStock) {
                if (typeof foundStock.value === "number") {
                    return {
                        name: stock.name,
                        value: foundStock.value,
                        lastUpdatedAt
                    }
                } else {
                  //if type check failed, no update
                  foundStock.value = stock.value;
                }
            }
        }
        return stock;

    });
    res.status(202).json({"message": "updated", stocks: body});
});

router.get('/stream', function (req, res, next) {
    res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    });
    setInterval(() => {
        //creating stocksToWrite so as to only push values which I wants to.
        const stocksToWrite = [];
        const lastUpdatedAt = new Date().getTime();
        stocks = stocks.map((stock) => {
            const stockLastUpdatedAt = stock.lastUpdatedAt && new Date(stock.lastUpdatedAt);
            let newStock = stock;
            if (!stockLastUpdatedAt || (stockLastUpdatedAt && (new Date() - stockLastUpdatedAt) >= 30000)) {
                newStock = {
                    value: stock.value + 100,
                    name: stock.name,
                    lastUpdatedAt
                }
            }
            stocksToWrite.push({name: newStock.name, value: newStock.value});
            return newStock
        });
        res.write(`data: ${JSON.stringify(stocksToWrite)}\n\n\n`);
    }, 30000);
});
module.exports = router;
