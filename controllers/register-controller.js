var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./../config');
cryptr = new Cryptr('myTotalySecretKey');
 
module.exports.register=function(req,res){
    // var today = new Date();
    var encryptedString = cryptr.encrypt(req.body.password);
    var user={
        "FName":req.body.Fname,
        "LName":req.body.Lname,
        "Password":encryptedString,
        "E_Mail":req.body.email,
        "Phone":req.body.phone,
        "DOB":req.body.DOB,
        "UserName":req.body.Username,
    }
    connection.query('INSERT INTO users SET ?',user, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
          res.json({
            status:true,
            // data:results,
            message:'user registered sucessfully'
        })
      }
    });
}