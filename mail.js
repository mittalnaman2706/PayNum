var nodemailer = require('nodemailer');

var from = 'paynum.group@gmail.com';
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: from,
    pass: '********'
  }
});

var mailOptions = {
  from: from,
  to: 'parassharma8041@gmail.com,namanmittal040@gmail.com',
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
