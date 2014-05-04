
var util = require('util');
var utils = require("./utils");
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/babynote", {native_parser:true});
db.bind("notes");

exports.growthList = function() {
  return function(req, res) {
    var userId = req.params.id;
    var name = req.params.name;
//  console.log('find height list');
    var selector = {};
    selector["growth."+name] = {$gt:0};
    var fields = [];
    fields["growth."+name] = true;
    fields["growth.growthDate"] = true;
    fields["_id"] = false;

    db.notes.find(selector, fields).sort({"growth.growthDate": 1}).toArray(function (err, items) {
      items.forEach(function(item, index, array){
        item.days = utils.asDays(item.growth.growthDate, utils.parseDate("07-29-2012"));
        item.value = item.growth[name];
        item.growth = undefined;
        console.log(item);
      });
      res.json(items);
    })
  }
};
