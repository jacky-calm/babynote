var logger = require("log4js").getLogger();
var passport = require('passport');
exports.form = function(req, res){
  res.render('login', { title: 'Login' });
};

exports.login = function(db) {
  return function(req, res, next) {
  	  console.log("login submit");
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      console.log(info.message);
	      req.session.messages = [info.message];
	      return res.redirect('/login')
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/');
	    });
	  })(req, res, next);
  };


};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
