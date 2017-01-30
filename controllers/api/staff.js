const express = require('express');
const _ = require('lodash');
const {Users} = require('./../../models/user');
const bcrypt = require('bcryptjs');


const router = express.Router();

//Get all users by department -> return users = json
router.get('/department/:department', (req,res) => {
    let department = req.params['department'];
    Users.find({department:new RegExp('^'+department+'$', "i")}).then ( users => {
                                if(users.length === 0 ){
                                    return res.status(404).send();
                                }

                                res.send({users})
                            })
                            .catch( e => res.status(400).send(e));
});

//Get user by ID -> return user = json
router.get('/id/:id', (req,res) => {
    let id = req.params['id'];
    Users.findById(id).then( (user) => {
                        if(!user){
                           return  res.status(404).send();
                        }
                        res.send({user});
                    })
                    .catch( e => res.status(400).send(e));
});

//Get user by ID -> return user = json
router.patch('/id/:id', (req,res) => {
    if(_.has(req.body,['name']) || _.has(req.body,['email'])){
        return res.status(400).send({message:'can not change user name and password'});
    }
    let body = _.pick(req.body,['password','isAdmin','department','job_role']);
    let id = req.params['id'];
    Users.findOneAndUpdate({_id:id},body,{new:true}).then( user => {
                                    if(!user){
                                        return res.status(404).send();
                                    }
                                    res.send({user});
                                })
                                .catch( e => res.status(400).send(e));
});

// Add user to data base return 200 - user = json
router.post('/', (req,res) => {
    let body = _.pick(req.body,['name','email','password','isAdmin','department','job_role']);
    let newUser = new Users(body);
    newUser.save().then ( (user) => res.send({user}))
                  .catch( e => res.status(400).send(e));
});


//Delete user from Database
router.delete('/:id', (req,res) => {
    let id = req.params['id'];
    Users.findByIdAndRemove(id).then( (user) => {
                        if(!user){
                           return  res.status(404).send();
                        }
                        res.send({user});
                    })
                    .catch( e => res.status(400).send(e));
});

module.exports.staffRoutes = router;
