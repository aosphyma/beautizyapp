var express = require('express');
var createError = require('http-errors');
var mysql = require('promise-mysql');
var path = require('path');
var router = express.Router();

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
    database: 'beautizyapp'
  }).then(function (connection) {
    var email = req.body.email;
    // todo secure the pass with SHA236
    var password = req.body.pass1;
    var username = password.slice(1, password.indexOf('@'));
    if (!(/[@]/).test(email) || req.body.pass1 != req.body.pass2) {
      next(createError(500));
    }
    var result = connection.
      query("INSERT INTO `beautizyapp`.`customer` (`username`, `email`, `password`) VALUES ('" + username + "', '" + email + "', '" + password + "');")
      .then(function (data) {
        var userdata = connection.query("SELECT username FROM beautizyapp.customer where id='" + data.insertId + "';");
        connection.end();
        return userdata;
      });
    return result;
  }).then(function (results) {
    // cookies
    res.cookie('userid', results.id);
    res.cookie('username', results.username);

    res.redirect('/profiles/' + results[0].username + '/profile');
  });
});


router.post('/login', function (req, res, next) {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var result = undefined;
    var user = req.body.user;
    var pass = req.body.pass;
    if (!(/[@]/).test(user)) {
      result = connection.query("SELECT * FROM beautizyapp.customer where username='" + user + "' and password='" + pass + "';");
    } else {
      result = connection.query("SELECT * FROM beautizyapp.customer where email='" + user + "' and password='" + pass + "';");
    }
    connection.end();
    return result;
  }).then(function (results) {
    if (results === []) {
      res.redirect('/');
    }
    //cookies
    res.cookie('userid', results[0].id);
    res.cookie('username', results[0].username);

    res.redirect('/profiles/' + results[0].username + '/profile');
  });
});
module.exports = router;