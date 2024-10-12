const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('GET /api/stock-prices => stockData object', function() {

    test('Viewing one stock', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'AAPL' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'AAPL');
          done();
        });
    });

    test('Viewing one stock and liking it', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'AAPL', like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'AAPL');
          assert.equal(res.body.stockData.likes, 1); // Assuming 1 like per IP
          done();
        });
    });

    test('Viewing the same stock and liking it again', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'AAPL', like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.stock, 'AAPL');
          assert.equal(res.body.stockData.likes, 1); // Assuming 1 like per IP
          done();
        });
    });

    test('Viewing two stocks', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['AAPL', 'GOOG'] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.lengthOf(res.body, 2);
          assert.property(res.body[0], 'stock');
          assert.property(res.body[0], 'price');
          assert.property(res.body[0], 'rel_likes');
          assert.property(res.body[1], 'stock');
          assert.property(res.body[1], 'price');
          assert.property(res.body[1], 'rel_likes');
          done();
        });
    });

    test('Viewing two stocks and liking them', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['AAPL', 'GOOG'], like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.lengthOf(res.body, 2);
          assert.property(res.body[0], 'stock');
          assert.property(res.body[0], 'price');
          assert.property(res.body[0], 'rel_likes');
          assert.property(res.body[1], 'stock');
          assert.property(res.body[1], 'price');
          assert.property(res.body[1], 'rel_likes');
          assert.equal(res.body[0].rel_likes, 0); // Assuming 1 like per IP
          assert.equal(res.body[1].rel_likes, 0); // Assuming 1 like per IP
          done();
        });
    });

  });
});
