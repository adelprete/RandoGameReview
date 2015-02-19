var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('games', { title: 'Rando Game Reviews' });
});

module.exports = router;
