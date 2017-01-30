const { mongoose } = require('./../config/mongoose');
const { Users } = require('./../models/user');
const { Holidays } = require('./../models/holiday');


const users = require('./users.json');
const holidayType = ["pending", "approved", "declined"];
const holidayStatus = ["Hourly", "Full Day", "Half Day"]

const addUser = () => {
    users.forEach( user => {
        let newUser = new Users(user)
        newUser.save()
    });
    console.log('All users added.......');
};

function randomDate() {
    var CurrentDate = new Date();
    var start = CurrentDate.setMonth(CurrentDate.getMonth() - 3);
    var end = CurrentDate.setMonth(CurrentDate.getMonth() + 3);
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

function addHours(oriDate, hours) {
    let date = new Date(oriDate);
    date.setHours(date.getHours() + hours);
    return date;
}

const addHoliday = () => {
    users.forEach((user) => {
    var userHolidays = [];
    for (let i = 0; i < 5; i++) {
        let startDate = randomDate();
        let holidayType = holidayStatus[Math.floor(Math.random() * 2)];
        let endDate;
        if (holidayType === "Full Day") {
            endDate = addDays(startDate, Math.floor(Math.random() * 10) + 1);
        } else {
            endDate = addHours(startDate, Math.floor(Math.random() * 10) + 1);
        }
        var holiday = {
            staff_id: user._id,
            staffName: user.name,
            department: user.department,
            startDate: startDate,
            endDate: endDate,
            holidayType: holidayType,
            status: holidayStatus[Math.floor(Math.random() * 2)],
            requestedDate: addDays(startDate, -(Math.floor(Math.random() * 10) + 1)),
        }
        userHolidays.push(holiday);
   }

   Holidays.insertMany(userHolidays);

   console.log("All holidays are added:"+ user.name)

    });
}

module.exports = {addUser,addHoliday};

