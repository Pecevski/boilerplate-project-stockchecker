'use strict';

module.exports = function (app) {

  // In-memory store for stock likes
  const stockLikes = {
    'AAPL': 0,
    'GOOG': 0
  };

  const getStockData = (stockSymbol, addLike = false) => {
    // Initialize stock data if not present
    if (!stockLikes[stockSymbol]) {
      stockLikes[stockSymbol] = 0;
    }

    // Increment likes if 'like=true' is passed
    if (addLike) {
      stockLikes[stockSymbol] += 1;
    }

    return {
      stock: stockSymbol,
      price: Math.floor(Math.random() * 1000), // Mock price generation
      likes: stockLikes[stockSymbol]
    };
  };

  app.route('/api/stock-prices')
    .get(function (req, res) {
      const { stock, like } = req.query;
      const addLike = like === 'true'; // Convert 'like' query param to boolean

      // If multiple stocks are queried
      if (Array.isArray(stock)) {
        const stock1 = getStockData(stock[0], addLike);
        const stock2 = getStockData(stock[1], addLike);

        // Calculate relative likes between the two stocks
        const rel_likes1 = stock1.likes - stock2.likes;
        const rel_likes2 = stock2.likes - stock1.likes;

        // Return both stocks with relative likes
        res.json([
          { stock: stock1.stock, price: stock1.price, rel_likes: rel_likes1 },
          { stock: stock2.stock, price: stock2.price, rel_likes: rel_likes2 }
        ]);
      } else {
        // If only a single stock is queried
        const stockData = getStockData(stock, addLike);
        res.json({ stockData });
      }
    });
};
