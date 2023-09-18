'use strict';

const Translator = require('../components/translator.js');

module.exports = function(app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {

      let locale = req.body.locale;
      let text = req.body.text;

      if (locale == null || text == null) {
        return res.json({ error: 'Required field(s) missing' });
      }
      if (text == "") {
        return res.json({ error: 'No text to translate' });
      }

      if (locale != "british-to-american" && locale != "american-to-british") {
        return res.json({ error: 'Invalid value for locale field' });
      }


      let translated = translator.translate(text, locale);
      if (translated == text) {
        return res.json({ text: text, translation: "Everything looks good to me!" })
      }
      else {
        res.json({ text: text, translation: translated })
      }
    });
};
