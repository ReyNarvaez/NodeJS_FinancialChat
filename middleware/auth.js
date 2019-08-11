const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cookieHelper = require('../helpers/cookieHelper');

const auth = async (req,res,next) => {
    
    const cookie = cookieHelper.getCookies(req,res);

    try {
        const token = cookie.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id:decoded._id, 'tokens.token': token});
        
        if(!user){
            throw new Error("No user found");
        }

        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.redirect('/users/login');
    }
}

module.exports = auth;