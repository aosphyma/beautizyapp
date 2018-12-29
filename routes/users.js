var express = require('express');
var createError = require('http-errors');
var mysql = require('promise-mysql');
var path = require('path');
var crypto = require('crypto');


var router = express.Router();

var a = 'aes-256-ctr';
var p = 'd6F3Efeq';

function encrypt(plaintext) {
  var cipher = crypto.createCipher(a, p)
  var crypted = cipher.update(plaintext, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;

}

function decrypt(ciphertext) {
  var decipher = crypto.createDecipher(a, p)
  var decripted = decipher.update(ciphertext, 'hex', 'utf8')
  decripted += decipher.final('utf8');
  return decripted;
}

function gethashValue(str) {
  return crypto.createHash('SHA1').update(crypto.createHash('SHA512').update(' ' + str + ' ').digest('hex')).digest('hex');
}

router.get('/logout', function (req, res, next) {
  if (req.cookies === {} || req.cookies === undefined) {
    next(createError(400));
  }
  res.clearCookie('userid');
  res.clearCookie('username');
  res.redirect('/');
});

router.post('/update/:id', function (req, res, next) {
  var pp = undefined;
  if (req.files) {
    (async () => {
      pp = '/images/pps/' + req.params.id + '' + req.files.picture.name;
      await req.files.picture.mv(path.join(__dirname, '../public', pp), function (err) {
        if (err) {
          next(createError(500));
        }
      });
      console.log('pp: ', pp);
    })();
  }

  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: gethashValue(gethashValue('database') + 'beautizyapp')
  }).then(function (connection) {
    var query = "";
    if (req.body.username && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'username') + "`='" + encrypt(req.body.username) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.email && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'email') + "`='" + encrypt(req.body.email) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.f_name && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'f_name') + "`='" + encrypt(req.body.f_name) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.l_name && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'l_name') + "`='" + encrypt(req.body.l_name) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.funeffect && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'c_description') + "`='" + encrypt(req.body.funeffect) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.street && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'c_street') + "`='" + encrypt(req.body.street) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.zip && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'c_zip') + "`='" + encrypt(req.body.zip) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.city && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'c_town') + "`='" + encrypt(req.body.city) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.country && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'c_country') + "`='" + encrypt(req.body.country) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (pp && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'ppath') + "`='" + encrypt(pp) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    }
    if (req.body.birthday && query === "") {
      query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET `"
        + gethashValue(gethashValue('column') + 'birthday') + "`='" + encrypt(req.body.birthday) + "' WHERE `"
        + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
      console.log('query: ', query);
    }



    if (query != "") {
      connection.query(query);
    }

    query = "SELECT `" + gethashValue(gethashValue('column') + 'username')
      + "` FROM `" + gethashValue(gethashValue('table') + 'customer') + "` where `"
      + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    var result = connection.query(query)
      .then(function (result) {
        connection.end();
        console.log(result);
        res.redirect('/profiles/' + decrypt(Object.values(result[0])[0]) + '/profile');
      });
  });
});


router.post('/updateall/:id', function (req, res, next) {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: gethashValue(gethashValue('database') + 'beautizyapp')
  }).then(function (connection) {
    const username = req.body.username;
    const email = req.body.email;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const birthday = req.body.birthday;
    const funeffect = req.body.funeffect;
    const street = req.body.street;
    const zip = req.body.zip;
    const city = req.body.city;
    const country = req.body.country;
    var ppath = undefined;
    if (req.files) {
      (async () => {
        pp = '/images/pps/' + req.params.id + '' + req.files.picture.name;
        await req.files.picture.mv(path.join(__dirname, '../public', pp), function (err) {
          if (err) {
            next(createError(500));
          }
        });
      })();
    }
    var query = "UPDATE `" + gethashValue(gethashValue('table') + 'customer') + "` SET ";
    if (username) {
      query += "`" + gethashValue(gethashValue('column') + 'username')
        + "`='" + encrypt(req.body.username) + "' ";
    }
    if (email) {
      query += ", `" + gethashValue(gethashValue('column') + 'email')
        + "`='" + encrypt(req.body.email) + "' ";
    }
    if (f_name) {
      query += ", `" + gethashValue(gethashValue('column') + 'f_name')
        + "`='" + encrypt(req.body.f_name) + "' ";
    }
    if (l_name) {
      query += ", `" + gethashValue(gethashValue('column') + 'l_name')
        + "`='" + encrypt(req.body.l_name) + "' ";
    }
    if (funeffect) {
      query += ", `" + gethashValue(gethashValue('column') + 'c_description')
        + "`='" + encrypt(req.body.funeffect) + "' ";
    }
    if (street) {
      query += ", `" + gethashValue(gethashValue('column') + 'c_street')
        + "`='" + encrypt(req.body.street) + "' ";
    }
    if (zip) {
      query += ", `" + gethashValue(gethashValue('column') + 'c_zip')
        + "`='" + encrypt(req.body.zip) + "' ";
    }
    if (city) {
      query += ", `" + gethashValue(gethashValue('column') + 'c_town')
        + "`='" + encrypt(req.body.city) + "' ";
    }
    if (country) {
      query += ", `" + gethashValue(gethashValue('column') + 'c_country')
        + "`='" + encrypt(req.body.country) + "' ";
    }
    if (birthday) {
      query += ", `" + gethashValue(gethashValue('column') + 'birthday')
        + "`='" + encrypt(req.body.birthday) + "' ";
    }
    if (ppath) {
      query += ", `" + gethashValue(gethashValue('column') + 'ppath')
        + "`='" + encrypt(pp) + "' ";
    }


    query += "WHERE `" + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    if (query != "") {
      connection.query(query);
    }

    query = "SELECT `" + gethashValue(gethashValue('column') + 'username') 
    + "` FROM `" + gethashValue(gethashValue('table') + 'customer') + "` where `" 
    + gethashValue(gethashValue('column') + 'id') + "`='" + (req.params.id) + "';";
    var result = connection.query(query)
    .then(function(res){
      connection.end();
      res.redirect('/profiles/' + decrypt(Object.values(res[0])[0]) + '/profile');
    });
  });
});


