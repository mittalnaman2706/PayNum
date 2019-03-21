var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');

var connection = require('./../config');
module.exports.authenticate=function(req,res){
    var username=req.body.username;
    var password=req.body.password;
   
   
    connection.query('SELECT * FROM users WHERE username = ?',[username], function (error, results, fields) {
      if (error) {
        console.log(error);
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }
      else{
        if(results.length >0){
            decryptedString = cryptr.decrypt(results[0].Password);
            if(password == decryptedString){
               
               // res.session.loggedin = true;
               // res.session.username=username;
               res.redirect('/home');
            }
               else{
                res.json({
                  status:false,
                  message:"Username and password does not match"
                 });
            }
        }
        else{
          res.json({
              status:false,    
            message:"Username does not exits"
          });
        }
      }
    });
}