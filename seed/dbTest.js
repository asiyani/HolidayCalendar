const {mongoose} = require('./../config/mongoose');
const {Users} = require('./../models/user');
const {Holidays} = require('./../models/holiday');

let userID = new mongoose.Types.ObjectId();

let user = new Users({
  _id:userID,
  name:'Ashok Siyani',
  email:'ashok1@email.com',
  password:'123456'
});
user.save().then( (user) => {
                        console.log('user Saved',user);
                          user.generateAuthToken();})
           .catch( e => console.log('user Save error', e));

Users.findByCredential('ashok1@email.com','123456').then( user => {
                                    console.log('findBycredential',user)
                                    user.generateAuthToken() 
                                    })
                                    .catch( e => console.log(e));


// user.removeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODg0YzY5YTY0OGU0MzliNjAzOTI2MzQiLCJpc0FkbWluIjpmYWxzZSwiYWNjZXNzIjoiYXV0aCIsImlhdCI6MTQ4NTA5NjYwMn0.OnTJbFUMXrps_lojeG4DNDozZAm5wQpLyDsZ_QQF31Q')
//           .then( (data) => console.log("token removed",data));

let holiday = new Holidays({
    staff_id:userID,
    staffName:user.name,
    department:'sales',
    startDate:new Date(),
    endDate:new Date(),
    requestedDate:new Date()
});

holiday.save().then( holiday => console.log('Holidays saved',holiday))
              .catch( e => console.log(e))


