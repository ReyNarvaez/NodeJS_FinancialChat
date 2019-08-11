const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const authenticate  = require('../middleware/auth');

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

    		req.cookies.session.error = 'Incorrect username or password';
    		res.cookie('session', req.cookies.session);
    		res.redirect('login');
        //res.status(401).send();
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
    
    const user = new User(req.body);
    try{
        const token = await user.newAuthToken();
        res.redirect('login');
    }catch(e){
        res.status(400).send(e);
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