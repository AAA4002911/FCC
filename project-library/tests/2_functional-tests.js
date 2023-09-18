/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    let idForTests; //for comment and deletion related tests
    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: "Test Book" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');

            idForTests = res.body._id; //for comment and deletion related tests
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, "response should be a string");
            assert.equal(res.text, "missing required field title", 'response should be "missing required field title"');
            done();
          });

      });
    });

    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .get('/api/books/badId')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response text field should be a string');
            assert.equal(res.text, "no book exists", 'response should be "no book exists"');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .get('/api/books/' + idForTests)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai.request(server)
          .post('/api/books/' + idForTests)
          .send({ comment: "test comment" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.equal(res.body.comments.length, 1, "Book should have exactly 1 comment")
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
          .post('/api/books' + idForTests)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, "response text field should be a string");
            assert.equal(res.text, 'missing required field comment', 'response should be "missing required field comment"');
          });
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
          .post('/api/books/badId')
          .send({ comment: "this comment should not be submitted" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, "response text field should be a string");
            assert.equal(res.text, 'no book exists', 'response should be "no book exists"');
          });
        done();
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .delete('/api/books/' + idForTests)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, "response text field should be a string");
            assert.equal(res.text, "delete successful", 'response should be "delete successful"');
          });
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done) {
        chai.request(server)
          .delete('/api/books/badId')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, "response text field should be a string");
            assert.equal(res.text, 'no book exists', 'response should be "no book exists"');
          });
        done();
      });

    });

  });

  
});


