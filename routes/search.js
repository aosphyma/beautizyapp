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

function searchsParser(o_array) {
    var offers = [];
    o_array.forEach(function (offer, index, arr) {
        offers[index] = searchParser(offer);
    });
    return offers;
}
function searchParser(offer) {
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
                details.path = value != null ? decrypt(value) : null;
                break;
            case gethashValue(gethashValue('column') + 'username'):
                details.username = value != null ? decrypt(value) : null;
                break;
            default:
                return 'error';
        }
    });
    return details;
}

router.post('/', function (req, res, next) {
    if (format.test(req.body.place) || format.test(req.body.hairstyle)) {
        next(createError(400));
    }
    var address = (req.body.place).split(', ');
    mysql.createConnection({
        host: 'localhost',
        user: 'beautizy-root',
        password: 'Beauty1518',
        database: gethashValue(gethashValue('database') + 'beautizyapp')
    }).then(function (connection) {
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
            + gethashValue(gethashValue('column') + 'c_town') + "`, '" + encrypt(address[1]) + "') or " +
            // "locate(`"
            // + gethashValue(gethashValue('column') + 'c_zip') + "`, '" + encrypt(req.body.place) + "') or " +
            "locate(`"
            + gethashValue(gethashValue('column') + 'c_country') + "`, '" + encrypt(address[address.length - 1]) + "'));").
            then(function (results) {
                var data = searchsParser(results);
                console.log(data[0].username);
                console.log(req.cookies.username);
                res.render('search', {
                    title: 'Beautizy - Search',
                    cookies: req.cookies,
                    results: data
                });
            });
    });

});
module.exports = router;
