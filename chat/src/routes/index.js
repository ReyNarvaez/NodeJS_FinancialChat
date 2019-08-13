const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Chat = require('../models/chat');

/* GET home page. */
router.get('/', authenticate, async function(req, res, next) {
  const chats = await Chat.findOne({}).lean();
  res.redirect('/chats/chat/' + chats._id);
});

module.exports = router;
