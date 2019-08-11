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
        res.send({ user, token });
        //res.redirect("/");
    } catch (error) {
    		
    		res.redirect('login?error=true');
        //res.status(401).send();
    }
});

router.post('/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) =>{
       		return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/logoutall', authenticate, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', form: {} });
});

router.post('/register', async (req,res) => {
    
    //res.send(req.body);
    const user = new User(req.body);
    try{
        const token = await user.newAuthToken();
        res.status(201).send({user, token});
    }catch(e){
        res.status(400).send(e);
    }
});

router.get('/all', async (req,res)=> {
	var users = await User.getAll();
  res.send(users);
})

router.get('/me', authenticate ,async (req,res)=> {
   res.send(req.user)
})

module.exports = router;