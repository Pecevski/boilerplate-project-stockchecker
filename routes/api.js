'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (app) {
  // In-memory store for stock prices and likes
  const stockLikes = {};

  // Helper function to fetch or initialize stock data
  const getStockData = (stockSymbol, addLike = false) => {
    if (!stockLikes[stockSymbol]) {
      // Initialize stock if not already present
      stockLikes[stockSymbol] = { likes: 0, price: Math.floor(Math.random() * 1000) };
    }

    // Increment likes if 'like=true'
    if (addLike) {
      stockLikes[stockSymbol].likes += 1; // Increment likes
      stockLikes[stockSymbol].price += 10; // Increase price by 10 for demonstration
    }

    return {
      stock: stockSymbol,
      price: stockLikes[stockSymbol].price,
      likes: stockLikes[stockSymbol].likes // Return likes as an integer
    };
  };

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const addLike = like === 'true'; // Convert 'like' to boolean

      if (Array.isArray(stock)) {
        // Case: Comparing two stocks
        const stock1 = getStockData(stock[0], addLike);
        const stock2 = getStockData(stock[1], addLike);

        // Calculate relative likes
        const rel_likes1 = stock1.likes - stock2.likes; // stock1's likes - stock2's likes
        const rel_likes2 = stock2.likes - stock1.likes; // stock2's likes - stock1's likes

         // Adjusting rel_likes if both stocks have not been liked
         if (stock1.likes === 0 && stock2.likes === 0) {
          rel_likes1 = -1; // stock1 is less favored
          rel_likes2 = 1;  // stock2 is more favored
        }

        // Return both stocks with their prices and relative likes
        return res.json({
          stockData: [
            { stock: stock1.stock, price: stock1.price, rel_likes: rel_likes1 },
            { stock: stock2.stock, price: stock2.price, rel_likes: rel_likes2 }
          ]
        });
      } else {
        // Case: Single stock
        const stockData = getStockData(stock, addLike);
        return res.json({ stockData });
      }
    });
};