router.post('/signup', function (req, res, next) {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: gethashValue(gethashValue('database') + 'beautizyapp')
  }).then(function (connection) {
    var email = req.body.email;
    var password = req.body.pass1;
    var username = email.slice(0, email.indexOf('@'));
    if (!(/[@]/).test(email) || req.body.pass1 != req.body.pass2) {
      next(createError(500));
    }
    connection.query("INSERT INTO `" + gethashValue(gethashValue('table') + 'customer') + "` (`" + gethashValue(gethashValue('column') + 'username') + "`, `" + gethashValue(gethashValue('column') + 'email') + "`, `" + gethashValue(gethashValue('column') + 'password') + "`) VALUES ('" + encrypt(username) + "', '" + encrypt(email) + "', '" + gethashValue(gethashValue('Password') + '' + gethashValue(password)) + "');")
      .then(function (data) {
        console.log(username);
        console.log(encrypt(username));
        connection.query("SELECT * FROM `" + gethashValue(gethashValue('table') + 'customer') + "` where `" + gethashValue(gethashValue('column') + 'id') + "`='" + data.insertId + "';")
          .then(function (results) {
            connection.end();
            var userid = gethashValue(gethashValue('column') + 'id');
            var username = gethashValue(gethashValue('column') + 'username');
            Object.keys(results[0]).forEach(function (key, index, arr) {
              if (key == userid) {
                res.cookie('userid', Object.values(results[0])[index]);
              }
              if (key == username) {
                res.cookie('username', decrypt(Object.values(results[0])[index]));
                res.redirect('/profiles/' + decrypt(Object.values(results[0])[index]) + '/profile');
              }
            });
            res.redirect('/');
          });
      });
  });
});


router.post('/login', function (req, res, next) {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
  }).then(function (connection) {
    var user = req.body.user;
    var pass = req.body.pass;
    var query = "";
    if (!(/[@]/).test(user)) {
      query = "SELECT * FROM `" + gethashValue(gethashValue('database') + 'beautizyapp') + "`.`" + gethashValue(gethashValue('table') + 'customer')
        + "` where `" + gethashValue(gethashValue('column') + 'username') + "`='" + encrypt(user)
        + "' and `" + gethashValue(gethashValue('column') + 'password') + "`='" + gethashValue(gethashValue('Password') + '' + gethashValue(pass)) + "';";

    } else {
      query = "SELECT * FROM `" + gethashValue(gethashValue('database') + 'beautizyapp') + "`.`" + gethashValue(gethashValue('table') + 'customer')
        + "` where `" + gethashValue(gethashValue('column') + 'email') + "`='" + encrypt(user)
        + "' and `" + gethashValue(gethashValue('column') + 'password') + "`='" + gethashValue(gethashValue('Password') + '' + gethashValue(pass)) + "';";
    }
    connection.query(query)
      .then(function (results) {
        if (results.length == 0) {
          next(createError(401, '<div class="container red-text">Login failed.<br> Wrong Username and/or Password.<br> Please try aigain with correct credentials.</div>'));
        }
        connection.end();
        var userid = gethashValue(gethashValue('column') + 'id');
        var username = gethashValue(gethashValue('column') + 'username');
        Object.keys(results[0]).forEach(function (key, index, arr) {
          if (key == userid) {
            res.cookie('userid', Object.values(results[0])[index]);
          }
          if (key == username) {
            res.cookie('username', decrypt(Object.values(results[0])[index]));
            res.redirect('/profiles/' + decrypt(Object.values(results[0])[index]) + '/profile');
          }
        });
      });
  });
});
module.exports = router;