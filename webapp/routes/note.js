/*
 * GET notelist page.
 */

exports.notelist = function(db) {
  return function(req, res) {
    db.collection('notelist').find().toArray(function (err, items) {
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
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
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
