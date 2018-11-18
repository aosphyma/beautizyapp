var express = require('express');
var createError = require('http-errors');
var router = express.Router();
// var connection = require('./../database/mysql')
var mysql = require('promise-mysql');

/* GET custom profile page. */

// to test if the given url contains mallicious content
var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

router.get('/:name/profile', function (req, res, next) {
  /** 
 * middleware usage of the database
 */

  if (format.test(req.params.name)) {
    next(createError(404));
  }

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var result = connection.query('SELECT * FROM beautizyapp.customer where beautizyapp.customer.username="superuser" and beautizyapp.customer.password = "hashedsuperpassword";');
    connection.end();
    return result;
  }).then(function (results) {
    console.log('result ', results[0]);
    res.render('profile', {
      active: 'profile',
      urls: req.baseUrl + '/' + req.params.name,
      rows: results
    });
  });
});

router.get('/:name/offers', function (req, res, next) {
  /** 
 * middleware usage of the database
 */


  if (format.test(req.params.name)) {
    next(createError(404));
  }

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var result = connection.query('SELECT * FROM beautizyapp.customer join (beautizyapp.offer, beautizyapp.gallery) ON (beautizyapp.offer.seller_id = beautizyapp.customer.id AND beautizyapp.offer.id = beautizyapp.gallery.offer_id) order by beautizyapp.offer.o_since desc limit 10;');
    connection.end();
    return result;
  }).then(function (results) {
    // console.log('this are the results', results);
    res.render('profile', {
      active: 'offers',
      urls: req.baseUrl + '/' + req.params.name,
      rows: results
    });
  });
});

router.get('/:name/orders', function (req, res, next) {
  /** 
 * middleware usage of the database
 */

  if (format.test(req.params.name)) {
    next(createError(404));
  }

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var result = connection.query('SELECT * FROM beautizyapp.customer join (beautizyapp.offer, beautizyapp.gallery) ON (beautizyapp.offer.seller_id = beautizyapp.customer.id AND beautizyapp.offer.id = beautizyapp.gallery.offer_id) order by beautizyapp.offer.o_since desc limit 10;');
    connection.end();
    return result;
  }).then(function (results) {
    res.render('profile', {
      active: 'orders',
      urls: req.baseUrl + '/' + req.params.name,
      rows: results
    });
  });
});

module.exports = router;
