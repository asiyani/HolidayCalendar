const {Users} = require('./../models/user');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


let isAuthenticated = (req,res,next) => {
    token = req.header('x-auth');
    Users.findByToken(token).then( (user) => {
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