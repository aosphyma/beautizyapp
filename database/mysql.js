var mysql = require('mysql')
// var mysql = require('promise-mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'beautizyapp'
});

module.exports = connection;

/** 
 * usage
 */
/* connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end() */
