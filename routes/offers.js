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
    var username = 'bla'; // todo use it from the cookies
    var id = 5; // todo use it from the cookies
    var connect = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'beautizyapp'
    }).then(function (connection) {
        connection.query("insert into beautizyapp.offer" +
            "set beautizyapp.offer.o_title='" + title + "', " +
            "beautizyapp.offer.o_description ='" + desc + "'," +
            "beautizyapp.offer.price= " + price + ",  " +
            "seller_id = (" +
            "select id from beautizyapp.customer where id=" + request.cookies.userid +
            ");")
            .then(function (result) {
                if (request.files) {
                    var pp = '';
                    request.files.pictures.forEach(item => {
                        (async () => {
                            pp = '/images/offers/' + item.name;
                            await item.mv(path.join(__dirname, '../public', pp), function (err) {
                                if (err) {
                                    next(createError(500));
                                }
                            });
                            console.log('File moved: ', pp);
                        })();
                        connection.query("insert into beautizyapp.gallery" +
                            "set g_title='" + title + "'," +
                            "g_description='" + desc + "'," +
                            "ppath = '" + pp + "'," +
                            "offer_id = (select id from beautizyapp.offer where beautizyapp.offer.id = '" + result.insertId + "');");
                    });
                }
                connection.end();
            });
    }).then(function () {
        response.redirect('/profiles/' + username + '/offers');
    });
});








module.exports = router;