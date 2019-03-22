var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

var connection = require('./config');
var app = express();

var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');
 
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
})); 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/logout', function(req, res, next) {
	req.session.destroy();
	console.log('Logout successful !');
	res.redirect('/');
});

app.get('/home', function (req, res) {  
	if(req.session.loggedin) {
		res.sendFile('C:/Users/Naman Mittal/Desktop/PayNum/home.html');
		// res.send('Welcome back, ' + req.session.username + '!');
	}
	else{
		res.send('Please login to view this page');
	}
	// res.end();
});  

app.get('/', function(req,res){
	res.sendFile(__dirname + '/login.html');
});

app.get('/Sign-Up', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/controllers/register-controller', registerController.register);

app.post('/auth', function(req, res) {	
	var username=req.body.username;
    var password=req.body.password;
    connection.query('SELECT * FROM users WHERE username = ?',[username], function (error, results, fields) {
        if(results.length >0){
            decryptedString = cryptr.decrypt(results[0].Password);
            if(password == decryptedString){
               
               req.session.loggedin = true;
               req.session.username=username;
               res.redirect('/home');
            }
            else{
	    		res.send('Username and/or password Incorrect !!!');
            }
        }
       	else{
    		res.send('Username and/or password Incorrect !!!');
 	   	}
 	   });
});

app.listen(3000, '0.0.0.0', function() {
	console.log('Hosting started...');
});