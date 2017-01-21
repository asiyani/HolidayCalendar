const express = require('express');

const router = express.Router();



//Get user by ID -> return user = json
router.get('/', (req,res) => {
res.send('GET USER DETAILS TOKEN REQ');
});

// Add user to data base return 200 - user = json
router.post('/', (req,res) => {
res.send('UPDATE USER DETAILS TOKEN REQ');
});

// Login for user = return token 
router.post('/login',(req,res) => {
res.send('/login');
});

//Delete user from Database 
router.delete('/logout', (req,res) => {
    res.send('/logout');
});


module.exports.userRoutes = router;