const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const authenticate  = require('../middleware/auth');
const cookieHelper = require('../helpers/cookieHelper');

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    try {

        const user = await User.checkValidCredentials(req.body.email, req.body.password);
        const token = await user.newAuthToken();
        res.cookie('session', {'_id' : user._id, 'token': token, 'error' : null});
        //res.send({ user, token });
        res.redirect("/");
    } catch (error) {

    		var cookie = cookieHelper.getCookies(req, res);
    		cookie.error = 'Incorrect username or password';
    		res.cookie('session', cookie);
    		res.redirect('login');
    }
});

router.get('/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) =>{
       		return token.token !== req.token;
        });
        await req.user.save();
        res.redirect('login');
    } catch (error) {
        res.status(500).send();
    }
});
/*
router.get('/logoutall', async (req, res) => {
    try {
        console.log("in logoutall" + req.user);
        req.user.tokens = [];
        console.log("current user: " + req.user);
        await req.user.save();
    		res.clearCookie('authorization');
        res.redirect('login');
    } catch (error) {
        res.status(500).send();
    }
});
*/

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', form: {} });
});

router.post('/register', async (req,res) => {
    try{

        const user = new User(req.body);
        const token = await user.newAuthToken();

        res.cookie('session', {'_id' : user._id, 'token': token, 'error' : null});
        res.redirect('login');
    }catch(e){
        
        var cookie = cookieHelper.getCookies(req, res);
        cookie.error = 'There was an error creating your user, please try again';
        res.cookie('session', cookie);
        res.redirect('register');
}
});

router.get('/all', async (req,res)=> {
	var users = await User.getAll();
  res.send(users);
})
/*
router.get('/me', authenticate ,async (req,res)=> {
   res.send(req.user)
})
*/

module.exports = router;