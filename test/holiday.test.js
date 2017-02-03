var supertest = require('supertest');
var mongoose = require('mongoose');
var expect = require('expect');
var bcrypt = require('bcryptjs');

var { app } = require('./../server');
var { addUser, addHoliday} = require('./../seed/addData');
var { Users } = require('./../models/user');
var { Holidays } = require('./../models/holiday');

var departments = ['IT', 'Legal', 'Marketing', 'Human Resources'];
var usersJson = require('./../seed/users.json');
var holidayJson ;

before ( done => {
    console.log('Removing users .......');
    Users.remove({}).then(() => addUser())
                    .then (()=>{
                        console.log('Removing Holidays .......');
                        return Holidays.remove({});
                    })
                    .then( () => addHoliday())
                    .then ( () => {
                        holidayJson = require('./../seed/holidays.json');
                        done()})
                    .catch(e => console.log(e));
});

function randomDate() {
    var CurrentDate = new Date();
    var start = CurrentDate.setMonth(CurrentDate.getMonth() - 2);
    var end = CurrentDate.setMonth(CurrentDate.getMonth() + 2);
    var startHour = 8;
    var endHour = 20;
    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    date.setMinutes(0);
    date.setSeconds(0)
    return date;
}

function addDays(oriDate, days) {
    let date = new Date(oriDate);
    date.setDate(date.getDate() + days);
    return date;
}

var compareDate = (d1,d2) => new Date(d1).getTime() === new Date(d2).getTime() ;

var betweenDates = (startDate,endDate , start,end) => {
    let isStartInRnage = start.getTime() <= new Date(startDate).getTime() && new Date(startDate).getTime()  <= end.getTime();
    let isEndInRnage = start.getTime() <= new Date(endDate).getTime() && new Date(endDate).getTime()  <= end.getTime();
    let isBothoutRange = start.getTime() >= new Date(startDate).getTime() && new Date(endDate).getTime()  >= end.getTime();
    //console.log(startDate, ":",endDate ,":", start ,":", end ,":", isStartInRnage || isEndInRnage || isBothoutRange );
    return isStartInRnage || isEndInRnage || isBothoutRange ; 
}

