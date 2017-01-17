const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');



let holidaySchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
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
    actionedDate:{
        type:Date
    },
    actionedBy:{
        type:String
    }

});

let Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = {Holiday};