const express = require('express');
const router = express.Router();
const authenticate  = require('../middleware/auth');

/* GET home page. */
router.get('/', authenticate, function(req, res, next) {
  res.render('index', { title: 'Chat' });
});

module.exports = router;
