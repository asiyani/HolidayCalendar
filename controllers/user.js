const express = require('express');
const _ = require('lodash');

const {isAuthenticated} = require('./../middleware/isAuthenticated');
const {Users} = require('./../models/user');

const router = express.Router();



//Get user by ID -> return user = json
router.get('/',isAuthenticated ,(req,res) => {
    res.send('GET USER DETAILS TOKEN REQ');
});

// Add user to data base return 200 - user = json
router.post('/', (req,res) => {
    res.send('UPDATE USER DETAILS TOKEN REQ');
});

// Login for user = return token 
router.post('/login',(req,res) => {
    var body = _.pick(req.body,['email','password']);

    Users.findByCredential(body.email,body.password).then( user => {
                                        return user.generateAuthToken();
                                    })
                                    .then( token => {
                                        res.header('x-auth',token).send();
                                    })
                                    .catch( e => {
                                            res.status(401).send()});
});

//Delete user from Database 
router.delete('/logout', isAuthenticated ,(req,res) => {
    let token = req.header('x-auth');
    Users.findByToken(token).then( user => {
                            if(!user)
                                return Promise.reject();
                            return user.removeToken(token);
                        }).then ( (data) => {
                            res.send();
                        })
                        .catch( e => {
                            //console.log(e);
                            res.status(400).send();
                        });
});

module.exports.userRoutes = router;
