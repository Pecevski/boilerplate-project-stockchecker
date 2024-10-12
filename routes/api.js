'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (app) {

  const hashIP = async (ip) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(ip, salt);
  };

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const ip = req.ip;
      const hashedIP = await hashIP(ip);

      // Mock database interaction with likes tracked per stock
      const stockDB = {
        'AAPL': { price: 150, likes: 0 },
        'GOOG': { price: 2800, likes: 0 }
      };

      // Helper function to get stock data, including likes
      const getStockData = (stockSymbol, addLike = false) => {
        let stockInfo = stockDB[stockSymbol];
        if (!stockInfo) {
          // Handle case where stock is not in the mock database
          stockInfo = { price: Math.floor(Math.random() * 1000), likes: 0 };
          stockDB[stockSymbol] = stockInfo;
        }
        if (addLike) {
          stockInfo.likes += 1; // Increment likes if 'like' is true
        }
        return {
          stock: stockSymbol,
          price: stockInfo.price,
          likes: stockInfo.likes
        };
      };

      // Handling the request
      if (Array.isArray(stock)) {
        // If multiple stocks are passed
        const stock1 = getStockData(stock[0], like);
        const stock2 = getStockData(stock[1], like);
        
        const rel_likes1 = stock1.likes - stock2.likes;
        const rel_likes2 = stock2.likes - stock1.likes;

        // Return array of stock data with relative likes
        res.json([
          { stock: stock1.stock, price: stock1.price, rel_likes: rel_likes1 },
          { stock: stock2.stock, price: stock2.price, rel_likes: rel_likes2 }
        ]);
      } else {
        // If only one stock is passed
        const stockData = getStockData(stock, like);
        res.json({ stockData });
      }
    });
};
