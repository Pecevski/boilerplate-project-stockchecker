'use strict';

module.exports = function (app) {

  // Simple in-memory store for stock likes (for simplicity)
  const stockLikes = {};

  const getStockData = (stock, addLike = false) => {
    // Initialize stock data if not present
    if (!stockLikes[stock]) {
      stockLikes[stock] = { price: Math.floor(Math.random() * 1000), likes: 0 };
    }

    // Increment likes if the 'like' query parameter is set
    if (addLike) {
      stockLikes[stock].likes += 1;
    }

    // Return stock data
    return {
      stock,
      price: stockLikes[stock].price,
      likes: stockLikes[stock].likes
    };
  };

  app.route('/api/stock-prices')
    .get(function (req, res) {
      const { stock, like } = req.query;
      const addLike = like === 'true'; // Convert 'like' query param to boolean

      if (Array.isArray(stock)) {
        // If multiple stocks are passed
        const stock1 = getStockData(stock[0], addLike);
        const stock2 = getStockData(stock[1], addLike);

        // Calculate relative likes for both stocks
        const rel_likes1 = stock1.likes - stock2.likes;
        const rel_likes2 = stock2.likes - stock1.likes;

        res.json([
          { stock: stock1.stock, price: stock1.price, rel_likes: rel_likes1 },
          { stock: stock2.stock, price: stock2.price, rel_likes: rel_likes2 }
        ]);
      } else {
        // If a single stock is passed
        const stockData = getStockData(stock, addLike);
        res.json({ stockData });
      }
    });
};
