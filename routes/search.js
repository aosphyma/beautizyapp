var express = require('express');
var createError = require('http-errors');
var mysql = require('promise-mysql');
var router = express.Router();


const format = /[!@#$%^&*()_+=\[\]{};:\\|.\/?]/;

router.post('/', function (req, res, next) {
    if (format.test(req.body.place) || format.test(req.body.hairstyle)) {
        next(createError(400));
    }
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'beautizyapp'
    }).then(function (connection) {
        connection.query(
            "SELECT beautizyapp.offer.*, beautizyapp.customer.username, beautizyapp.gallery.path "+
            "FROM beautizyapp.offer "+
            "JOIN beautizyapp.customer "+
            "ON beautizyapp.offer.seller_id = beautizyapp.customer.id "+
            "JOIN beautizyapp.gallery "+
            "ON beautizyapp.offer.id = beautizyapp.gallery.offer_id "+
            "WHERE beautizyapp.offer.seller_id = " +
            "(SELECT id FROM beautizyapp.customer where " +
            // "locate(c_street, 'req.body.place') and " +
            "locate(c_town, '" + req.body.place + "') and " +
            "locate(c_zip, '" + req.body.place + "') and " +
            "locate(c_country, '" + req.body.place + "'));").
            then(function (result) {
                res.render('search', {
                    title: 'Beautizy - Search',
                    cookies: req.cookies,
                    results: result
                });
            });
    });

});
module.exports = router;
