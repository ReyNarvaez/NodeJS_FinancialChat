const express = require('express');
const router = express.Router();
const authenticate  = require('../middleware/auth');

/* GET home page. */
router.get('/', authenticate, function(req, res, next) {
  res.render('index', { title: 'Chat' });
});

router.get('/clearCookies', function(req, res){
   res.clearCookie('Authorization');
   res.clearCookie('error');
   res.clearCookie('authorization');
   res.send('cookie foo cleared');
});

module.exports = router;
