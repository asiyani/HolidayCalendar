const express = require('express');
const _ = require('lodash');
const {Holidays} = require('./../../models/holiday');
const {Users} = require('./../../models/user');

const router = express.Router();

//Search Holiday -> return holidays = json
router.get('/search/', (req,res) => {
    let searchQuery = _.pick(req.query,["staff_id","department","fromDate","toDate"]);
    
	
    // .query.filter(models.holiday_table.department == request.get_json()['department'],
    // (( models.holiday_table.start.between(fromDate,toDate) ) OR
    // ((models.holiday_table.start <= fromDate) & (models.holiday_table.end >= fromDate)) )) 
	let dbQuery = {};
    
    if(_.has(searchQuery,'staff_id') )
         dbQuery.staff_id = searchQuery.staff_id ;
    if(_.has(searchQuery,'department') )
        dbQuery.department = searchQuery.department ;

    if(searchQuery.hasOwnProperty("fromDate") && searchQuery.hasOwnProperty("toDate")){
        
        dbQuery.$or =[{startDate:{ $gt:searchQuery.fromDate , $lt:searchQuery.toDate }},
                      {$and:[ {startDate:{$lt:searchQuery.fromDate}}, {endDate:{$lt:searchQuery.fromDate }} ] }];
        
        //console.log(JSON.stringify(dbQuery,undefined,2));
    }else if(searchQuery.hasOwnProperty("fromDate") || searchQuery.hasOwnProperty("toDate")){
        return res.status(400).send('Invalid query need both startDate and endDate');
    }

    //Make sure dbQuery got a value
    if(_.isEmpty(dbQuery)){
        return res.status(400).send('Invalid query');
    }

            Holidays.find(dbQuery).then( (holidays) => {
                                 res.send({holidays});
                                })
                              .catch( e => res.status(400).send(e));
});

//Get holiday by ID -> return holiday = json
router.get('/id/:id', (req,res) => {
    let id = req.params['id'];
    Holidays.findById(id).then( holiday => {
                                if(!holiday){
                                    return res.status(404).send();
                                }
                                res.send({holiday})
                                })
                         .catch( e => res.status(400).send());
});

//update holiday by ID -> return holiday = json
router.patch('/id/:id', (req,res) => {
    let id = req.params['id'];
    let body = _.pick(req.body, ['startDate','endDate','holidayType','status','actionBy']);
    body.actionDate = new Date();

    Holidays.findByIdAndUpdate(id,body,{new:true}).then( holiday => {
                                        if(!holiday){
                                            return res.status(404).send();
                                        }
                                        res.send({holiday});
                                    })
                                    .catch( e => res.status(400).send(e));
});

// Add user to data base return 200 - user = json
router.post('/', (req,res) => {
    let body = _.pick(req.body, ['staff_id','startDate','endDate','holidayType']);
    Users.findById(body.staff_id).then (user => {
                                        if(!user){
                                          return   res.status(404).send({message:'User not found!'});
                                        }

                                        let holiday = new Holidays({
                                            staff_id:user._id,
                                            staffName:user.name,
                                            department: user.department,
                                            startDate: body.startDate,
                                            endDate: body.endDate,
                                            holidayType: body.holidayType,
                                            requestedDate: new Date(),
                                        })

                                        return holiday.save();

                                    })
                                  .then ( holiday => res.send({holiday}))
                                  .catch( e => res.status(400).send(e))
});

//Delete user from Database
router.delete('/:id', (req,res) => {
    let id = req.params['id'];
    Holidays.findByIdAndRemove(id).then( (holiday) => {
                                    if(!holiday){
                                        return res.status(404).send();
                                    }

                                    res.send({holiday});
                                })
                                .catch( e => res.status(400).send(e));
});


module.exports.holidayRoutes = router;