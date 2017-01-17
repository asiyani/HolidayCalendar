const express = require('express');
const bodyParser = require('body-parser');

const {moongoose} = require('./config/mongoose');
const {User} = require('./models/user');

const app = express();

let port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());




/*
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body.username)
})
*/



app.listen(port, () => {
    console.log('Server listening on Port:',port);
})