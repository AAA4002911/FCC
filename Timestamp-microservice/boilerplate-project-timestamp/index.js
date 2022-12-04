// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/:date", function(req, res) {
  const { date } = req.params;

  let unix_key = Math.floor(new Date(date).getTime());
  let date_key = new Date(date).toUTCString();
  if (date_key == "Invalid Date") {
    unix_key = parseInt(date);
    date_key = new Date(parseInt(date)).toUTCString();
  }
  if (date_key == "Invalid Date") {
    return res.json({ error: "Invalid Date" })
  }
  res.json({
    unix: unix_key,
    utc: date_key
  });
});

app.get("/api", function(req, res) {
  date = new Date();
  const unix_key = Math.floor(new Date(date).getTime())
    return res.json({
      unix: unix_key,
      utc: date
    })
})




// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
