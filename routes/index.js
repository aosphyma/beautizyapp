var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    app_title: 'Beautizy',
    title: 'Beautizy',
    info: 'Please beware that you can use the search bar to search for anyone to make you a hairstylte',
  });
});

router.post('/', function(req, res, next){
  console.log('that post was= ', req.body.place);
  console.log('that post was= ', req.body.hairstyle);
  res.render('index', { 
    app_title: 'Beautizy',
    title: 'Beautizy',
    info: 'Search for a hairstyle at any place',
    place: req.body.place,
    hairstyle: req.body.hairstyle
  });
});
module.exports = router;
