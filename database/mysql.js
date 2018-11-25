var mysql = require('promise-mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'beautizyapp'
});

module.exports = connection;