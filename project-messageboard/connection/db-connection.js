const mongoose = require('mongoose')
const db = mongoose.connect(process.env['DB'], {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch((err) => {
    console.log('error', err)
  })

module.exports = db;