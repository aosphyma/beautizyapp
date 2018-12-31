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


// todo create directory if not exists
// var fs = require('fs');
// var dir = './tmp';

// if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir);
// }



//create a new offer
router.post('/', function (request, response, next) {
    var title = request.body.title;
    var desc = request.body.description;
    var price = Number(Number(request.body.price) + Number('3.00'));
    var str_price = String(price);
    // todo use it from the cookies
    var id = 5; // todo use it from the cookies
    mysql.createConnection({
        host: 'localhost',
        user: 'beautizy-root',
        password: 'Beauty1518',
        database: gethashValue(gethashValue('database') + 'beautizyapp')
    }).then(function (connection) {
        var query = "insert into `" + gethashValue(gethashValue('table') + 'offer') +
            "` set `" + gethashValue(gethashValue('column') + 'o_title') + "`='" + encrypt(title) + "', `" +
            gethashValue(gethashValue('column') + 'o_description') + "`='" + encrypt(desc) + "', `" +
            gethashValue(gethashValue('column') + 'price') + "`= '" + encrypt(str_price) + "', `" +
            gethashValue(gethashValue('column') + 'seller_id') + "`= (" +
            "select `" + gethashValue(gethashValue('column') + 'id') + "` from `"
            + gethashValue(gethashValue('table') + 'customer') + "` where `"
            + gethashValue(gethashValue('column') + 'id') + "`=" + request.cookies.userid +
            ");";
        connection.query(query).
            then(function (result) {
                if (request.files) {
                    var pp = '';
                    (async () => {
                        pp = '/images/offers/' + request.files.pictures.name;
                        await request.files.pictures.mv(path.join(__dirname, '../public', pp), function (err) {
                            if (err) {
                                next(createError(500));
                            }
                        });
                        console.log('file uploaded');
                    })();
                    connection.query("insert into `" + gethashValue(gethashValue('table') + 'gallery') +
                        "` set `" + gethashValue(gethashValue('column') + 'g_title') + "`='" + encrypt(title) + "', `" +
                        gethashValue(gethashValue('column') + 'g_description') + "`='" + encrypt(desc) + "', `" +
                        gethashValue(gethashValue('column') + 'path') + "`= '" + encrypt(pp) + "', `" +
                        gethashValue(gethashValue('column') + 'offer_id') + "`= (select `"
                        + gethashValue(gethashValue('column') + 'id') + "` from `"
                        + gethashValue(gethashValue('table') + 'offer') + "` where `"
                        + gethashValue(gethashValue('column') + 'id') + "`='" + result.insertId + "');")
                        .then(function (result) {
                            connection.end();
                            response.redirect('/profiles/' + request.cookies.username + '/offers');
                        });
                    // request.files.pictures.forEach(item => {
                    //     (async () => {
                    //         pp = '/images/offers/' + item.name;
                    //         await item.mv(path.join(__dirname, '../public', pp), function (err) {
                    //             if (err) {
                    //                 next(createError(500));
                    //             }
                    //         });
                    //     })();
                    //     connection.query("insert into beautizyapp.gallery " +
                    //         "set g_title='" + title + "', " +
                    //         "g_description='" + desc + "', " +
                    //         "path = '" + pp + "', " +
                    //         "offer_id = (select id from beautizyapp.offer where beautizyapp.offer.id = '" + result.insertId + "');");
                    // });
                }

            });
    });
});
module.exports = router;