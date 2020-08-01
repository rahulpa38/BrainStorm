var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var UserItem = require('../model/useritem');
var UserProfile = require('../model/userprofile');
var User = require('../model/user');
var ItemData = require('../model/item');
var ProfileController = require('../controller/profileController');

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/',function(req,res){
  if(req.session.theUser){
    var user = req.session.theUser;
    res.render('index',{isloggedin:true,user:user});
  }
  else{
    res.render('index',{isloggedin:false});
  }
});

router.get('/signin',function(req,res){
  req.session.isloggedin = true;
  res.redirect('/myItems');
});

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/');
});


router.get('/categories', function(req, res) {
  console.log("Categories");
  var data = {};
  if(req.session.theUser){
    var user = req.session.theUser;
    var category = ItemData.ItemModel.distinct('catalogCategory');
    category.then(function(doc){
      data.categories = doc;
      getAllItems.then(function(docs){
          data.items = docs;
          res.render('categories',{data:data,isloggedin:true,user:user});
        });
    });
  }
  else{
    var category = ItemData.ItemModel.distinct('catalogCategory');
    category.then(function(doc){
      data.categories = doc;
      getAllItems.then(function(docs){
          data.items = docs;
          res.render('categories',{data:data,isloggedin:false});
        });
    })
  }
});

router.get('/categories/item/:itemCode', function(req, res, next) {
    var itemCode = req.params.itemCode;
    var data = {};
    if(req.session.theUser){
      var user = req.session.theUser;
      getItem(itemCode).then(function(doc){
        if(itemCode>9||itemCode<1){
          res.redirect('/categories');
        }
        else{
          data.item = doc;
          res.render('item',{data:data,isloggedin:true,user:user});
        }
      });
    }
    else{
      getItem(itemCode).then(function(doc){
        if(itemCode>9||itemCode<1){
          res.redirect('/categories');
        }
        else{
          data.item = doc;
          res.render('item',{data:data,isloggedin:false});
        }
      })
    }
});


router.get('/about',function(req,res){
  if(req.session.theUser){
    var user = req.session.theUser;
    res.render('about',{isloggedin:true,user:user});
  }
  else {
    res.render('about',{isloggedin:false});
  }
});


router.get('/contact',function(req,res){
  if(req.session.theUser){
    var user = req.session.theUser;
  res.render('contact',{isloggedin:true,user:user});
}
else {
  res.render('contact',{isloggedin:false});
}
});


router.get('/feedback/:itemCode',function(req,res){
  var itemCode = req.params.itemCode;
  var data = {};
  console.log("Item Code:"+itemCode);
  if(req.session.theUser){
    var user = req.session.theUser;
    getItem(itemCode).then(function(doc){
      if(itemCode>100||itemCode<1){
        res.redirect('/categories');
      }
      else{
        data.item = doc;
        res.render('feedback',{data:data,isloggedin:true,user:user});
      }
    });
  }
  else{
    getItem(itemCode).then(function(doc){
      if(itemCode>9||itemCode<1){
        res.redirect('/categories');
      }
      else{
        data.item = doc;
        res.render('feedback',{data:data,isloggedin:false});
      }
    });
  }
});


router.get('/categories/item/saveit/:itemCode',function(req,res){
  let itemCode = req.params.itemCode;
  var tempsession = req.session.theUser;
  if(req.session.theUser){
    var id = tempsession.userId;
    User.UserModel.findOne({userId:id,"user_item.itemCode":itemCode},{"user_item.$":1})
      .then(function(doc){
        if(doc==null){
          getItem(itemCode).then(function(docs){
            for(var i=0;i<docs.length;i++){
              var itemName = docs[i].itemName;
              var rating = docs[i].rating;
              var catalogCategory = docs[i].catalogCategory;
              var madeIt = false;
            }
            User.UserModel.findOneAndUpdate({userId:id},
              {$push:{user_item: {
            itemName:itemName,
            itemCode:itemCode,
            rating:rating,
            catalogCategory: catalogCategory,
            madeIt: madeIt
          }}},{new:true})
          .then(function(doc){
            req.session.theUser = doc;
            res.redirect('/myItems');
          });
        });
      }
        else {
          console.log("Already saved item");
          res.redirect('/myItems');
        }
    });

  }
  else{
    var userId = 1;
    var userDetails = ProfileController.getUser(userId);
    userDetails.then(function(doc){
      User.UserModel.findOne({userId:userId,"user_item.itemCode":itemCode},{"user_item.$":1})
        .then(function(doc){
          if(doc==null){
            getItem(itemCode).then(function(docs){
              console.log("Item to be updated: "+docs[0].itemName);
              for(var i=0;i<docs.length;i++){
                var itemName = docs[i].itemName;
                var rating = docs[i].rating;
                var catalogCategory = docs[i].catalogCategory;
                var madeIt = false;
              }
              User.UserModel.findOneAndUpdate({userId:userId},
                {$push:{user_item: {
              itemName:itemName,
              itemCode:itemCode,
              rating:rating,
              catalogCategory: catalogCategory,
              madeIt: madeIt
            }}},{new:true})
            .then(function(doc){
              req.session.theUser = doc;
              res.redirect('/myItems');
            });
          });
        }
          else {
            console.log("User has already saved this item");
            res.redirect('/myItems');
          }
      });
    });
  }
});

