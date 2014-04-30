var logger = require("log4js").getLogger();
var utils = require("./utils");
var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fs = require('fs');
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/babynote", {native_parser:true});
var BSON = mongo.BSONPure;
db.bind("notes");
/*
 *
 * GET notelist page.
 */

exports.notelist = function() {
  return function(req, res) {
    db.notes.find().sort({_id: -1}).toArray(function (err, items) {
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

exports.addnote = function() {
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

      db.notes.insert(fields, function(err, result){
        result[0].insertAt = utils.formatDatetime(result[0]._id.getTimestamp().getTime());
        result[0].img = undefined;
        console.log(util.inspect(result));
        err === null ? res.json(result) : res.send({msg: err});
      });

    });


  }
};

exports.img = function() {
  return function(req, res) {
    db.notes.findById(req.params.id, function(err, result) {
      console.log(util.inspect(result));
      if(err) {
        res.json(err, 400)
      } else if (!result || !result.img || !result.img.type || !result.img.file) {
        res.send(404);
      } else {
        res.contentType(result.img.type);
        res.end(result.img.file.buffer, "binary");
      }
    });
  }
};

/*
 * DELETE to deletenote.
 */

exports.deletenote = function() {
  return function(req, res) {
    var noteToDelete = req.params.id;
    db.notes.removeById(noteToDelete, function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
  }
};
