'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();
  app.get("/api/convert/", (req, res) => {
    try { 
        let input = req.query.input;
        let initNum = convertHandler.getNum(input);
        let initUnit = convertHandler.getUnit(input);
        let returnNum = convertHandler.convert(initNum, initUnit);
        let returnUnit = convertHandler.getReturnUnit(initUnit);
        let toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
  
        let result = {}
        result['initNum'] = initNum
        result['initUnit'] = initUnit
        result['returnNum'] = returnNum
        result['returnUnit'] = returnUnit
        result['string'] = toString


        if(initNum === 'invalid number' && initUnit === 'invalid unit'){
          return res.json('invalid number and unit')
        }
      
        if(initUnit === 'invalid unit'){
          return res.json(initUnit)
        }

        if(initNum === 'invalid number'){
          return res.json(initNum)
        }
      
        res.json(result);
      
    } catch(err) {     
      res.status(500).json({
        status : "failed",
        message: err.message,
        error: err
      })
  }})
};
