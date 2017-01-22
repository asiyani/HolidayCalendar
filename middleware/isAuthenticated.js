const {User} = require('./../models/user');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


//This is a middleware it will not get email and password all the time....
// let authenticate = (req,res,next) => {
//     let body = _.pick(req.body,['email', 'password']);

//     User.findOne({email:body.email}).then( (user) => {
//         bcrypt.compare(body.password, user.password, function(err, result) {
//             console.log(result);
//             if(!result)
//                 return res.status(401).send();
//             next();
//         });
//     }).catch ( (err) => {
//         res.status(404).send();
//     })
// }


let isAuthenticated = (req,res,next) => {
    token = req.header('x-auth');
    User.findByToken(token).then( (user) => {
                            if(!user)
                               return Promise.reject();

                            req.user = user;
                            req.token = token;
                            next();
                        }).catch( e => {
                            res.status(401).send();
                        })
    
};


module.exports = {isAuthenticated};