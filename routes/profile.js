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

  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var result = connection.query('SELECT * FROM beautizyapp.customer where beautizyapp.customer.username="' + req.params.name + '";');
    connection.end();
    return result;
  }).then(function (results) {
    if (req.cookies.ppath === undefined) {
      res.cookie('ppath', results[0].ppath);
    }
    res.render('profile', {
      app_title: 'Beautizy - Profile',
      active: 'profile',
      urls: req.baseUrl + '/' + req.params.name,
      cookies: req.cookies,
      customer: results[0]
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

  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var data = {};
    connection.query("SELECT * FROM beautizyapp.customer WHERE beautizyapp.customer.id=" + req.cookies.userid + ";")
      .then(function (customer) {
        data.customer = customer;
        connection.query("SELECT * FROM beautizyapp.offer WHERE beautizyapp.offer.seller_id =" + req.cookies.userid + ";")
          .then(function (offers) {
            data.offers = offers;
            //todo for each offer gather pictures and so on...
            // connection.query("SELECT * FROM beautizyapp.gallery WHERE offer_id="++";");
            connection.end();
            res.render('profile', {
              app_title: 'Beautizy - Profile',
              active: 'offers',
              urls: req.baseUrl + '/' + req.params.name,
              cookies: req.cookies,
              customer: data.customer[0],
              offers: data.offers
            });
          });
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

  if (req.cookies === {} || req.cookies === undefined) {
    next(createError(404));
  }

  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'beautizyapp'
  }).then(function (connection) {
    var data = {};
    connection.query("SELECT * FROM beautizyapp.customer WHERE beautizyapp.customer.id=" + req.cookies.userid + ";")
      .then(function (customer) {
        data.customer = customer;
        connection.query("SELECT * FROM beautizyapp.command WHERE beautizyapp.command.customer_id=" + req.cookies.userid + ";")
          .then(function (orders) {
            data.orders = orders;
            //todo for each offer gather pictures and so on...
            // connection.query("SELECT * FROM beautizyapp.gallery WHERE offer_id="++";");
            connection.end();
            res.render('profile', {
              app_title: 'Beautizy - Profile',
              active: 'orders',
              urls: req.baseUrl + '/' + req.params.name,
              cookies: req.cookies,
              customer: data.customer[0],
              orders: data.orders
            });
          });
      });
  });
});

module.exports = router;
