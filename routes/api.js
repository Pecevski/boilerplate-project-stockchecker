'use strict';
const bcrypt = require('bcrypt');
const saltRound = 10;
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

      const stockData = (stock) => ({
        stock,
        price: Math.floor(Math.random() * 1000),
        liks: like ? 1 : 0
      });
      if (Array.isArray(stock)) {
        const response = stock.map(s => stockData(s));
        res.json(response);
      } else {
        const response = stockData(stock);
        res.json(response);
      }     
    });
    
};
