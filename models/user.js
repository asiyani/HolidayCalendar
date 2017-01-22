const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        minlength:[6,'Min 6 character is required for password']
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

userSchema.methods.generateAuthToken = function(){
    var user = this;
    var token = jwt.sign({ _id:user._id.toHexString(), isAdmin:user.isAdmin, access:'auth'}, 'abc123').toString();
    user.tokens.push({access:'auth',token:token});
    return user.save().then( () => {
        return token;
    }).catch( e => console.log(e));
};

userSchema.statics.findByToken = function(token){
    var User = this;
    var decode;
    try {
        decode = jwt.verify(token, 'abc123');
    }catch(e){
       return Promise.reject();
    }

    return User.findOne({
        '_id':decode._id,
        'tokens.token':token,
        'tokens.access':'auth'
    }); 
};

userSchema.methods.removeToken = function(token) {
    var user = this;
    return user.update({$pull:{'tokens':{token}}})
}

userSchema.statics.findByCredential = function(email,password ){
    var User = this;
    
    return new Promise ( (resolve, reject) => {
        User.findOne({email:email}).then( (user) => {
        if(!user){
            return reject('No user found')
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if(err)
                return reject('Error occurred ')
            if(user){
                resolve(user);
            }else{
                reject('Password doesn\'t match');
            }
        });
        }).catch( e => reject(e));
    });
    
}

userSchema.pre('save', function(next){
    let user = this;
    if( user.isModified('password')){
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});





let User = mongoose.model('User', userSchema);

module.exports = {User};
