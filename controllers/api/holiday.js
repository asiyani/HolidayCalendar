const express = require('express');

const router = express.Router();

//Get all users by department -> return users = json
router.get('/department/:department', (req,res) => {
    res.send('get holiday by department');
});

//Get user by ID -> return user = json
router.get('/id/:id', (req,res) => {
    res.send('GET holiday by ID');
});

//Get user by ID -> return user = json
router.patch('/id/:id', (req,res) => {
    res.send('EDIT  holiday by ID');
});

// Add user to data base return 200 - user = json
router.post('/', (req,res) => {
    res.send('/addHoliday');
});

//Delete user from Database
router.delete('/:id', (req,res) => {
    res.send('Delete Holiday');
});


module.exports.holidayRoutes = router;