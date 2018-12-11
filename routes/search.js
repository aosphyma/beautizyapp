var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next){
  console.log('that post was= ', req.get('place'));
  console.log('that post was= ', req.get('hairstyle'));
  res.render('search', { 
    app_title: 'Beautizy',
    title: 'Beautizy',
    info: 'Search for a hairstyle at any place',
    place: req.body.place,
    cookies: req.cookies,
    hairstyle: req.body.hairstyle
  });
});
module.exports = router;
