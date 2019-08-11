const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema  = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 7,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Please enter your password!')
            }else if(validator.equals(value.toLowerCase(),"password")){
                throw new Error('Password is invalid!')
            }else if(validator.contains(value.toLowerCase(), "password")){
                throw new Error('Password should not contain password!')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

UserSchema.statics.checkValidCredentials = async (email, password) => {
    const user = await User.findOne({'email': email});
    let errorMessage = 'Please check your username and password. If you still can\'t log in, contact your Financial Chat administrator.';

    if(!user){
        throw new Error(errorMessage);
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        throw new Error(errorMessage);
    }

    return user;
}

UserSchema.methods.newAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

UserSchema.statics.getAll = async () => {
    const users = await User.find();

    if(!users){
        throw new Error(errorMessage);
    }

    return users;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
