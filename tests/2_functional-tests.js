const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('GET /api/stock-prices => stockData object', function() {

    // Test for viewing a single stock
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

    // Test for viewing one stock and liking it
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
          assert.equal(res.body.stockData.likes, 1); // Check likes after the first like
          done();
        });
    });

    // Test for viewing the same stock and liking it again
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
          assert.equal(res.body.stockData.likes, 2); // Verify likes increase
          done();
        });
    });

    // Test for viewing two stocks without likes
    test('Viewing two stocks without liking', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['AAPL', 'GOOG'] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.lengthOf(res.body.stockData, 2);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.equal(res.body.stockData[0].rel_likes, -1); // Ensure rel_likes is correct
          assert.equal(res.body.stockData[1].rel_likes, 1);
          done();
        });
    });

    // Test for viewing two stocks and liking them
    test('Viewing two stocks and liking them', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['AAPL', 'GOOG'], like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.lengthOf(res.body.stockData, 2);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          assert.equal(res.body.stockData[0].rel_likes, 0); // Both liked, should be equal
          assert.equal(res.body.stockData[1].rel_likes, 2);
          done();
        });
    });

  });
});
