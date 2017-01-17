const mongoose = require('mongoose');
const validator = require('validator');

let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message: '{VALUE} is not a valid Email !'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:[6,'Min 6 charector is required for password']
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    department:{
        type:String
    },
    job_role:{
        type:String,
    },
    tokens:[{
        access:{
            type:String,
            default:'auth'
        },
        token:{
            type:String
        }
    }]
});

let User = mongoose.model('User', userSchema);

module.exports = {User};
