const express = require('express');
const router = new express.Router();
const Chat = require('../models/chat');
const Message = require('../models/message');
const {ObjectID} = require('mongodb');
const authenticate = require('../middleware/auth');

router.get('/chat/:id', authenticate, async function(req, res, next) {

    const chats = await Chat.find({}).lean();
    const messages = await Message.find({'chatId' : req.params.id}).sort('-date').limit(50).lean();

    res.render('chat', 
        { 
            chatId: req.params.id, 
            userId: req.user._id, 
            chats: escape(JSON.stringify(chats)), 
            messages: escape(JSON.stringify(messages))
        }
    );
});

router.post('/chat', async (req,res) => {
    try{
        const chat = new Chat(req.body);
        await chat.save()
        res.status(201).send(chat)
    }catch(error){
        res.status(400).send(error)
    }
});

router.get('/chats', authenticate, async (req,res) => {
    try {
        const chats = await Chat.find({})
        res.send(chats)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/:id', authenticate, async (req,res) => {
    const _id =  req.params.id
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }
    try {
        const chat = await Chat.findOne({ _id : _id })
        if(!chat){
            return res.status(404).send()
        }
        res.send(chat);
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/:id/message', authenticate, async (req,res) => {   
    const _id = req.params.id
    const userid = req.user._id

    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }

    if (!ObjectID.isValid(userid)) {
        return res.status(404).send();
    }

    const message = new Message({
        ...req.body,
        author: userid,
        chatId: _id
    })
    

    var io = req.app.get('socketio');
    io.emit('newMessage', {author: userid, text: req.body.text});

    try {
        await message.save()
        res.status(201).send(message)
    } catch (error) {
        res.status(400).send(error)
    }

})


router.delete('/:id', authenticate,async (req,res) => {
    const _id = req.params.id
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }
    try {
        const deletechat = await Chat.findOneAndDelete({_id:_id, author: req.user._id})
        if (!deletechat) {
            return res.status(404).send();
        }
        res.send(deletechat)
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router