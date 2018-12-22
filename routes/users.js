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
    database: 'beautizyapp'
  }).then(function (connection) {
    var query = "";
    if (req.body.username && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `username`='" + (req.body.username) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.email && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `email`='" + (req.body.email) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.f_name && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `f_name`='" + (req.body.f_name) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.l_name && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `l_name`='" + (req.body.l_name) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.funeffect && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `c_description`='" + (req.body.funeffect) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.street && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `c_street`='" + (req.body.street) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.zip && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `c_zip`='" + (req.body.zip) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.city && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `c_town`='" + (req.body.city) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.country && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `c_country`='" + (req.body.country) + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (pp && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `ppath`='" + pp + "' WHERE `id`='" + (req.params.id) + "';";
    }
    if (req.body.birthday && query === "") {
      query = "UPDATE `beautizyapp`.`customer` SET `birthday`='" + (req.body.birthday) + "' WHERE `id`='" + (req.params.id) + "';";
      console.log('query: ', query);
    }



    if (query != "") {
      connection.query(query);
    }

    query = "SELECT username FROM beautizyapp.customer where id='" + (req.params.id) + "';";
    var result = connection.query(query);
    connection.end();
    return result;
  }).then(function (results) {
    res.redirect('/profiles/' + results[0].username + '/profile');
  });
});





router.post('/updateall/:id', function (req, res, next) {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
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
    var query = "UPDATE `beautizyapp`.`customer` SET ";
    if (username) {
      query += "`username`='" + (req.body.username) + "' ";
    }
    if (email) {
      query += ", `email`='" + (req.body.email) + "' ";
    }
    if (f_name) {
      query += ", `f_name`='" + (req.body.f_name) + "' ";
    }
    if (l_name) {
      query += ", `l_name`='" + (req.body.l_name) + "' ";
    }
    if (funeffect) {
      query += ", `c_description`='" + (req.body.funeffect) + "' ";
    }
    if (street) {
      query += ", `c_street`='" + (req.body.street) + "' ";
    }
    if (zip) {
      query += ", `c_zip`='" + (req.body.zip) + "' ";
    }
    if (city) {
      query += ", `c_town`='" + (req.body.city) + "' ";
    }
    if (country) {
      query += ", `c_country`='" + (req.body.country) + "' ";
    }
    if (birthday) {
      query += ", `birthday`='" + (req.body.birthday) + "' ";
    }
    if (ppath) {
      query += ", `ppath`='" + (req.body.ppath) + "' ";
    }


    query += "WHERE `id`='" + (req.params.id) + "';";
    if (query != "") {
      connection.query(query);
    }

    query = "SELECT username FROM beautizyapp.customer where id='" + (req.params.id) + "';";
    var result = connection.query(query);
    connection.end();
    return result;
  }).then(function (results) {
    res.redirect('/profiles/' + results[0].username + '/profile');
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
    var username = password.slice(0, email.indexOf('@'));
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