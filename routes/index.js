var express = require('express');
var createError = require('http-errors');
var mysql = require('promise-mysql');
var crypto = require('crypto');

var router = express.Router();

function gethashValue(str) {
  return crypto.createHash('SHA1').update(crypto.createHash('SHA512').update(' ' + str + ' ').digest('hex')).digest('hex');
}

function createDomainApp(req, res, next) {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
  })
    .then(function (connection) {
      connection.query("CREATE DATABASE IF NOT EXISTS `" + gethashValue(gethashValue('database') + 'beautizyapp') + "` /*!40100 DEFAULT CHARACTER SET latin1 */;")
        .then(function (results) {
          connection.query("CREATE TABLE IF NOT EXISTS `" + gethashValue(gethashValue('database') + 'beautizyapp') + "`.`" + gethashValue(gethashValue('table') + 'customer') + "` (" +
            "`" + gethashValue(gethashValue('column') + 'id') + "` int(11) NOT NULL AUTO_INCREMENT," +
            "`" + gethashValue(gethashValue('column') + 'username') + "` VARCHAR(512) DEFAULT NULL," +
            "`" + gethashValue(gethashValue('column') + 'email') + "` longtext NOT NULL," +
            "`" + gethashValue(gethashValue('column') + 'password') + "` longtext NOT NULL," +
            "`" + gethashValue(gethashValue('column') + 'f_name') + "` longtext DEFAULT NULL," +
            "`" + gethashValue(gethashValue('column') + 'l_name') + "` longtext DEFAULT NULL," +
            "`" + gethashValue(gethashValue('column') + 'c_description') + "` longtext," +
            "`" + gethashValue(gethashValue('column') + 'call_number') + "` longtext DEFAULT NULL," +
            "`" + gethashValue(gethashValue('column') + 'c_street') + "` longtext," +
            "`" + gethashValue(gethashValue('column') + 'c_zip') + "` longtext DEFAULT NULL," +
            "`" + gethashValue(gethashValue('column') + 'c_town') + "` longtext," +
            "`" + gethashValue(gethashValue('column') + 'c_country') + "` longtext," +
            "`" + gethashValue(gethashValue('column') + 'c_since') + "` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
            "`" + gethashValue(gethashValue('column') + 'birthday') + "` longtext DEFAULT NULL," +
            "`" + gethashValue(gethashValue('column') + 'ppath') + "` longtext DEFAULT NULL," +
            "PRIMARY KEY (`" + gethashValue(gethashValue('column') + 'id') + "`)," +
            "UNIQUE KEY `" + gethashValue(gethashValue('column') + 'username') + "_UNIQUE` (`" + gethashValue(gethashValue('column') + 'username') + "`)" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;")
            .then(function (result) {
              connection.query("CREATE TABLE IF NOT EXISTS `" + gethashValue(gethashValue('database') + 'beautizyapp') + "`.`" + gethashValue(gethashValue('table') + 'offer') + "` (" +
                "`" + gethashValue(gethashValue('column') + 'id') + "` int(11) NOT NULL AUTO_INCREMENT," +
                "`" + gethashValue(gethashValue('column') + 'o_title') + "` longtext NOT NULL," +
                "`" + gethashValue(gethashValue('column') + 'o_description') + "` longtext," +
                "`" + gethashValue(gethashValue('column') + 'price') + "` longtext NOT NULL," +
                "`" + gethashValue(gethashValue('column') + 'seller_id') + "` int(11) DEFAULT NULL," +
                "`" + gethashValue(gethashValue('column') + 'o_since') + "` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                "PRIMARY KEY (`" + gethashValue(gethashValue('column') + 'id') + "`)," +
                "KEY `id_idx` (`" + gethashValue(gethashValue('column') + 'seller_id') + "`)," +
                "CONSTRAINT `" + gethashValue(gethashValue('column') + 'id') + "` FOREIGN KEY (`" + gethashValue(gethashValue('column') + 'seller_id') + "`) REFERENCES `" + gethashValue(gethashValue('table') + 'customer') + "` (`" + gethashValue(gethashValue('column') + 'id') + "`) ON DELETE CASCADE ON UPDATE CASCADE" +
                ") ENGINE=InnoDB DEFAULT CHARSET=latin1;")
                .then(function (result) {
                  connection.query("CREATE TABLE IF NOT EXISTS `" + gethashValue(gethashValue('database') + 'beautizyapp') + "`.`" + gethashValue(gethashValue('table') + 'gallery') + "` (" +
                    "`" + gethashValue(gethashValue('column') + 'id') + "` int(11) NOT NULL AUTO_INCREMENT," +
                    "`" + gethashValue(gethashValue('column') + 'g_title') + "` longtext DEFAULT NULL," +
                    "`" + gethashValue(gethashValue('column') + 'g_description') + "` longtext," +
                    "`" + gethashValue(gethashValue('column') + 'path') + "` longtext NOT NULL," +
                    "`" + gethashValue(gethashValue('column') + 'offer_id') + "` int(11) DEFAULT NULL," +
                    "`" + gethashValue(gethashValue('column') + 'g_since') + "` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                    "PRIMARY KEY (`" + gethashValue(gethashValue('column') + 'id') + "`)," +
                    "KEY `gallery_ibfk_1_idx` (`" + gethashValue(gethashValue('column') + 'offer_id') + "`)," +
                    "CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`" + gethashValue(gethashValue('column') + 'offer_id') + "`) REFERENCES `" + gethashValue(gethashValue('table') + 'offer') + "` (`" + gethashValue(gethashValue('column') + 'id') + "`) ON DELETE CASCADE ON UPDATE CASCADE" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=latin1;")
                    .then(function (result) {
                      connection.query("CREATE TABLE IF NOT EXISTS `" + gethashValue(gethashValue('database') + 'beautizyapp') + "`.`" + gethashValue(gethashValue('table') + 'command') + "` (" +
                        "`" + gethashValue(gethashValue('column') + 'id') + "` int(11) NOT NULL AUTO_INCREMENT," +
                        "`" + gethashValue(gethashValue('column') + 'message') + "` longtext," +
                        "`" + gethashValue(gethashValue('column') + 'offer_id') + "` int(11) DEFAULT NULL," +
                        "`" + gethashValue(gethashValue('column') + 'customer_id') + "` int(11) DEFAULT NULL," +
                        "`" + gethashValue(gethashValue('column') + 'since') + "` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," +
                        "PRIMARY KEY (`" + gethashValue(gethashValue('column') + 'id') + "`)," +
                        "KEY `" + gethashValue(gethashValue('column') + 'customer_id') + "` (`" + gethashValue(gethashValue('column') + 'customer_id') + "`)," +
                        "KEY `" + gethashValue(gethashValue('column') + 'command_ibfk_1') + "` (`" + gethashValue(gethashValue('column') + 'offer_id') + "`)," +
                        "CONSTRAINT `" + gethashValue(gethashValue('column') + 'command_ibfk_1') + "` FOREIGN KEY (`" + gethashValue(gethashValue('column') + 'offer_id') + "`) REFERENCES `" + gethashValue(gethashValue('table') + 'offer') + "` (`" + gethashValue(gethashValue('column') + 'id') + "`) ON DELETE CASCADE ON UPDATE CASCADE," +
                        "CONSTRAINT `" + gethashValue(gethashValue('column') + 'command_ibfk_2') + "` FOREIGN KEY (`" + gethashValue(gethashValue('column') + 'customer_id') + "`) REFERENCES `" + gethashValue(gethashValue('table') + 'customer') + "` (`" + gethashValue(gethashValue('column') + 'id') + "`)" +
                        ") ENGINE=InnoDB DEFAULT CHARSET=latin1;")
                        .then(function (result) {
                          connection.end();
                          res.redirect('/');
                        });
                    });
                });
            });
        });
    });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  // createDomainApp(req, res, next);
  res.render('index', {
    app_title: 'Beautizy',
    title: 'Beautizy',
    cookies: req.cookies,
    info: 'Please beware that you can use the search bar to search for anyone to make you a hairstylte'
  });
});
module.exports = router;