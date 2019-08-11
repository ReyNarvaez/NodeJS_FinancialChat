const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const authenticate  = require('../middleware/auth');

router.get('/', function(req, res, next) {
  res.send('USERS HOME');
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.checkValidCredentials(req.body.email, req.body.password);
        const token = await user.newAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(401).send();
    }
});

router.post('/users/logout', authenticate, async (req, res) => {
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

router.post('/users/logoutall', authenticate, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users', async (req,res) => {
    const user = new User(req.body);
    try{
        const token = await user.newAuthToken();
        res.status(201).send({user, token});
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports = router;