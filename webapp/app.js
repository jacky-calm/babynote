
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var note = require('./routes/note')
var login = require('./routes/login')
var http = require('http');
var path = require('path');
var log4js = require('log4js');
var flash = require('connect-flash')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/babynote", {native_parser:true});

// Passport session setup.
// // To support persistent login sessions, Passport needs to be able to
// // serialize users into and deserialize users out of the session. Typically,
// // this will be as simple as storing the user ID when serializing, and finding
// // the user by ID when deserializing.

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
      done(err, user);
    });
});
function findById(id, fn) {
  fn(null, { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' });
}
function findByUsername(username, fn) {
  fn(null, { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' });
}

// Use the LocalStrategy within Passport.
// // Strategies in passport require a `verify` function, which accept
// // credentials (in this case, a username and password), and invoke a callback
// // with a user object. In the real world, this would query a database;
// // however, in this example we are using a baked-in set of users.
//
passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser() );
app.use(express.session({ secret: 'keyboard cat' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
app.get('/', ensureAuthenticated, routes.index);
app.get('/login', login.form);
app.get('/logout', login.logout);
app.post('/login', login.login(db));
app.get('/notelist', note.notelist(db));
app.post('/addnote', note.addnote(db));
app.delete('/deletenote/:id', note.deletenote(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

