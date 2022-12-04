/*
Roman Numeral Converter

Convert the given number into a roman numeral.
Roman numerals 	Arabic numerals
M 	1000
CM 	900
D 	500
CD 	400
C 	100
XC 	90
L 	50
XL 	40
X 	10
IX 	9
V 	5
IV 	4
I 	1

All roman numerals answers should be provided in upper-case.
Tests

Waiting: convertToRoman(2) should return the string II.
Waiting: convertToRoman(3) should return the string III.
Waiting: convertToRoman(4) should return the string IV.
Waiting: convertToRoman(5) should return the string V.
Waiting: convertToRoman(9) should return the string IX.
Waiting: convertToRoman(12) should return the string XII.
Waiting: convertToRoman(16) should return the string XVI.
Waiting: convertToRoman(29) should return the string XXIX.
Waiting: convertToRoman(44) should return the string XLIV.
Waiting: convertToRoman(45) should return the string XLV.
Waiting: convertToRoman(68) should return the string LXVIII
Waiting: convertToRoman(83) should return the string LXXXIII
Waiting: convertToRoman(97) should return the string XCVII
Waiting: convertToRoman(99) should return the string XCIX
Waiting: convertToRoman(400) should return the string CD
Waiting: convertToRoman(500) should return the string D
Waiting: convertToRoman(501) should return the string DI
Waiting: convertToRoman(649) should return the string DCXLIX
Waiting: convertToRoman(798) should return the string DCCXCVIII
Waiting: convertToRoman(891) should return the string DCCCXCI
Waiting: convertToRoman(1000) should return the string M
Waiting: convertToRoman(1004) should return the string MIV
Waiting: convertToRoman(1006) should return the string MVI
Waiting: convertToRoman(1023) should return the string MXXIII
Waiting: convertToRoman(2014) should return the string MMXIV
Waiting: convertToRoman(3999) should return the string MMMCMXCIX
*/

function convertToRoman(num) {
    const roman = {
      1: 'I',
      2: 'II',
      3: 'III',
      5: 'V',
      10: 'X',
      20: 'XX',
      30: 'XXX',
      50: 'L',
      100: 'C',
      200: 'CC',
      300: 'CCC',
      500: 'D',
      1000: 'M',
      2000: 'MM',
      3000: 'MMM'
    }
    let arr = [];
    let multiplier = 1;
    while (num) {
      let last = (num % 10) * multiplier;
      if (roman[last]) arr.unshift(roman[last]);
      else {
        let flag = true
        let one = 1;
        while (flag && last != 0) {
          if (roman[last + multiplier]) { arr.unshift(roman[multiplier], roman[last + multiplier]); flag = false; }
          else if (roman[last - one*multiplier]) { arr.unshift(roman[last - one*multiplier], roman[one*multiplier]); flag = false; }
          one++;
        }
      }
      // console.log(last)
      // console.log(arr)
      num = parseInt(num / 10);
      multiplier *= 10;
    }
  
    return arr.join("");
  }
  
  convertToRoman(83);