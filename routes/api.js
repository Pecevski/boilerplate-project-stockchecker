'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (app) {
  // In-memory store for stock prices and likes
  const stockLikes = {};

  // Initialize stock data if not present
  const initializeStock = (stockSymbol) => {
    if (!stockLikes[stockSymbol]) {
      stockLikes[stockSymbol] = { likes: 0, price: Math.floor(Math.random() * 1000) };
    }
  };

  // Fetch stock data and optionally add a like
  const getStockData = (stockSymbol, addLike = false) => {
    initializeStock(stockSymbol); // Ensure the stock is initialized

    // Increment likes and increase the price if 'like=true'
    if (addLike) {
      stockLikes[stockSymbol].likes += 1; // Increment likes
      stockLikes[stockSymbol].price += 10; // Increase price for demonstration
    }

    return {
      stock: stockSymbol,
      price: stockLikes[stockSymbol].price,
      likes: stockLikes[stockSymbol].likes
    };
  };

  // API route to get stock prices
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const addLike = like === 'true'; // Convert 'like' to boolean

      // Validate stock query
      if (!stock || (Array.isArray(stock) && stock.length !== 2)) {
        return res.status(400).json({ error: 'Invalid stock query.' });
      }

      if (Array.isArray(stock)) {
        // Case: Comparing two stocks
        const stock1 = getStockData(stock[0], addLike);
        const stock2 = getStockData(stock[1], addLike);

        // Calculate relative likes
        const rel_likes1 = stock1.likes - stock2.likes; // stock1's likes - stock2's likes
        const rel_likes2 = stock2.likes - stock1.likes; // stock2's likes - stock1's likes

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
