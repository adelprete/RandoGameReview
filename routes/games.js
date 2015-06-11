var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('games', { title: 'Express' });
});

/*
 * GET gameslist.
 */
router.get('/gameslist', function(req, res) {
    var db = req.db;
    db.collection('gameslist').find().sort({datecompleted:-1}).limit(200).toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to addgame.
 */
router.post('/addgame', function(req, res) {
    var db = req.db;
    req.body['datecompleted'] = new Date(req.body['datecompleted']);

    db.collection('gameslist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deletegame.
 */
router.delete('/deletegame/:id', function(req, res) {
    var db = req.db;
    var gameToDelete = req.params.id;

    db.collection('gameslist').removeById(gameToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
