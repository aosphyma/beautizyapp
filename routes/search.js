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

const format = /[!@#$%^&*()_+=\[\]{};:\\|.\/?]/;

router.post('/', function (req, res, next) {
    if (format.test(req.body.place) || format.test(req.body.hairstyle)) {
        next(createError(400));
    }
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: gethashValue(gethashValue('database') + 'beautizyapp')
    }).then(function (connection) {
        console.log(req.body.place);
        connection.query(
            "SELECT `" + gethashValue(gethashValue('table') + 'offer') + "`.*, `"
            + gethashValue(gethashValue('table') + 'customer') + "`.`"
            + gethashValue(gethashValue('column') + 'username') + "`, `"
            + gethashValue(gethashValue('table') + 'gallery') + "`.`" + gethashValue(gethashValue('column') + 'path') + "` " +
            "FROM `" + gethashValue(gethashValue('table') + 'offer') + "` " +
            "JOIN `" + gethashValue(gethashValue('table') + 'customer') + "` " +
            "ON `" + gethashValue(gethashValue('table') + 'offer') + "`.`"
            + gethashValue(gethashValue('column') + 'seller_id') + "` = `"
            + gethashValue(gethashValue('table') + 'customer') + "`.`"
            + gethashValue(gethashValue('column') + 'id') + "` " +
            "JOIN `" + gethashValue(gethashValue('table') + 'gallery') + "` " +
            "ON `" + gethashValue(gethashValue('table') + 'offer') + "`.`"
            + gethashValue(gethashValue('column') + 'id') + "` = `"
            + gethashValue(gethashValue('table') + 'gallery') + "`.`"
            + gethashValue(gethashValue('column') + 'offer_id') + "` " +
            "WHERE `" + gethashValue(gethashValue('table') + 'offer') + "`.`"
            + gethashValue(gethashValue('column') + 'seller_id') + "` = " +
            "(SELECT `" + gethashValue(gethashValue('column') + 'id')
            + "` FROM `" + gethashValue(gethashValue('table') + 'customer') + "` where " +
            // "locate(`"
            // + gethashValue(gethashValue('column') + 'c_street') + "`, '" + encrypt(req.body.place) + "') or " +
            "locate(`"
            + gethashValue(gethashValue('column') + 'c_town') + "`, '" + encrypt(req.body.place) + "') or " +
            "locate(`"
            + gethashValue(gethashValue('column') + 'c_zip') + "`, '" + encrypt(req.body.place) + "') or " +
            "locate(`"
            + gethashValue(gethashValue('column') + 'c_country') + "`, '" + encrypt(req.body.place) + "'));").
            then(function (result) {
                console.log(result);
                res.render('search', {
                    title: 'Beautizy - Search',
                    cookies: req.cookies,
                    // results: result
                });
            });
    });

});
module.exports = router;
