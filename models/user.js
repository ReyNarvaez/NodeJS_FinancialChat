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

const User = mongoose.model('User', UserSchema);

module.exports = User;