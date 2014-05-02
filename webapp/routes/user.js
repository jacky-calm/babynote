// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/babynote", {native_parser:true});
var collection_name = "users";

exports.findById = function (id, fn) {
  console.log("find user by id");
  db.collection(collection_name).findOne({id: id}, function (err, user){
    console.log(JSON.stringify(user));
    if(user)
      findChildren(user, fn);
    else
      fn("user is not found by the id: "+id, null);
  });
}
var findChildren = function(user, fn){
  console.log("find children of user");
  db.collection("babies").find({mother_id: user._id}).toArray(function (err, children){
    console.log(JSON.stringify(children));
    if(children) {
      user.children = children;
    }
    fn(null, user);
  });
}
exports.findByUsername = function (username, fn) {
  console.log("find user by username");
  db.collection(collection_name).findOne({username: username}, function (err, user){
    console.log(JSON.stringify(user));
    if(user)
      findChildren(user, fn);
    else
      fn("user is not found by the username: "+username, null);
  });
}
/*
 * GET userlist page.
 */

exports.userlist = function(db) {
  return function(req, res) {
    db.collection(collection_name).find().toArray(function (err, items) {
      res.json(items);
    });
  }
};

/*
 * POST to adduser.
 */

exports.adduser = function(db) {
  return function(req, res) {
    db.collection(collection_name).insert(req.body, function(err, result){
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  }
};

/*
 * DELETE to deleteuser.
 */

exports.deleteuser = function(db) {
  return function(req, res) {
    var userToDelete = req.params.id;
    db.collection(collection_name).removeById(userToDelete, function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
  }
};
