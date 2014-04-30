
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/babynote", {native_parser:true});
db.bind("growthes");

exports.list = function() {
  return function(req, res) {
    db.growthes.find().sort({_id: -1}).toArray(function (err, items) {
      items.forEach(function(item, index, array){
        item.insertAt = utils.formatDatetime(item._id.getTimestamp().getTime());
      });
      res.json(items);
    })
  }
};
