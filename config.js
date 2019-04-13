var mysql = require('mysql');
var connection = mysql.createConnection({

	multipleStatements: true,
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'paynum'
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected :)");
} else {
    console.log("Error while connecting with database :(");
}
});
module.exports = connection; 