var logger = require("log4js").getLogger();
var utils = require("./utils");
var collection_name = "notes";
var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs = require('fs');
var mongo = require('mongoskin');
var BSON = mongo.BSONPure;
/*
 *
 * GET notelist page.
 */

exports.notelist = function(db) {
  return function(req, res) {
    db.collection(collection_name).find().sort({_id: -1}).toArray(function (err, items) {
      items.forEach(function(item, index, array){
        item.insertAt = utils.formatDatetime(item._id.getTimestamp().getTime());
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
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(util.inspect({fields: fields, files: files}));
      var noteImage = files.noteImage;
      var imageFile = fs.readFileSync(noteImage.path);
      fields.img = {
        file: new BSON.Binary(imageFile),
        name: noteImage.name,
        type: noteImage.type,
        lastModifiedDate: noteImage.lastModifiedDate,
      };

      db.collection(collection_name).insert(fields, function(err, result){
        result[0].insertAt = utils.formatDatetime(result[0]._id.getTimestamp().getTime());
        result[0].img.file = "";
        console.log(util.inspect(result));
        err === null ? res.json(result) : res.send({msg: err});
      });

    });


  }
};
/*
 * DELETE to deletenote.
 */

exports.deletenote = function(db) {
  return function(req, res) {
    var noteToDelete = req.params.id;
    db.collection(collection_name).removeById(noteToDelete, function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
  }
};
