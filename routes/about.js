var express = require('express');
var router = express.Router();
// var connection = require('./../database/mysql')
var mysql = require('promise-mysql');


router.get('/', function (req, res, next) {
    res.render('about', {
        app_title: 'Beautizy - About',
        active: 'about',
        cookies: req.cookies,
        urls: req.baseUrl + '/' + req.params.name
    });
});



module.exports = router;