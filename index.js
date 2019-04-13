var nodemailer = require('nodemailer');
var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

var connection = require('./config');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));        // Needed to ope n background image in 'sendFile'

var from = 'paynum.group@gmail.com';
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: from,
    pass: '********' 			//Write your password here
  }
});

var registerController=require('./controllers/register-controller');
 
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
})); 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/logout', function(req, res, next) {
	req.session.destroy();
	console.log('Logout successful !');
	res.redirect('/');
});


app.get('/home', function (req, res) {  
	if(req.session.loggedin) {
		res.render('home', {name:req.session.name, username:req.session.username});
	}
	else{
		res.send("<h1>Please <a href=\"/login\">login</a> to view this page</h1>");
	}
});  

app.get('/login', function(req,res){
	res.sendFile(__dirname + '/login.html');
});

app.get('/about', function(req,res){
	res.sendFile(__dirname + '/about.html');
});


app.get('/', function(req,res){
	res.sendFile(__dirname + '/main.html');
});

app.get('/paypage', function(req, res){
	if(req.session.loggedin) {
		res.render('pay');
	}
	else{
		res.send('Please <a href=\"/login\">login</a> to view this page');
	}
});
app.post('/pay', function(req, res){
	if(req.session.loggedin) {
		var bal = req.session.bal;
		var pay_amount = req.body.amt;
		if(bal >= pay_amount){
			res.send("Done! Will be available soon");
		}
		else{
			res.send("<h1>Insufficient Balance</h1>")
		}
	}
	else{
		res.send('Please <a href=\"/login\">login</a> to view this page');
	}
});

app.get('/passbook', function(req,res){
	if(req.session.loggedin) {
	var bal = req.session.bal;
	var acc = req.session.accno;
	connection.query('SELECT * FROM transactions WHERE Sender = ? or Reciever = ?',[acc, acc], function (error, results, fields) {

		if(results.length>0){
			res.send("<h1>This feature will be available soon !</h1>");
		}
		else{
			res.send("<h2>Available Balance = "+ bal+"</h2><br><h2>No transactions are done from/to your account</h2>");
		}
		});
	}
	else{
		res.send('Please <a href=\"/login\">login</a> to view this page');
	}
	// res.sendFile('passbook', {name:req.session.name, username:req.session.username});
});

app.get('/profile', function(req,res){
	if(req.session.loggedin) {
		var date = req.session.dob;
		date=date.substring(0, 10);
		res.render('profile', {username:req.session.username, phone:req.session.phone, 	dob:date, email:req.session.email, bal:req.session.bal, name:req.session.name, accno:req.session.accno, });	
	}
	else{
		res.send('Please <a href=\"/login\">login</a> to view this page');
	}
});

app.get('/forgot-pass', function(req,res){
	res.sendFile(__dirname + '/forgot-pass.html');
});

app.get('/Sign-Up', function(req,res){
	res.sendFile(__dirname + '/signup.html');
});

app.post('/controllers/register-controller', registerController.register);

app.post('/forgot', function(req, res) {

	var username = req.body.username;
    connection.query('SELECT * FROM users WHERE username = ?',[username], function (error, results, fields) {
	if(results.length > 0){
        var Password = cryptr.decrypt(results[0].Password);
        var EMail = results[0].E_Mail;

        var mailOptions = {
		from: from,
		to: EMail,
		subject: 'NO REPLY: Forgot Password Paynum',
		text: 'Your password is recovered: ' + Password
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent !');
		  }
		});
		res.send('Your Password has been mailed to <a onclick="myFunction()" href="/">' + EMail + '</a>');
	}	
	else{
		res.send('Wrong Username');
	}
	});
});

app.post('/auth', function(req, res) {	
	var username=req.body.username;
    var password=req.body.password;
    connection.query('SELECT * FROM users WHERE username = ?',[username], function (error, results, fields) {
        if(results.length >0){
            decryptedString = cryptr.decrypt(results[0].Password);
            if(password == decryptedString){
               
               req.session.loggedin = true;
               req.session.username=username;
               req.session.name = results[0].FName +' '+ results[0].LName;
               req.session.dob = results[0].DOB;
               req.session.bal = results[0].amount;
               req.session.accno = results[0].Account_Number;
               req.session.email = results[0].E_Mail;
               req.session.phone = results[0].Phone;
               
               module.exports.uname = username;
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