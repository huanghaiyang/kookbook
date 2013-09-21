/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');
var crypto = require('crypto');
var partials = require('express-partials');
var MongoStore = require("connect-mongo")(express);
var settings = require("./settings");
var flash = require("connect-flash");
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.set('view options', {
  layout: true
});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
  uploadDir: './uploads'
}));
app.use(express.cookieParser());
app.use(flash());
app.use(express.session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    db: settings.db
  }),
  cookie: {
    maxAge: settings.maxAge
  }
}));
app.use(function(req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
});
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
routes(app);
app.all('*', function(req, res) {
  res.render("404");
});
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});