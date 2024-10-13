'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (app) {
  // In-memory store for stock likes and prices
  const stockLikes = {
    'GOOG': { likes: 0, price: Math.floor(Math.random() * 1000), ipAddresses: {} },
    'MSFT': { likes: 0, price: Math.floor(Math.random() * 1000), ipAddresses: {} }
  };

  // Helper function to fetch or update stock data
  const getStockData = (stockSymbol, ip, addLike = false) => {
    // Check if 'like=true' and if the IP has already liked this stock
    if (addLike) {
      // Anonymize IP by hashing it
      const hashedIP = bcrypt.hashSync(ip, saltRounds);
      if (!stockLikes[stockSymbol].ipAddresses[hashedIP]) {
        stockLikes[stockSymbol].likes += 1; // Increment likes if IP hasn't liked it yet
        stockLikes[stockSymbol].ipAddresses[hashedIP] = true; // Mark IP as having liked
      }
    }

    return {
      stock: stockSymbol,
      price: stockLikes[stockSymbol].price,
      likes: stockLikes[stockSymbol].likes
    };
  };

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const ip = req.ip; // Get the user's IP
      const addLike = like === 'true'; // Convert 'like' to boolean

      if (Array.isArray(stock)) {
        // Case: Comparing two stocks
        const stock1 = getStockData(stock[0], ip, addLike);
        const stock2 = getStockData(stock[1], ip, addLike);

        // Calculate relative likes
        const rel_likes1 = stock1.likes - stock2.likes;
        const rel_likes2 = stock2.likes - stock1.likes;

        // Return both stocks with their prices and relative likes
        res.json({
          stockData: [
            { stock: stock1.stock, price: stock1.price, rel_likes: rel_likes1 },
            { stock: stock2.stock, price: stock2.price, rel_likes: rel_likes2 }
          ]
        });
      } else {
        // Case: Single stock
        const stockData = getStockData(stock, ip, addLike);
        res.json({ stockData });
      }
    });
};
