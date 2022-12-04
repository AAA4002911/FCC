require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const shortid = require('shortid');
const valid_url = require("valid-url")
const mongo = require("mongodb");
const mongoose = require("mongoose");

const server = process.env.MONGO_URI;

mongoose.connect(server, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


const urlSchema = new mongoose.Schema({
  original_url: {type: String},
  short_url: {type: String}
})
const urls = mongoose.model("urls", urlSchema);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;
  const url_key = shortid.generate();

  if (!valid_url.isWebUri(url)) {
    return res.json({ error: 'invalid url' });
  }

  const data = await urls.findOne({original_url: url});
  if (data) {
    console.log(data, "found");
    res.json({
      original_url: data.original_url,
      short_url: data.short_url
    })
  } else {
    try {
      const data = new urls({
        original_url: url,
        short_url: url_key
      })
      console.log(data, "new");
      await data.save();
      res.json({
        original_url: data.original_url,
        short_url: data.short_url
      })
    }
    catch(err) {
      res.json({ error: "Server Error" + err})
    }  
  }
});

app.get("/api/shorturl/:url?", async (req, res) => {
  const { url } = req.params;

  try {
    const input_url = await urls.findOne({ short_url: url });
    if (input_url) {
      return res.redirect(input_url.original_url)
    } else {
      return res.status(404).json({ error: "No URL Found"})
    }
  }
  catch(err) {
    res.json({ error: "Server Error" + err})
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});