const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Convert 10L (valid input unit)', function(done) {
    chai.request(server)
      .get('/api/convert')
        .query({input: '10L'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.initNum, 10);
          assert.equal(res.body.initUnit, 'L');
          assert.approximately(res.body.returnNum, 2.64172, 0.1);
          assert.equal(res.body.returnUnit, 'gal');
        })
        done();      
  });
  
  test('Convert 32g (invalid input unit)', function(done) {
    chai.request(server)
      .get('/api/convert')
      .query({input: '32g'})
      .end((error, response) => {
      assert.equal(response.body, 'invalid unit')
    })
    done();
  });

  test('Convert 3/7.2/4kg (invalid number)', function(done) {
    chai.request(server)
      .get('/api/convert')
      .query({input: '3/7.2/4kg'})
      .end((error, response) => {
      assert.equal(response.body, 'invalid number')
    })
    done();
  });

  test('Convert 3/7.2/4kilomegagram (invalid number and unit)', function(done) {
    chai.request(server)
      .get('/api/convert')
      .query({input: '3/7.2/4kilomegagram'})
      .end((error, response) => {
      assert.equal(response.body, 'invalid number and unit')
    })
    done();
  });

  test('Convert kg (no number)', function(done) {
    chai.request(server)
      .get('/api/convert')
      .query({input: 'kg'})
      .end((error, response) => {
      assert.equal(response.body.returnNum, 2.20462)
    })
    done();
  });
  
});
