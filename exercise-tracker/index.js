const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const mongo = require("mongodb");
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const server = process.env.MONGO_URI;

mongoose.connect(server, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('connected to Server Successfully'))
  .catch(e => console.log(e));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
}, { collection: "Users" })
const Users = mongoose.model("Users", userSchema);

const exerciseSchema = new mongoose.Schema({
  user_id: {type: String},
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date }
}, { collection: "Exercises" })
const Exercises = mongoose.model("Exercises", exerciseSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async (req, res) => {
  const name = req.body.username;

  const user_data = await Users.findOne({ username: name });

  if (user_data) { return res.send(`Username ${name} already exists.`) }

  let data = new Users();
  data.username = name;
  data.save((err, user) => {
    if (err) return console.log('ERROR', err);
    res.json({
      username: user.username,
      _id: user._id
    })
  })
})

app.get("/api/users", async (req, res) => {
  const ARRAY = await Users.find({}, { "__v": 0 });
  res.json(ARRAY);
})

app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const { description, duration } = req.body;
  let date = (req.body.date) ? new Date(req.body.date) : new Date();

  if (!id || !description || !duration) {
    return res.status(404).json({
      status: "404",
      message: "Data is missing in required fields"
    })
  }
  const user_data = await Users.findOne({ _id: id });

  if (!user_data) { return res.json("ID not found in database") }

  let data = new Exercises();
  data.user_id = id;
  data.username = user_data.username;
  data.description = description;
  data.duration = parseInt(duration);
  data.date = date;

  data.save((err, data) => {
    if (err) return console.log("ERROR", err);
    const response = {
      "username": data.username,
      "description": data.description,
      "duration": data.duration,
      "date": data.date.toDateString(),
      "_id": id,
    }
    res.json(response);
  });
})

let count;
let initial;
let final;

app.get('/api/users/:_id/logs', (req, res) => {
  //  query--> ?from=date1&to=date2&limit=number
  if (req.query.from) {
    initial = new Date(req.query.from)
  } else {
    initial = new Date('1970-01-01')
  }

  if (req.query.to) {
    final = new Date(req.query.to)
  } else {
    final = new Date()
  }

  if (req.query.limit) {
    count = req.query.limit
  } else {
    count = 1000
  }

  Users.findById(req.params._id, (err, data) => {
    let gotUsername = data.username;
    if (!data) {
      console.log('user undefined.')
    } else {
      Exercises.find({ user_id: req.params._id, username: gotUsername, date: { $gte: initial, $lte: final } }).limit(count).exec ((err, output) => {
        let newOutput = output.map(obj => (
          {
            description: obj.description,
            duration: obj.duration,
            date: obj.date.toDateString()
          }
        ))
        res.send({ username: gotUsername, _id: req.params._id, count: newOutput.length, log: newOutput })
      })


    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


/*

{ from: '1989-12-31', to: '1990-01-04' }
1989-12-31 1990-01-04 undefined

{ limit: '1' }
undefined undefined 1

{ from: '1990-01-02', to: '1990-01-04', limit: '1' }
1990-01-02 1990-01-04 1

*/
