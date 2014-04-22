var logger = require("log4js").getLogger();
var moment = require("moment");

var formatDate = function(timeInMS) {
  return moment(timeInMS).format("HH:mm MM-DD-YYYY");
};
/*
 * GET notelist page.
 */

exports.notelist = function(db) {
  return function(req, res) {
    db.collection('notelist').find().sort({_id: -1}).toArray(function (err, items) {
      items.forEach(function(item, index, array){
        item.insertAt = formatDate(item._id.getTimestamp().getTime());
      });
      res.json(items);
    })
  }
};

/*
 * POST to addnote.
 */

exports.addnote = function(db) {
  return function(req, res) {
    db.collection('notelist').insert(req.body, function(err, result){
      result[0].insertAt = formatDate(result[0]._id.getTimestamp().getTime());
      //logger.info(result);
      err === null ? res.json(result) : res.send({msg: err});
    });
  }
};

/*
 * DELETE to deletenote.
 */

exports.deletenote = function(db) {
  return function(req, res) {
    var noteToDelete = req.params.id;
    db.collection('notelist').removeById(noteToDelete, function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
  }
};
