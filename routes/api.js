'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (app) {

  const hashIP = async (ip) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(ip, salt);
  };

  app.route('/api/stock-prices')
    .get( async function (req, res){
      const {stock, like} = req.query;
      const ip = req.ip;
      const hashedIP = await hashIP(ip);

      const stockData = (stock, likes = 0) => ({
        stock,
        price: Math.floor(Math.random() * 1000),
        likes
      });

      if (Array.isArray(stock)) {
        const stock1 = stockData(stock[0], like ? 1 : 0);
        const stock2 = stockData(stock[1], like ? 1 : 0);
        const rel_likes = stock1.likes - stock2.likes;
        res.json([
          { stock: stock1.stock, price: stock1.price, rel_likes },
          { stock: stock2.stock, price: stock2.price, rel_likes: -rel_likes }
        ]);
      } else {
        const response = stockData(stock, like ? 1 : 0);
        res.json({ stockData: response });
      }
    });
    
};
