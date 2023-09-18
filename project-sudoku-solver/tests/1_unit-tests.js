const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const puzzles = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

suite('UnitTests', () => {

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.lengthOf(puzzles[0][0], 81, 'Test string is 81 chars.');
    assert.deepEqual(solver.validate(puzzles[0][0]), { valid: true }, 'Test str is 81 chars.');
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.deepEqual(solver.validate(puzzles[6][0]), { valid: false, msg: 'Invalid characters in puzzle' }, 'invalid string should fail.');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.deepEqual(solver.validate(puzzles[5][0]), { valid: false, msg: 'Expected puzzle to be 81 characters long' }, 'given str should fail correctly with error.');
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(puzzles[0][0], 'a', 2, 9), 'value is acceptable within given row.');
    assert.isTrue(solver.checkRowPlacement(puzzles[0][0], 'b', 2, 4), 'value is acceptable within given row.');
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(puzzles[0][0], 'a', 2, 1), 'value conflicts within given row.');
    assert.isFalse(solver.checkRowPlacement(puzzles[0][0], 'b', 1, 6), 'value conflicts within given row.');
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(puzzles[0][0], 'a', 2, 3), '3 is not present in column 2 of puzzles[0][0]');
    assert.isTrue(solver.checkColPlacement(puzzles[0][0], 'a', 2, 5), '5 is not present in column 2 of puzzles[0][0]');
    assert.isTrue(solver.checkColPlacement(puzzles[0][0], 'a', 2, 8), '8 is not present in column 2 of puzzles[0][0]');
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(puzzles[0][0], 'c', 3, 6), '6 is present in column');
    assert.isFalse(solver.checkColPlacement(puzzles[0][0], 'b', 1, 1), '1 is present in column');
    assert.isFalse(solver.checkColPlacement(puzzles[0][0], 'a', 5, 5), '5 is present in column');
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(puzzles[0][0], 'a', 2, 3), '3 should be a valid placement within 3x3 region');
    assert.isTrue(solver.checkRegionPlacement(puzzles[0][0], 'b', 2, 3), '3 should be a valid placement within 3x3 region');
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(puzzles[0][0], 'a', 2, 2), 'region 3x3 placement is bad.');
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.isOk(solver.solve(puzzles[0][0]));
    assert.isString(solver.solve(puzzles[0][0]));
    assert.equal(solver.solve(puzzles[0][0]), puzzles[0][1], 'valid puzzle should be able to be solved.');
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.deepEqual(solver.solve(puzzles[6][0]), { valid: false, msg: 'Invalid characters in puzzle' }, 'string argument should be a valid puzzleString.');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.equal(solver.solve(puzzles[0][0]), puzzles[0][1], 'valid incomplete puzzle is completed in solve.')
  });

});