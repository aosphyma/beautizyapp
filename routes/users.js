var express = require('express');
var createError = require('http-errors');
var mysql = require('promise-mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/:type', function (req, res, next) {
  if (req.params.type == 'login') {
    console.log('login initiated');

    console.log('login ended');
  }
  if (req.params.type == 'signup') {
    console.log('signup initiated');
    var email = JSON.stringify(req.body.email);
    var password = JSON.stringify(req.body.pass1);
    var username = password.slice(1, password.indexOf('@'));
    if ((/[@]/).test(email) && req.body.pass1 == req.body.pass2) {
      mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'beautizyapp'
      }).then(function (connection) {
        var result = connection.query("INSERT INTO `beautizyapp`.`customer` (`username`, `email`, `password`) VALUES ('"+username+"', '"+email+"', '"+password+"');");
        connection.end();
        return result;
      }).then(function (results) {
        console.log('result ', results);
        res.redirect('/profiles/'+username+'/profile');
      });
    }
    console.log('signup ended');
  }
  else {
    next(createError(400));
  }
});
module.exports = router;
