require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./models/User')

const port = 8000
const app = express()

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose.connect(process.env.MONGO_URI_USERDATA)

app.use(bodyParser.json())

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server is listening on port:${port}`)
})

function sendResponse(res, err, data) {
  if (err) {
    res.json({
      success: false,
      message: err,
    })
  } else if (!data) {
    res.json({
      success: false,
      message: 'Not Found',
    })
  } else {
    res.json({success: true, data})
  }
}

// CREATE
app.post('/users', (req, res) => {
  User.create(
    {
      name: req.body.newData.name,
      email: req.body.newData.email,
      password: req.body.newData.password,
    },
    (err, data) => sendResponse(res, err, data),
  )
})

app
  .route('/users/:id')
  // READ
  .get((req, res) => {
    User.findById(req.params.id, (err, data) => sendResponse(res, err, data))
  })
  // UPDATE
  .put((req, res) => {
    User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.newData.name,
        email: req.body.newData.email,
        password: req.body.newData.password,
      },
      {new: true},
      (err, data) => sendResponse(res, err, data),
    )
  })
  // DELETE
  .delete((req, res) => {
    User.findByIdAndDelete(req.params.id, (err, data) =>
      sendResponse(res, err, data),
    )
  })
