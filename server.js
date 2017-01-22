const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./config/mongoose');
const {User} = require('./models/user');
const {isAuthenticated} = require('./middleware/isAuthenticated')
const {staffRoutes} = require('./controllers/api/staff');
const {holidayRoutes} = require('./controllers/api/holiday');
const {userRoutes} = require('./controllers/user')


const app = express();

let port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.use('/user',userRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/holiday', holidayRoutes);

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