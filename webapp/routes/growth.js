
var util = require('util');
var utils = require("./utils");
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/babynote", {native_parser:true});
db.bind("notes");

exports.heightList = function() {
  return function(req, res) {
//,     console.log('find height list');
    db.notes.find({"growth.height":{$gt:0}}, {"growth.height":true, "growth.growthDate":true, "_id": false}).sort({"growth.growthDate": 1}).toArray(function (err, items) {
      items.forEach(function(item, index, array){
        item.days = utils.asDays(item.growth.growthDate, utils.parseDate("07-29-2012"));
        item.height = item.growth.height;
        item.growth = undefined;
        console.log(item);
      });
      res.json(items);
    })
  }
};
