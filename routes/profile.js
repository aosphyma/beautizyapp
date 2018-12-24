var express = require('express');
var createError = require('http-errors');
var mysql = require('promise-mysql');
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
  return crypto.createHash('SHA1')
    .update(crypto.createHash('SHA512')
      .update(' ' + str + ' ')
      .digest('hex'))
    .digest('hex');
}

function offersParser(o_array) {
  var offers = [];
  o_array.forEach(function (offer, index, arr) {
    offers[index] = offerParser(offer);
  });
  return offers;
}

function ordersParser(o_array) {
  var orders = [];
  o_array.forEach(function (order, index, arr) {
    orders[index] = orderParser(order);
  });
  return orders;
}

function orderParser(offer) {
  var details = {};
  Object.keys(offer).forEach((col, index, arr) => {
    var value = Object.values(offer)[index];
    switch (col) {
      case gethashValue(gethashValue('column') + 'id'):
        details.id;
        break;
      case gethashValue(gethashValue('column') + 'message'):
        details.message = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'offer_id'):
        details.offer_id = value;
        break;
      case gethashValue(gethashValue('column') + 'customer_id'):
        details.customer_id = value;
        break;
      case gethashValue(gethashValue('column') + 'since'):
        details.since = value;
        break;
      default:
        return 'error';
    }
  });
  return details;
}

function offerParser(offer) {
  var details = {};
  Object.keys(offer).forEach((col, index, arr) => {
    var value = Object.values(offer)[index];
    switch (col) {
      case gethashValue(gethashValue('column') + 'id'):
        details.id = value;
        break;
      case gethashValue(gethashValue('column') + 'o_title'):
        details.o_title = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'o_description'):
        details.o_description = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'price'):
        details.price = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'seller_id'):
        details.seller_id = value;
        break;
      case gethashValue(gethashValue('column') + 'o_since'):
        details.o_since = value;
        break;
      case gethashValue(gethashValue('column') + 'path'):
        details.path = value;
        break;
      default:
        return 'error';
    }
  });
  return details;
}

function userParser(array) {
  var details = {};
  Object.keys(array).forEach((col, index, arr) => {
    var value = Object.values(array)[index];
    switch (col) {
      case gethashValue(gethashValue('column') + 'id'):
        details.id = value;
        break;
      case gethashValue(gethashValue('column') + 'username'):
        details.username = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'password'):
        details.password = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'email'):
        details.email = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'f_name'):
        details.f_name = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'l_name'):
        details.l_name = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'c_description'):
        details.c_description = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'call_number'):
        details.call_number = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'c_street'):
        details.c_street = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'c_zip'):
        details.c_zip = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'c_town'):
        details.c_town = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'c_country'):
        details.c_country = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'c_since'):
        details.c_since = value != null ? value : null;
        break;
      case gethashValue(gethashValue('column') + 'birthday'):
        details.birthday = value != null ? decrypt(value) : null;
        break;
      case gethashValue(gethashValue('column') + 'ppath'):
        details.ppath = value != null ? decrypt(value) : null;
        break;
      default:
        return 'error';
        break;
    }
  });
  return details;
}

// to test if the given url contains mallicious content
var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

router.get('/:name/profile', function (req, res, next) {
  if (format.test(req.params.name)) {
    next(createError(404, req.url));
  }
  if (req.cookies === {} || req.cookies.username === undefined) {
    next(createError(401));
  }

  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: gethashValue(gethashValue('database') + 'beautizyapp')
  }).then(function (connection) {
    connection.query("SELECT * FROM `"
      + gethashValue(gethashValue('table') + 'customer') + "` where `"
      + gethashValue(gethashValue('column') + 'username') + "`='"
      + encrypt(req.params.name) + "';")
      .then(function (results) {
        connection.end();
        var details = userParser(results[0]);
        res.render('profile', {
          app_title: 'Beautizy - Profile',
          active: 'profile',
          urls: req.baseUrl + '/' + req.params.name,
          cookies: req.cookies,
          customer: details
        });
      });
  });
});

router.get('/:name/offers', function (req, res, next) {
  if (format.test(req.params.name)) {
    next(createError(404, req.url));
  }

  if (req.cookies === {} || req.cookies.username === undefined) {
    next(createError(401));
  }

  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: gethashValue(gethashValue('database') + 'beautizyapp')
  }).then(function (connection) {
    var dataFor = {};
    connection.query("SELECT * FROM `"
      + gethashValue(gethashValue('table') + 'customer') + "` WHERE `"
      + gethashValue(gethashValue('column') + 'id') + "`=" + req.cookies.userid + ";")
      .then(function (customer) {
        dataFor.customer = userParser(customer[0]);
        var query = "SELECT * FROM `"
          + gethashValue(gethashValue('table') + 'offer') + "` JOIN `"
          + gethashValue(gethashValue('table') + 'gallery') + "` " +
          "on `" + gethashValue(gethashValue('table') + 'offer') + "`.`" + gethashValue(gethashValue('column') + 'id')
          + "` = `" + gethashValue(gethashValue('table') + 'gallery') + "`.`" + gethashValue(gethashValue('column') + 'offer_id') + "` " +
          "and `" + gethashValue(gethashValue('table') + 'offer') + "`.`" + gethashValue(gethashValue('column') + 'seller_id') + "` = " + req.cookies.userid + ";";
        connection.query(query)
          .then(function (offers) {
            connection.end();
            dataFor.offers = offersParser(offers);
            res.render('profile', {
              app_title: 'Beautizy - Profile',
              active: 'offers',
              urls: req.baseUrl + '/' + req.params.name,
              cookies: req.cookies,
              customer: dataFor.customer,
              offers: dataFor.offers
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

  if (req.cookies === {} || req.cookies.username === undefined) {
    next(createError(404));
  }


  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: gethashValue(gethashValue('database') + 'beautizyapp')
  }).then(function (connection) {
    var dataFor = {};
    connection.query("SELECT * FROM `"
      + gethashValue(gethashValue('table') + 'customer') + "` WHERE `"
      + gethashValue(gethashValue('column') + 'id') + "`=" + req.cookies.userid + ";")
      .then(function (customer) {
        dataFor.customer = userParser(customer[0]);
        // todo must not see other's order
        // if(dataFor.customer.id != req.cookies.userid){
        //   next(createError(403, '<div class="container red-text">Beware!<br> You cannot check the orders of other clients.<br><a href="/">Go back to homepage</a></div>'))
        // }
        connection.query("SELECT * FROM `"
          + gethashValue(gethashValue('table') + 'command') + "` WHERE `"
          + gethashValue(gethashValue('column') + 'customer_id') + "`=" + req.cookies.userid + ";")
          .then(function (orders) {
            dataFor.orders = ordersParser(orders);
            //todo for each offer gather pictures and so on...
            // connection.query("SELECT * FROM beautizyapp.gallery WHERE offer_id="++";");
            connection.end();
            res.render('profile', {
              app_title: 'Beautizy - Profile',
              active: 'orders',
              urls: req.baseUrl + '/' + req.params.name,
              cookies: req.cookies,
              customer: dataFor.customer,
              orders: dataFor.orders
            });
          });
      });
  });
});

module.exports = router;
