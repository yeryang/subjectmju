var createError         = require('http-errors');
var express             = require('express');
var path                = require('path');
var cookieParser        = require('cookie-parser');
var logger              = require('morgan');
var sassMiddleware      = require('node-sass-middleware');

var session				      = require('express-session');
var passport			      = require('passport');  
var expressValidator    = require('express-validator');
var flash 				      =	require('connect-flash'); 

var methodOverride      = require('method-override');
var index               = require('./routes/index');
var users               = require('./routes/users');
var admin               = require('./routes/admin');
var project               = require('./routes/project');

 


var app = express(); 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));


app.locals.moment = require('moment');
app.locals.querystring = require('querystring');
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(expressValidator());  // request 유효성 검사
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
 
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(session({
	secret:'413o31]g-j-3249g932]jg3n]92v9-34vp32f84g3pfp34h' ,
	saveUninitialized: true,
	resave: true
}));
 
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {
	res.locals.messages = require('express-messages')(req,res);
	next();
});

app.get('*', function(req,res,next) {
	//local variable to hold user info
	res.locals.user = req.user ||  null;
	next();
});


app.use('/', index);
app.use('/admin', admin);
app.use('/users', users); 
app.use('/project', project);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


//에러 핸들러
app.use(function(err, req, res, next) { 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; 
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3001);

module.exports = app;
