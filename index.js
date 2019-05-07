var nodemailer = require('nodemailer');
var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

var connection = require('./config');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));        // Needed to open background images

var from = 'paynumgroup@gmail.com';            //Your Email ID
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: from,
    pass: 'Paynum@103073' 			//Write your password here
  }
});

var registerController=require('./controllers/register-controller');
 
app.set('trust proxy', 1)
app.use(session({
	secret: 'secret',
	resave: false,
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
	if(req.session.loggedin) 
		res.render('home', {name:req.session.name, username:req.session.username});
	else
		res.send("<h1>Please <a href=\"/login\">login</a> to view this page</h1>");
});  

app.get('/changePass', function (req, res) {  
	if(req.session.loggedin) 
		res.render('changepass', {name:req.session.name, username:req.session.username});
	else
		res.send("<h1>Please <a href=\"/login\">login</a> to view this page</h1>");
});  

app.get('/login', function(req,res){
	if(req.session.loggedin){
		req.session.destroy();
	}
	res.sendFile(__dirname + '/login.html');
});

app.get('/about', function(req,res){
	res.sendFile(__dirname + '/about.html');
});
app.get('/contact', function(req,res){
	res.sendFile(__dirname + '/contact.html');
});


app.get('/', function(req,res){
	if(req.session.loggedin)
		res.render('home', {name:req.session.name, username:req.session.username});
	res.sendFile(__dirname + '/main.html');
});

app.get('/paypage', function(req, res){
	if(req.session.loggedin) 
		res.render('pay', {name:req.session.name, username:req.session.username});
	else
		res.send('Please <a href=\"/login\">login</a> to view this page');
});

app.post('/pay', function(req, res){
	if(req.session.loggedin) {
		var bal = Number(req.session.bal);
		var pay_amount = Number(req.body.amt);
		var myacc = Number(req.session.accno);
		var payto = Number(req.body.senderno);
		if(myacc == payto){
			res.send("<h1 style=\"color:red\">Sorry, You cannot transfer to your own account!</h1>");
		}
		else if(bal >= pay_amount){

			var q1 = 'SELECT * FROM users WHERE Account_Number = ?';
			connection.query(q1,[payto], function (error, results, fields) {

				if(error)
					res.send("Error, Check your internet connection.\nYour account will be reimbursed if amount is deducted.");
				else if(results.length==0)
					res.send("Sorry, no user exists with account number - " + payto + '!');			
				else {

					var q2 = "UPDATE users SET Amount = Amount - ? WHERE Account_Number = ?";
				    connection.query(q2, [pay_amount, myacc], function (err, result, fields) {
				   		
				   		if(err)
				   			res.send("Error, Check your internet connection.\nYour account will be reimbursed if amount is deducted.");
				   		else {
				   			 req.session.bal = Number(req.session.bal) - Number(pay_amount);
                   			 console.log(result.affectedRows + " record(s) updated");
                   
							var q3 = "UPDATE users SET Amount = Amount + ? WHERE Account_Number = ?";
						    connection.query(q3, [pay_amount, payto], function (err, result, fields) {

						    	if(err) 
						   			res.send("Error, Check your internet connection.\nYour account will be reimbursed if amount is deducted.");
						   		else {
                   					console.log(result.affectedRows + " record(s) updated");                   	
									var q4 = 'INSERT INTO transactions(SENDER, Reciever, amount) VALUES(?, ?, ?)';		
   								    connection.query(q4,[payto, myacc, pay_amount], function (error, results, fields) {
	    								if(error) 
							   				res.send("Error, Check your internet connection.\nYour account will be reimbursed if amount is deducted.");
							   			else {
											res.render('home2', {name:req.session.name, username:req.session.username});						   			
							   		}
									});
						   		}
						    });
				   		}
				    });
				}

			});
		}
		else
			res.send("<h1>Insufficient Balance</h1>")
	}
	else
		res.send('Please <a href=\"/login\">login</a> to view this page');
});

app.get('/addMoney', function(req,res){
    if(req.session.loggedin) 
        res.render('add', {username:req.session.username, name:req.session.name});
    else
        res.send('<h1>Please <a href=\"/login\">login</a> to view this page</h1>');
});


app.post('/add', function(req, res){
	if(req.session.loggedin) {
		var add_amount = req.body.amountAdd;
        var accnt = req.session.accno;
		  connection.query("UPDATE users SET Amount = Amount + ? WHERE Account_Number = ?", [add_amount, accnt], function (err, result, fields) {
	      if(err) 
	      	res.send("Unable to add Money, please check your internet connection");
	      else {
            connection.query('INSERT INTO transactions(SENDER, Reciever, amount) VALUES(?, ?, ?)',[accnt, accnt, add_amount], function (error, results, fields) {
                if(error) 
                    res.send("Unable to add Money, please check your internet connection");
                else {
                    req.session.bal = Number(req.session.bal) + Number(add_amount);

                    console.log(result.affectedRows + " record(s) updated");

                    var mailOptions = {
						from: from,
						to: req.session.email,
						subject: 'NO REPLY-Paynum: Account Credited',
						html: '<h1>Rs. ' + add_amount + ' added to your account successfully !</h1><h2>\nUpdated balance = Rs. '+req.session.bal+'</h2>'
						};

						transporter.sendMail(mailOptions, function(eror, info){
						  if (eror) {
						    console.log(eror);
						  } else {
						    console.log('Email sent !');
						  }
					});
                    res.render('added', {bal:req.session.bal,name:req.session.name});    
                }
            });
		  }
  	});
	}
	else
		res.send('Please <a href=\"/login\">login</a> to view this page');
});


app.get('/passbook', function(req,res){
	if(req.session.loggedin) {
	var acc = req.session.accno;
	
	connection.query('SELECT * FROM users WHERE Account_Number = ?',[acc], function (erro, resul, fields) {
	if(erro) res.send("Network Error !");

	else{		
	var bal = resul[0].amount;
	console.log("New bal" + bal);
	connection.query('SELECT * FROM transactions WHERE Sender = ? or Reciever = ?',[acc, acc], function (error, results, fields) {
			
			res.render("passbook", {bal:bal, myacc:acc,name:req.session.name ,result : results});
		});
	}
	});
	}
	else
		res.send('Please <a href=\"/login\">login</a> to view this page');
});

app.get('/profile', function(req,res){
	if(req.session.loggedin) {
		var date = req.session.dob;
		date=date.substring(0, 10);
		// console.log(req.session.dob);
		res.render('profile', {username:req.session.username, phone:req.session.phone, 	dob:date, email:req.session.email, bal:req.session.bal, name:req.session.name, accno:req.session.accno, });	
	}
	else
		res.send('Please <a href=\"/login\">login</a> to view this page');
});

app.get('/forgot-pass', function(req,res){
	res.sendFile(__dirname + '/forgot-pass.html');
});

app.get('/Sign-Up', function(req,res){
	if(req.session.loggedin)
		req.session.destroy();
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
		res.redirect('login');
	}	
	else
		res.send('Wrong Username');
	});
});

app.post('/auth', function(req, res) {	
	
	if(req.session.loggedin)
		req.session.destroy();
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
            else
	    		res.send('Username and/or password Incorrect !!!');
        }
       	else
    		res.send('Username and/or password Incorrect !!!');
 	   });
});

app.listen(3000, '0.0.0.0', function() {
	console.log('Hosting started...');
});