var supertest = require('supertest');
var mongoose = require('mongoose');
var expect = require('expect');
var bcrypt = require('bcryptjs');

var {app} = require('./../server');
var { addUser, addHoliday} = require('./../seed/addData');
var { Users } = require('./../models/user');

var usersJson = require('./../seed/users.json');
var departments = ['IT', 'Legal', 'Marketing', 'Human Resources'];

before ( done => {
    console.log('Removing users data.......');
    Users.remove({}).then(() => {
            console.log('Adding fresh data');
            addUser();
            done();
        })
        .catch(e => console.log(e));
});

describe('GET /api/v1/staff/department/:department', () => {
    it('should get all staff from a department', (done) => {
        let x = Math.floor((Math.random() * 4));
        supertest(app).get(`/api/v1/staff/department/${departments[x]}`)
                        .expect(200)
                        .expect( res => {
                            let users = res.body.users;
                            expect(users).toExist();
                            users.forEach ( user => {
                                expect(user.department).toBe(departments[x]);
                            });
                        })
                        .end( (err, res) => {
                            if (err) return done(err);
                            done();
                        });
    });

    it('should not find any staff from a "random" department', (done) => {
        let x = Math.floor((Math.random() * 4));
        supertest(app).get(`/api/v1/staff/department/random`)
                        .expect(404)
                        .expect( res => {
                            let users = res.body.users;
                            expect(users).toNotExist();
                        })
                        .end( (err, res) => {
                            if (err) return done(err);
                            done();
                        });
    });
});

describe('GET /api/v1/staff/id/:id', () => {
    it('should correct user by ID', done => {
        supertest(app).get(`/api/v1/staff/id/${usersJson[0]._id}`)
                .expect(200)
                .expect( res => {
                    expect(res.body.user).toExist();
                        expect(res.body.user._id).toBe(usersJson[0]._id);
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    done();
                });
    });

    it('should not find any staff for random ID', (done) => {
        let id = new mongoose.Types.ObjectId();
        supertest(app).get(`/api/v1/staff/id/${id}`)
                        .expect(404)
                        .expect( res => {
                            expect(res.body.user).toNotExist();
                        })
                        .end( (err, res) => {
                            if (err) return done(err);
                            done();
                        });
    });
});

describe('PATCH /api/v1/staff/id/:id', () => {
    it('should update user with new details', done => {
        let updatedUser = {
            _id:usersJson[1]._id,
            isAdmin:true,
            department:'testDepartment'
        }
        supertest(app).patch(`/api/v1/staff/id/${updatedUser._id}`)
                .send(updatedUser)
                .expect(200)
                .expect( res => {
                    expect(res.body.user).toExist();
                        expect(res.body.user._id).toBe(updatedUser._id);
                        expect(res.body.user.department).toBe(updatedUser.department);
                        expect(res.body.user.isAdmin).toBeTruthy();
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    //Make sure user updated in database as well..
                    Users.findById(updatedUser._id).then( user => {
                        expect(user.department).toBe(updatedUser.department);
                        expect(user.isAdmin).toBeTruthy();
                        done();
                    });
                });
    });

    it('should not change user name and email', done => {
        let updatedUser = usersJson[2];
        updatedUser.name =  'test';
        updatedUser.email = 'test@email.com';
        supertest(app).patch(`/api/v1/staff/id/${updatedUser._id}`)
                .send(updatedUser)
                .expect(400)
                .expect( res => {
                    expect(res.body.user).toNotExist();
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    //Make sure user updated in database as well..
                    Users.findById(updatedUser._id).then( user => {
                        expect(user.name).toNotBe(updatedUser.name);
                        expect(user.email).toNotBe(updatedUser.email);
                        done();
                    });
                });
    });

    it('Should change password and saved hashed password to db', done => {
        let updatedUser = {
            _id:usersJson[1]._id,
            password:'testPassWord'
        }
        supertest(app).patch(`/api/v1/staff/id/${updatedUser._id}`)
                .send(updatedUser)
                .expect(200)
                .expect( res => {
                    expect(res.body.user).toExist();
                        expect(res.body.user._id).toBe(updatedUser._id);
                        expect(res.body.user.password).toNotBe(updatedUser.password);
                })
                .end( (err, res) => {
                    if (err) return done(err);
                    //Make sure user updated in database as well..
                    Users.findById(updatedUser._id).then( user => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(updatedUser.password);
                        bcrypt.compare(updatedUser.password, user.password, function(err, result) {
                            if(err)
                                return done(err);
                            expect(result).toBeTruthy();
                            done();
                        });
                    });
                });
    });

    it('should not update staff for random ID', (done) => {
        let id = new mongoose.Types.ObjectId();
        supertest(app).get(`/api/v1/staff/id/${id}`)
                        .expect(404)
                        .expect( res => {
                            expect(res.body.user).toNotExist();
                        })
                        .end( (err, res) => {
                            if (err) return done(err);
                            done();
                        });
    });
});

describe('POST /api/v1/staff/', () => {
    it('should store new user to DB', done => {
        let newUser = {
                "name": "test Watts",
                "email": "testWatts@emai.com",
                "password": "acb123",
                "isAdmin": false,
                "department": "IT"
        };
        supertest(app).post('/api/v1/staff').send(newUser)
                        .expect(200)
                        .expect( res => {
                            expect(res.body.user).toExist();
                            expect(res.body.user.name).toBe(newUser.name);
                            expect(res.body.user.email).toBe(newUser.email);
                            expect(res.body.user.password).toNotBe(newUser.password);
                            expect(res.body.user.department).toBe(newUser.department);
                            expect(res.body.user.isAdmin).toBeFalsy();
                        })
                        .end( (err,res) => {
                            if(err) return done(err);
                            Users.findById(res.body.user._id).then (user => {
                                    expect(user.name).toBe(newUser.name);
                                    expect(user.email).toBe(newUser.email);
                                    expect(user.password).toNotBe(newUser.password);
                                    expect(user.department).toBe(newUser.department);
                                    expect(user.isAdmin).toBeFalsy();
                                    bcrypt.compare(newUser.password, user.password, function(err, result) {
                                        if(err)
                                            return done(err);
                                        expect(result).toBeTruthy();
                                        done();
                                    });
                            })
                        })

    });
});

describe('DELETE /api/v1/staff/:id', () => {
    it('should DELETE user by ID', done => {
        supertest(app).delete(`/api/v1/staff/${usersJson[3]._id}`)
                .expect(200)
                .expect( res => {
                    expect(res.body.user).toExist();
                    expect(res.body.user._id).toBe(usersJson[3]._id);
                })
                .end( (err, res) => {
                    if (err) return done(err);

                    Users.findById(usersJson[3]._id).then ( user => {
                        expect(user).toNotExist();
                        done();
                    });
                });
    });

    it('should not find any USER for random ID', (done) => {
        let id = new mongoose.Types.ObjectId();
        supertest(app).delete(`/api/v1/staff/${id}`)
                        .expect(404)
                        .expect( res => {
                            expect(res.body.user).toNotExist();
                        })
                        .end( (err, res) => {
                            if (err) return done(err);
                            done();
                        });
    });    

});