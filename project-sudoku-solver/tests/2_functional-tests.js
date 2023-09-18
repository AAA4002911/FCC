const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Solve Tests', () => {
    // Solve a puzzle with valid puzzle string: POST request to /api/solve
    test('valid puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'response status should be 200');
            assert.equal(res.body.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625', 'valid partial puzzle should return finished puzzle string.');
          }
          done();
        })
    });
    // Solve a puzzle with missing puzzle string: POST request to /api/solve
    test('missing puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'although string is empty, response should be 200 from validation.');
            assert.equal(res.body.error, 'Required field missing', 'empty string should pass solver and return invalid response.')
          }
          done();
        })
    });
    // Solve a puzzle with invalid characters: POST request to /api/solve
    test('puzzle with invalid characters', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5.$2.84..63.12.7.2..5.....9.T1....8.2.3674.3.7.2..9.47.D.8..1..16....926914.37.' })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'invalid string should pass solver and return 200 status.');
            assert.equal(res.body.error, 'Invalid characters in puzzle', 'invalid string should pass solver and return invalid response.')
          }
          done();
        })
    });
    // Solve a puzzle with incorrect length: POST request to /api/solve
    test('puzzle with incorrect length', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9....'
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'string with too few chars should return solver with 200 status code.')
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'string with too few chars should return solver with invalid response.')
          }
          done();
        })
    });
    // Solve a puzzle that cannot be solved: POST request to /api/solve
    test('puzzle that cannot be solved', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({
          puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.66.3'
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'although test is impossible, validation should catch it and send the fail to server.');
            assert.equal(res.body.error, 'Puzzle cannot be solved', 'string is impossible and was caught by validation check.');
          }
          done();
        })
    });
  });

  suite('Check Tests', () => {
    // Check a puzzle placement with all fields: POST request to /api/check
    test('Check a puzzle placement with all fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'b3',
          value: 2,
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'check should return value and not error out');
            assert.equal(res.body.valid, false, '2 should conflict with row, column and region/grid.');
            assert.equal(res.body.conflict[0], 'row', 'value 2 at square b3 should conflict with row.');
            assert.lengthOf(res.body.conflict, 3, 'value 2 at square b3 should conflict with row, column, and region/grid.');
          }
          done();
        })
    });
    // Check a puzzle placement with single placement conflict: POST request to /api/check
    test('Check a puzzle placement with single placement conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'a2',
          value: 1,
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'check should return value and not error out');
            assert.equal(res.body.valid, false, '2 should conflict with row, column and region/grid.');
            assert.equal(res.body.conflict[0], 'row', 'value 2 at square b3 should conflict with row.');
            assert.lengthOf(res.body.conflict, 1, 'value 2 at square b3 should conflict with row, column, and region/grid.');
          }
          done();
        })
    });
    // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          // const puzzle, row: coordinate[0], col: coordinate[1], value
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'a1',
          value: 1,
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'check should return value and not error out');
            assert.equal(res.body.valid, false, '2 should conflict with row, column and region/grid.');
            assert.equal(res.body.conflict[1], 'column', 'conflict array should be [row, column]');
            assert.lengthOf(res.body.conflict, 2, 'value 2 at square b3 should conflict with row, column, and region/grid.');
          }
          done();
        })
    });
    // Check a puzzle placement with all placement conflicts: POST request to /api/check
    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          // const puzzle, row: coordinate[0], col: coordinate[1], value
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'b3',
          value: 2,
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'check should return value and not error out');
            assert.equal(res.body.valid, false, '2 should conflict with row, column and region/grid.');
            assert.equal(res.body.conflict[2], 'region', 'value 2 at square b3 should conflict with row.');
            assert.lengthOf(res.body.conflict, 3, 'value 2 at square b3 should conflict with row, column, and region/grid.');
          }
          done();
        })
    });
    // Check a puzzle placement with missing required fields: POST request to /api/check
    test('Check a puzzle placement with missing required fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
          // const puzzle, row: coordinate[0], col: coordinate[1], value
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'b3',
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'missing input fields are caught and handled.');
            assert.equal(res.body.error, "Required field(s) missing", 'missing required field should not pass.');
          }
          done();
        })
    });
    // Check a puzzle placement with invalid characters: POST request to /api/check
    test('Check a puzzle placement with invalid characters', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          // const puzzle, row: coordinate[0], col: coordinate[1], value
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'b3',
          value: '$fafa',
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'invalid chars in input field should be handled.');
            assert.equal(res.body.error, 'Invalid value', 'Invalid value should be caught and return correct error msg.');
          }
          done();
        })
    });
    // Check a puzzle placement with incorrect length: POST request to /api/check
    test('Check a puzzle placement with incorrect length', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          // const puzzle, row: coordinate[0], col: coordinate[1], value
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....',
          coordinate: 'a2',
          value: '7',
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'puzzle with incorrect length is caught and handled.');
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'puzzle is too short so it should not be valid.');
          }
          done();
        })
    });
    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          // const puzzle, row: coordinate[0], col: coordinate[1], value
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'a22',
          value: '7',
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'coordinate a22 should be handled.');
            assert.equal(res.body.error, 'Invalid coordinate', 'invalid coordinate given.');
          }
          done();
        })
    });
    // Check a puzzle placement with invalid placement value: POST request to /api/check
    test('Check a puzzle placement with invalid placement value', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          // const puzzle, row: coordinate[0], col: coordinate[1], value
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'a2',
          value: '12',
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(res.status, 200, 'value 12 should exceed 1-9 and be handled.');
            assert.equal(res.body.error, 'Invalid value', 'value was out of range (1-9).');
          }
          done();
        })
    });
    console.log("Test execution is completed.");
  });
});
after(function() {
  chai.request(server)
    .get('/')
});