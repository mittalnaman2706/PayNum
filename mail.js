var nodemailer = require('nodemailer');

var toMail = ;

var from = 'paynum.group@gmail.com';
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: from,
    pass: '********' 			//Write your password here
  }
});

var mailOptions = {
  from: from,
  to: toMail,
  subject: 'Sending Email using Node.js',
  // text: 'Test E-mail!'
  html: '<h1>Welcome</h1><p>That was easy!</p>'

};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