describe('GET /api/v1/holiday/search/', () => {
    it('should get all holiday for a department  ', done => {
        let deprt = departments[Math.floor(Math.random() * 3)];
        supertest(app).get(`/api/v1/holiday/search/`).query({department:deprt})
                .expect(200)
                .expect( res => {
                        res.body.holidays.forEach( holiday => {
                            expect(holiday.department).toBe(deprt);
                        })
                    
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });
    it('should get all holiday for a staff from ID  ', done => {
        let staff_id = usersJson[3]._id;
        supertest(app).get(`/api/v1/holiday/search/`).query({staff_id:staff_id})
                .expect(200)
                .expect( res => {
                        res.body.holidays.forEach( holiday => {
                            expect(holiday.staff_id).toBe(staff_id);
                        })
                    
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });
    it('should get all holiday between start and end date  ', done => {
        let fromDate = randomDate();
        let toDate = addDays(fromDate, Math.floor(Math.random() * 10) + 1);
        let staff_id = usersJson[3]._id;
        supertest(app).get(`/api/v1/holiday/search/`).query({fromDate,toDate})
                .expect(200)
                .expect( res => {
                        res.body.holidays.forEach( holiday => {
                            expect(betweenDates(holiday.startDate,holiday.endDate, fromDate,toDate)).toBeTruthy();
                        })
                    
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });
    it('should throw error 400 when only start date provided', done => {
        supertest(app).get(`/api/v1/holiday/search/`).query({startDate:new Date()})
                .expect(400)
                .expect( res => {
                        expect(res.body.holidays).toNotExist();
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });
    it('should get all holiday for a staff from NAME  ', done => {
        let staffName = usersJson[3].name;
        supertest(app).get(`/api/v1/holiday/search/`).query({staffName})
                .expect(200)
                .expect( res => {
                        res.body.holidays.forEach( holiday => {
                            expect(holiday.staffName).toBe(staffName);
                        })
                    
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });
    it('should not find holiday for random department', done => {
        let dprt = 'random';
        supertest(app).get(`/api/v1/holiday/search/`).query({department:dprt})
                .expect(404)
                .expect( res => {
                        expect(res.body.holidays).toNotExist();
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });
    it('should not find holiday for random staff', done => {
        let staff_id = new mongoose.Types.ObjectId();
        supertest(app).get(`/api/v1/holiday/search/`).query({staff_id:staff_id.toHexString()})
                .expect(404)
                .expect( res => {
                        expect(res.body.holidays).toNotExist();
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });
});

describe('GET /api/v1/holiday/id/:id', () => {
    it('should correct Holiday by ID', done => {
        supertest(app).get(`/api/v1/holiday/id/${holidayJson[0]._id}`)
                .expect(200)
                .expect( res => {
                    expect(res.body.holiday).toExist();
                        expect(res.body.holiday._id).toBe(holidayJson[0]._id);
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });

    it('should not find any Holiday for random ID', (done) => {
        let id = new mongoose.Types.ObjectId();
        supertest(app).get(`/api/v1/holiday/id/${id.toHexString()}`)
                        .expect(404)
                        .expect( res => {
                            expect(res.body.holiday).toNotExist();
                        })
                        .end( (err, res) => {
                            if (err) return done(err);
                            done();
                        });
    });
    
});

describe('PATCH /api/v1/holiday/id/:id', () => {
    it('should update correct Holiday by ID', done => {
        let newDate = new Date();
        let holiday = holidayJson[1];
        holiday.startDate = newDate;
        holiday.endDate = newDate;
        holiday.holidayType = 'testType';
        holiday.status = 'DONE';
        holiday.actionBy = 'test';
        supertest(app).patch(`/api/v1/holiday/id/${holiday._id}`).send(holiday)
                                .expect(200)
                                .expect( res => {
                                        let newHoliday = res.body.holiday;
                                        expect(newHoliday._id).toBe(holiday._id);
                                        expect(newHoliday.status).toBe(holiday.status);
                                        expect(newHoliday.actionBy).toBe(holiday.actionBy);
                                        expect(newHoliday.holidayType).toBe(holiday.holidayType);
                                        expect( compareDate(newHoliday.startDate,holiday.startDate) ).toBeTruthy();
                                        expect( compareDate(newHoliday.endDate,holiday.endDate) ).toBeTruthy();
                                        expect( compareDate(newHoliday.actionDate,holiday.actionDate) ).toBeFalsy();
                                })
                                .end( (err, res) => {
                                    if (err) return done(err);
                                    // Make sure database is updated with correct value as well.
                                    Holidays.findById(holiday._id).then ( newHoliday => {
                                        expect(newHoliday.status).toBe(holiday.status);
                                        expect(newHoliday.actionBy).toBe(holiday.actionBy);
                                        expect(newHoliday.holidayType).toBe(holiday.holidayType);
                                        expect( compareDate(newHoliday.startDate,holiday.startDate) ).toBeTruthy();
                                        expect( compareDate(newHoliday.endDate,holiday.endDate) ).toBeTruthy();
                                        expect( compareDate(newHoliday.actionDate,holiday.actionDate) ).toBeFalsy();
                                        done();
                                    }).catch( e => done(e));
                                    
                                });
    });

    it('should not find any Holiday for random ID', (done) => {
        let id = new mongoose.Types.ObjectId();
        supertest(app).patch(`/api/v1/holiday/id/${id.toHexString()}`)
                        .expect(404)
                        .expect( res => {
                            expect(res.body.holiday).toNotExist();
                        })
                        .end( (err, res) => {
                            if (err) return done(err);
                            done();
                        });
    });
});

describe('POST /api/v1/holiday/', () => {
    it('should save holiday in db', (done)=> {
        let newDate = new Date();
        let staff = usersJson[0];
        let holiday = {
            staff_id:staff._id,
            startDate: newDate,
            endDate : newDate,
            holidayType : 'testType'
        };
        supertest(app).post(`/api/v1/holiday`).send(holiday)
                                .expect(200)
                                .expect( res => {
                                        let newHoliday = res.body.holiday;
                                        expect(newHoliday.staff_id).toBe(staff._id);
                                        expect(newHoliday.staffName).toBe(staff.name);
                                        expect(newHoliday.department).toBe(staff.department);
                                        expect(newHoliday.status).toBe('pending');
                                        expect(newHoliday.holidayType).toBe(holiday.holidayType);
                                        expect( compareDate(newHoliday.startDate,holiday.startDate) ).toBeTruthy();
                                        expect( compareDate(newHoliday.endDate,holiday.endDate) ).toBeTruthy();
                                        expect( newHoliday.requestedDate ).toExist();
                                })
                                .end( (err, res) => {
                                    if (err) return done(err);
                                    // Make sure database is updated with correct value as well.
                                    Holidays.findById(res.body.holiday._id).then ( newHoliday => {
                                        expect(newHoliday.staff_id).toEqual(staff._id);
                                        expect(newHoliday.staffName).toBe(staff.name);
                                        expect(newHoliday.department).toBe(staff.department);
                                        expect(newHoliday.status).toBe('pending');
                                        expect(newHoliday.holidayType).toBe(holiday.holidayType);
                                        expect( compareDate(newHoliday.startDate,holiday.startDate) ).toBeTruthy();
                                        expect( compareDate(newHoliday.endDate,holiday.endDate) ).toBeTruthy();
                                        expect( newHoliday.requestedDate ).toExist();
                                        done();
                                    }).catch( e => done(e));
                                    
                                });
    });
});

describe('DELETE /api/v1/holiday/:id', () => {
    it('should delete holiday from db', done => {
        supertest(app).delete(`/api/v1/holiday/${ holidayJson[10]._id }`)
                      .expect(200)
                      .expect( res => {
                          expect(res.body.holiday._id).toBe(holidayJson[10]._id)
                      })
                      .end( (err,res) => {
                          if(err)  return done(err);

                          Holidays.findById(holidayJson[10]._id).then( holiday => {
                              expect(holiday).toNotExist();
                              done();
                          }).catch( e => done(e))
                      });
    });
});
