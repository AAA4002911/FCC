const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

  translate(origin, locale) {
    let source = origin;
    if (locale === "american-to-british") {
      //american-to-british
      Object.keys(americanToBritishTitles).forEach(function(key, index) {
        var regEx = new RegExp(key, "ig");
        source = source.replace(regEx, '<span class="highlight">' + americanToBritishTitles[key.toLowerCase()] + '</span>');
      });
      //Spelling
      Object.keys(americanToBritishSpelling).forEach(function(key, index) {
        var regEx = new RegExp(key, "ig");
        source = source.replace(regEx, '<span class="highlight">' + americanToBritishSpelling[key.toLowerCase()] + '</span>');
      });
      //time
      var regEx = new RegExp(/^(.*)(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])(.*)$/);
      source = source.replace(regEx, '$1<span class="highlight">$2.$3</span>$4')
    }
    else {
      //british-to-american time
      var regEx = new RegExp(/^(.*)(0[0-9]|1[0-9]|2[0-3]).([0-5][0-9])(.*)$/);
      source = source.replace(regEx, '$1<span class="highlight">$2:$3</span>$4')



    }

    //first char to upper
    let array_source = source.split('<span class="highlight">');
    if (array_source[0] === '')
      array_source[1] = array_source[1].charAt(0).toUpperCase() + array_source[1].slice(1); return array_source.join('<span class="highlight">');
  }

}

module.exports = Translator;