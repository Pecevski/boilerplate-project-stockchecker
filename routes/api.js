'use strict';

module.exports = function (app) {

  // In-memory store for stock likes
  const stockLikes = {};

  // Helper function to fetch or initialize stock data
  const getStockData = (stockSymbol, addLike = false) => {
    if (!stockLikes[stockSymbol]) {
      // Initialize stock if not already present
      stockLikes[stockSymbol] = { likes: 0, price: Math.floor(Math.random() * 1000) };
    }

    // If 'like=true', increment likes
    if (addLike) {
      stockLikes[stockSymbol].likes += 1;
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
      const addLike = like === 'true'; // Convert 'like' to boolean

      if (Array.isArray(stock)) {
        // Case: Two stocks comparison
        const stock1 = getStockData(stock[0], addLike);
        const stock2 = getStockData(stock[1], addLike);

        // Calculate relative likes between the two stocks
        const rel_likes1 = stock1.likes - stock2.likes;
        const rel_likes2 = stock2.likes - stock1.likes;

        // Return both stocks with relative likes
        res.json({
          stockData: [
            { stock: stock1.stock, price: stock1.price, rel_likes: rel_likes1 },
            { stock: stock2.stock, price: stock2.price, rel_likes: rel_likes2 }
          ]
        });
      } else {
        // Case: Single stock
        const stockData = getStockData(stock, addLike);
        res.json({ stockData });
      }
    });
};
