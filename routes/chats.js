const express = require('express');
const router = new express.Router();
const Chat = require('../models/chat');
const Message = require('../models/message');
const {ObjectID} = require('mongodb');
const authenticate = require('../middleware/auth');

router.get('/chat/:id', authenticate, function(req, res, next) {
  res.render('chat', { chatId: req.params.id, userId: req.user._id});
});

router.post('/chat', async (req,res) => {
    try{
        console.log(req.body);
        const chat = new Chat(req.body);
        await chat.save()
        res.status(201).send(chat)
    }catch(error){
        res.status(400).send(error)
    }
});

router.get('/chats', /*authenticate,*/ async (req,res) => {
    try {
        const chats = await Chat.find({})
        res.send(chats)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/:id',/*authenticate,*/ async (req,res) => {
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

    console.log(_id);
    console.log(userid);
    console.log(req.body.text);

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
    io.emit('newMessage', {userId: userid, text: req.body.text});

    try {
        await message.save()
        res.status(201).send(message)
    } catch (error) {
        res.status(400).send(error)
    }

})

//get all the messages related to the chat
router.get('/:id/message', async (req,res) => {
    try {
        const chat = await Chat.findOne({_id: req.params.id})
        await chat.populate('messages').execPopulate()
        res.send(chat.messages)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/:id',authenticate, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "title"]
    const isValidOperation  = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(400).send({error:'Invalid updates'})
    }
    if (!ObjectID.isValid(_id)) {
        res.status(404).send();
    }
    try {
        const chat = await Chat.findOne({_id: req.params.id, author:req.user._id})
        
       if(!chat){
        res.status(404).send();
       }

       updates.forEach((update) => chat[update] = req.body[update])
       await chat.save()

       res.send(chat);
    } catch (error) {
        res.status(400).send();
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