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

app.get('/home', function (req, res) {  
	// if(req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	// }
	// else{
		// res.send('Please login to view this page');
	// }
	res.end();
})  


app.get('/', function(req,res){
	res.sendFile(__dirname + '/login.html');
});

app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);


app.listen(3000, '0.0.0.0', function() {
	console.log('Hosting started...');
})