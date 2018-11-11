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
module.exports = router;
