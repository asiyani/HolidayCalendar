
if(!process.env.NODE_ENV){
    process.env.NODE_ENV = 'dev';
}
//require('dotenv').config({path: `./.${process.env.NODE_ENV}.env`});
var dotenv = require('dotenv').config({path:__dirname + `/.${process.env.NODE_ENV}.env`});
console.log(process.env.NODE_ENV,process.env.MONGODB_URI);
//console.log(dotenv);