router.post('/feedback/update/:itemCode',function(req,res){
  var rating = req.body.rating;
  var itemCode = req.body.itemCode;
  var tempsession = req.session.theUser;
  var madeIt = req.body.madeItRadio;

    
  if(req.session.theUser){
    var userId = tempsession.userId;
    User.UserModel.findOne({userId: userId,'user_item.itemCode':itemCode})
        .then(function(doc){
            if(doc!=null){
                if(req.body.feedbackHidden == 'rating'){
                    addItemRating(itemCode,userId,rating).then(function(doc){
                        ItemData.ItemModel.findOneAndUpdate({itemCode:itemCode},{$set:{rating:rating}},{new:true}).then(function(doc){
                              console.log("Data inside update: "+doc);
                            });
                            req.session.theUser = doc;
                            res.redirect('/myItems');
                          });
                        }
                        else if(req.body.feedbackHidden == 'madeIt'){
                          addMadeIt(itemCode,userId,madeIt).then(function(doc){
                            req.session.theUser = doc;
                            res.redirect('/myItems');
                          });
                        }
                      }
              else{
                console.log("Invalid Rating");
                res.redirect('/myItems');
              }
            });
  }
  else{
    var userId = 1;
    User.UserModel.findOne({userId: userId,'user_item.itemCode':itemCode})
        .then(function(doc){
            if(doc!=null){
                if(req.body.feedbackHidden == 'rating'){
                    addItemRating(itemCode,userId,rating).then(function(doc){
                      ItemData.ItemModel.findOneAndUpdate({itemCode:itemCode},{$set:{rating:rating}},{new:true}).then(function(doc){
                            console.log("Data to be updated: "+doc);
                          });
                            req.session.theUser = doc;
                            res.redirect('/myItems');
                          });
                        }
                        else if(req.body.feedbackHidden == 'madeIt'){
                          addMadeIt(itemCode,userId,madeIt).then(function(doc){
                            req.session.theUser = doc;
                            res.redirect('/myItems');
                          });
                        }
                  }
              else{
                console.log("Invalid Rating");
                res.redirect('/myItems');
              }
        });
  }
});


router.get('/myItems/delete/:itemCode', function (req, res) {
  console.log("Delete item");
  let itemCode = req.params.itemCode;
  var tempsession = req.session.theUser;
  console.log("Item to be deleted "+itemCode);
  var id = tempsession.userId;
  User.UserModel.findOneAndUpdate({userId: id},
  {$pull:{user_item: {itemCode: itemCode}}},{new:true})
  .then(function(doc){
    req.session.theUser = doc;
    console.log("Item deleted "+doc);
    res.redirect('/myItems');
    console.log("Redirecting");
  });
});


var getAllItems = new Promise(function(resolve,reject){
  var items = [];
  ItemData.ItemModel.find()
    .then(function(doc){
      for(var i=0;i<doc.length;i++){
        var item = new ItemData.Item(doc[i].itemCode,
                doc[i].itemName,
                doc[i].catalogCategory,
                doc[i].description,
                doc[i].rating,
                doc[i].getimageURL);

          items.push(item);
      }
      resolve(doc);
      return items;
    }).catch(function(err){
      reject(err);
    });
});


var getItem = function(itemCode){
  return new Promise(function(resolve,reject){
    var items = [];
    ItemData.ItemModel.find({itemCode:itemCode})
      .then(function(doc){
        for(var i=0;i<doc.length;i++){
          var item = new ItemData.Item(doc[i].itemCode,
                  doc[i].itemName,
                  doc[i].catalogCategory,
                  doc[i].description,
                  doc[i].rating,
                  doc[i].getimageURL);
            items.push(item);
        }
        resolve(doc);
        return items;
      }).catch(function(err){
        reject(err);
      })
  });
};

var addItemRating = function(itemCode,userId,rating){
  return new Promise(function(resolve,reject){
    var change = [];
      User.UserModel.findOneAndUpdate({userId:userId,'user_item.itemCode':itemCode},
        {$set:{'user_item.$.rating':rating}},{new:true}).then(function(doc){
          change.push(doc);
          resolve(doc);
          return change;
        }).catch(function(err){
          reject(err);
          console.log("Error: "+err);
        });
  })
}

var addMadeIt = function(itemCode,userId,madeIt){
  return new Promise(function(resolve,reject){
    var change = [];
    User.UserModel.findOneAndUpdate({userId:userId,'user_item.itemCode':itemCode},
      {$set:{'user_item.$.madeIt':madeIt}},{new:true}).then(function(doc){
        change.push(doc);
        resolve(doc);
        return change;
      }).catch(function(err){
        reject(err);
        console.log("Error: "+err);
      });
  })
}

module.exports.getItem = getItem;
module.exports = router;
