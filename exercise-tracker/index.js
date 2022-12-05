const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const mongo = require("mongodb");
require('dotenv').config()

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const server = process.env.MONGO_URI;

mongoose.connect(server, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('connected to Server Successfully'))
.catch(e=>console.log(e));

const userSchema = new mongoose.Schema({
  username: {type: String, required: true}
}, {collection: "Users"})
const Users = mongoose.model("Users", userSchema);

const exerciseSchema = new mongoose.Schema({
  username: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {type: String}
}, {collection: "Exercises"})
const Exercises = mongoose.model("Exercises", exerciseSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async (req, res) => {
  const name = req.body.username;

  const user_data = await Users.findOne({ username: name });

  if (user_data) { return res.send(`Username ${name} already exists.`)}
      
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
  const ARRAY = await Users.find({}, {"__v" : 0});
  res.json(ARRAY);
})

app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id; 
  const { description, duration} = req.body;
  let date = (req.body.date) ? new Date(req.body.date): new Date();
  date = date.toDateString();

  if (!id || !description || !duration) {return res.status(404).json({
    status: "404",
    message: "Data is missing in required fields"
  })}
  const user_data = await Users.findOne({ _id: id });

  if (!user_data) {return res.json("ID not found in database")}
  
  let data = new Exercises();
  data.username = user_data.username;
  data.description = description;
  data.duration = duration;
  data.date = date;

  data.save((err, data) => {
    if (err) return console.log("ERROR", err);
    const response = {
      "username": data.username,
      "description": data.description,
      "duration": data.duration,
      "date": data.date,
      "_id": id,
    }
    res.json(response);
  });  
})

app.get("/api/users/:_id/logs", async (req, res) => {
  const id = req.params._id; 
  let {from, to, limit} = req.query;
  console.log(from, to, limit)
  
  const user_data = await Users.findOne({ _id: id});
  const exercise_data = await Exercises.find({ username : user_data.username}, {"_id" : 0, "username" : 0, "__v": 0});
  let temp= exercise_data;
  
  if(from){
    const fromDate= new Date(from)
    temp = temp.filter(exe => new Date(exe.date) > fromDate);
  }
  
  if(to){
    const toDate = new Date(to)
    temp = temp.filter(exe => new Date(exe.date) < toDate);
  }
  
  if(limit){
    limit = new Number(limit);
    temp = temp.slice(0,limit);
  }

  const log = {
    _id: id,
    username: user_data._id,
    count: (temp.length),
    log: temp
  }
  
  res.json(log)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
