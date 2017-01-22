const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');



let holidaySchema = new mongoose.Schema({
    staff_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    staffName:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    holidayType:{
        type:String
    },
    status:{
        type:String,
        default:'pending'
    },
    requestedDate:{
        type:Date,
        required:true,
    },
    actionDate:{
        type:Date
    },
    actionBy:{
        type:String
    }

});

let Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = {Holiday};