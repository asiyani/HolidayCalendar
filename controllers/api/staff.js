const express = require('express');

const router = express.Router();

//Get all users by department -> return users = json
router.get('/department/:deparment', (req,res) => {
    res.send('/:department');
});

//Get user by ID -> return user = json
router.get('/id/:id', (req,res) => {
res.send('/:id');
});

//Get user by ID -> return user = json
router.patch('/id/:id', (req,res) => {
    res.send('EDIT Staff details by ID');
});

// Add user to data base return 200 - user = json
router.post('/', (req,res) => {
res.send('/adduser');
});


//Delete user from Database
router.delete('/:id', (req,res) => {
    res.send('/:id');
});










module.exports.staffRoutes = router;