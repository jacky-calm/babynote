
exports.form = function(req, res){
  res.render('login', { title: 'Login' });
};

exports.auth = function(db) {
  return function(req, res) {
    db.collection('notelist').find().sort({_id: -1}).toArray(function (err, items) {
      items.forEach(function(item, index, array){
        item.insertAt = formatDate(item._id.getTimestamp().getTime());
      });
      res.json(items);
    })
  }
};
