const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  test('Whole Number Input', (done) => {
    assert.equal(convertHandler.getNum('32L'), 32);
    done();
  });

  test('Unit Inputs', function(done) {
    let input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
    input.forEach(function(ele) {
      if (ele === 'l' || ele === 'L') return assert.equal(convertHandler.getUnit(32 + ele), 'L');
      assert.equal(convertHandler.getUnit(32 + ele), ele.toLowerCase())
    });
    done();
  });

  test('For Each Valid Unit Inputs', function(done) {
    let input = ['gal','l','mi','km','lbs','kg'];
    let expect = ['L','gal','km','mi','kg','lbs'];
    input.forEach(function(ele, i) {
      assert.equal(convertHandler.getReturnUnit(ele), expect[i])
    });
    done();
  });

  test('Unknown Unit Input', function(done) {
    let input = 'g'
    let expected ='invalid unit'
    assert.equal(convertHandler.getUnit(32 + input), expected)
    done()
  });

  test('Gal to L', function(done) {
    let input = [5, 'gal'];
    let expected = 18.9271;
  assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
    done();
  });

  test('L to Gal', function(done) {
    let input = [5, 'L'];
    let expected = 1.32086;
  assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
    done();
  });

  test('Lbs to Kg', function(done) {
    let input = [5, 'lbs'];
    let expected = 2.26796;
  assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
    done();
  });

  test('Kg to Lbs', function(done) {
    let input = [5, 'kg'];
    let expected = 11.0231;
    assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
    done();
  });

  test('Mi to Km', function(done) {
    let input = [5, 'mi'];
    let expected = 8.04672;
    assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
    done();
  });

  test('Km to Mi', function(done) {
    let input = [5, 'km'];
    let expected = 3.10686;
    assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1);
    done();
  });

  test("Invalid Input (double fraction)", function(done) {
      let input = "3/7.2/4L";
      assert.equal(convertHandler.getNum(input), "invalid number");
      done();
    });

  test('Decimal Input', function(done) {
    let input = '32.65L';
    assert.equal(convertHandler.getNum(input),32.65);
    done();
  });

  test('Fractional Input', function(done) {
    let input = '12/8';
    assert.equal(convertHandler.getNum(input),1.5);
    done();
  });
  
  test('Fractional Input w/ Decimal', function(done) {
    let input = '27/5.4';
    assert.equal(convertHandler.getNum(input),5);
    done();
  });

  test('No Numerical Input', function(done) {
    let input = 'kg'
    let expected = 1
    assert.equal(convertHandler.getNum(input), 1)
    done()
  });

  test('For Each Valid Unit Inputs', function(done) {
    let input = ['gal','l','mi','km','lbs','kg'];
    let expect = ['gallons','litres','miles','kilometers','pounds', 'kilograms'];
    input.forEach(function(ele, i) {
      assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
    });
    done();
  });
  
});
