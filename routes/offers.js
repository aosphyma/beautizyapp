var express = require('express');
var createError = require('http-errors');
var mysql = require('promise-mysql');
var path = require('path');
var router = express.Router();

//create a new offer
router.post('/', function (request, response, next) {
    var title = request.body.title;
    var desc = request.body.description;
    var price = Number(Number(request.body.price) + Number('3.00'));
    // todo use it from the cookies
    var id = 5; // todo use it from the cookies
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'beautizyapp'
    }).then(function (connection) {
        var query = "insert into beautizyapp.offer " +
            "set beautizyapp.offer.o_title='" + title + "', " +
            "beautizyapp.offer.o_description ='" + desc + "', " +
            "beautizyapp.offer.price= " + price + ",  " +
            "seller_id = (" +
            "select id from beautizyapp.customer where id=" + request.cookies.userid +
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
                    connection.query("insert into beautizyapp.gallery " +
                            "set g_title='" + title + "', " +
                            "g_description='" + desc + "', " +
                            "path = '" + pp + "', " +
                            "offer_id = (select id from beautizyapp.offer where beautizyapp.offer.id = '" + result.insertId + "');");
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
                connection.end();
            });
    }).then(function () {
        response.redirect('/profiles/' + request.cookies.username + '/offers');
    });
});
module.exports = router;