var express = require('express');
var createError = require('http-errors');
var router = express.Router();
// var connection = require('./../database/mysql')
var mysql = require('promise-mysql');

/* GET custom profile page. */

// to test if the given url contains mallicious content
var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

router.get('/:name/profile', function (req, res, next) {
  if (format.test(req.params.name)) {
    next(createError(404));
  }
  if (req.cookies === {} || req.cookies === undefined) {
    next(createError(404));
  }

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var result = connection.query('SELECT * FROM beautizyapp.customer where beautizyapp.customer.username="' + req.params.name + '";');
    connection.end();
    return result;
  }).then(function (results) {
    res.render('profile', {
      app_title: 'Beautizy - Profile',
      active: 'profile',
      urls: req.baseUrl + '/' + req.params.name,
      cookies: req.cookies,
      rows: results
    });
  });
});

router.get('/:name/offers', function (req, res, next) {
  if (format.test(req.params.name)) {
    next(createError(404));
  }

  if (req.cookies === {} || req.cookies === undefined) {
    next(createError(404));
  }

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var result = connection.query("SELECT * FROM beautizyapp.customer join (beautizyapp.offer, beautizyapp.gallery) "
      + "ON (beautizyapp.offer.seller_id = beautizyapp.customer.id AND beautizyapp.offer.id = beautizyapp.gallery.offer_id) where beautizyapp.customer.id ="
      + req.cookies.userid + " order by beautizyapp.offer.o_since desc;");
    connection.end();
    return result;
  }).then(function (results) {
    res.render('profile', {
      app_title: 'Beautizy - Profile',
      active: 'offers',
      urls: req.baseUrl + '/' + req.params.name,
      cookies: req.cookies,
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
    var result = connection.query("SELECT * FROM beautizyapp.customer join (beautizyapp.offer, beautizyapp.gallery) " +
      "ON (beautizyapp.offer.seller_id = beautizyapp.customer.id AND beautizyapp.offer.id = beautizyapp.gallery.offer_id) where beautizyapp.customer.id = " + req.cookies.userid
      + " order by beautizyapp.offer.o_since desc;");
    connection.end();
    return result;
  }).then(function (results) {
    res.render('profile', {
      app_title: 'Beautizy - Profile',
      active: 'orders',
      urls: req.baseUrl + '/' + req.params.name,
      cookies: req.cookies,
      rows: results
    });
  });
});

module.exports = router;
