var express = require('express');
var router = express.Router();

var User = require('../model/user');
var UserItem = require('../model/useritem');
var UserProfile = require('../model/userprofile');

// var UserDB = require('../utility/UserDB');

var user = null;
var userProfile = null;

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var expressValidator = require('express-validator');

router.use(expressValidator());

router.use(function getSession(req,res,next){
  if(req.session.theUser){
    var tempsession = req.session.theUser;
    user = new User.User(tempsession.userId,tempsession.firstName,tempsession.lastName,tempsession.emailid,tempsession.address1,tempsession.address2,tempsession.city,tempsession.state,tempsession.zipCode,tempsession.country);

    userProfile = new UserProfile(tempsession.userId);

    for (var j = 0; j < tempsession.user_item.length; j++) {
      var userItem = new UserItem(tempsession.user_item[j].itemCode,
          tempsession.user_item[j].itemName,
          tempsession.user_item[j].rating,
          tempsession.user_item[j].madeIt,
          tempsession.user_item[j].catalogCategory);

      userProfile.addItem(userItem);
  }
}
  else{
    user = null;
    userProfile = null;
  }

next();

});

router.get('/',function(req,res,next){
  if(req.session.theUser){
    var user = req.session.theUser
    var data = {
            title: 'myItems',
            path: req.url,
            userProfile: userProfile
        };
    res.render('myItems',{data: data,isloggedin:true,user:user});
  }
  else{
    var userId = 1;
    var userObj= getUser(userId);
    getUser(userId).then(function(doc){
      req.session.theUser = doc;
      res.redirect('/myItems');
    });

  }
});

router.post('/check',urlencodedParser,function(req,res){
  console.log("Control here");
  var username = req.body.username;
  var password = req.body.password;

  req.check('username').isEmail().withMessage('Enter your valid email address');
  req.check('password').isLength({min:3,max:12}).withMessage("Enter your valid password");


  var errors = req.validationErrors();
  if(errors){
    for(var i=0;i<errors.length;i++){
    console.log("Error: "+errors[i].msg);
    }
    var message = "Username or password is incorrect";
    res.render('login',{isloggedin:false,message:message});
  }
  else{
    console.log("UserName: "+username+" Password: "+password);
    User.UserModel.findOne({emailid:username,password:password})
      .then(function(doc){
        if(doc!=null){
          //console.log("User data: "+doc.user_item);
          req.session.currentProfile = doc.user_item;
          req.session.theUser = doc;
          //console.log("Session data: "+req.session.theUser);
          res.redirect('/myItems');
        }
        else {
          var message = "Username or password is incorrect";
          req.session.message = message;
          //console.log("message: "+req.session.message);
          res.redirect('/myItems/signIn');
        }
      });
  }
});

router.get('/signIn',function(req,res){
  if(req.session.theUser){
    res.render('login',{isloggedin:false,message:null});
  }
  else {
    var message = req.session.message;
    res.render('login',{isloggedin:false,message:message});
  }
});

var getAllUsers = new Promise(function(resolve,reject){
  let userData = [];
  User.UserModel.find()
    .then(function(doc){
        for(var i=0;i<doc.length;i++){
          var user = new User.User(doc[i].userId,
                doc[i].firstName,
                doc[i].lastName,
                doc[i].emailid,
                doc[i].address1,
                doc[i].address2,
                doc[i].city,
                doc[i].state,
                doc[i].zipCode,
                doc[i].country);
          var userItem = new UserItem(doc[i].user_item.itemCode,
                  doc[i].user_item.itemName,
                  doc[i].user_item.rating,
                  doc[i].user_item.madeIt,
                  doc[i].user_item.catalogCategory);

          var userProfile = new UserProfile(doc[i].userId);

          userData.push(user);
          userData.push(userItem);
          userProfile.addItem(userItem);
        }
        resolve(doc);
        return userData;
      }).catch(function(err){
        console.log("Error: "+err);
        reject(err);
      });

});

var getUser = function(userId){
  return new Promise(function(resolve,reject){
    var userItems = [];
    User.UserModel.findOne({userId:userId})
      .then(function(doc){
        for(var i=0;i<doc.length;i++){
          var userProfile = new UserProfile(doc[i].userId);
          var user = new User.User(doc[i].userId,
              doc[i].firstName,
              doc[i].lastName,
              doc[i].emailid,
              doc[i].address1,
              doc[i].address2,
              doc[i].city,
              doc[i].state,
              doc[i].zipCode,
              doc[i].country);
        userItems.push(user);
        for(var j=0;j<doc[i].user_item.length;j++){
          var userItem = new UserItem(doc[i].user_item[j].itemCode,
                     doc[i].user_item[j].itemName,
                     doc[i].user_item[j].rating,
                     doc[i].user_item[j].madeIt,
                     doc[i].user_item[j].catalogCategory);
          userItems.push(userItem);
          userProfile.addItem(userItem);
        }
        }
        resolve(doc);
        return userItems;
      }).catch(function(err){
        console.log("Error: "+err);
        reject(doc);
      });

  });
}

module.exports = router;
module.exports.getUser = getUser;
