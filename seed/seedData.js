require('./../config/config');
var {addUser,addHoliday} = require('./../seed/addData');

addUser();
addHoliday();