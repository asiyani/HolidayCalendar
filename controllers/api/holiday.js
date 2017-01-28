const express = require('express');
const {Holidays} = require('./../../models/holiday');

const router = express.Router();

//Get all users by department -> return users = json
router.get('/search/', (req,res) => {
    let searchQuery = _.pick(req.query,["staffName","department","startDate","endDate"]);
    
	
// .query.filter(models.holiday_table.department == request.get_json()['department'],
// (( models.holiday_table.start.between(fromDate,toDate) ) OR
// ((models.holiday_table.start <= fromDate) & (models.holiday_table.end >= fromDate)) )) 
	

    if(searchQuery.hasOwnProperty("startDate") && searchQuery.hasOwnProperty("endDate")){
        
        Holidays.find({

        })

    }else{

    }
    res.send("OK");
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