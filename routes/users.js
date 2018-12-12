var express = require('express');
var router = express.Router(); 
var User 			= 	require('../models/users');
var bcrypt 			= 	require('bcrypt');
var passport		= 	require('passport');
var localStrategy	=	require('passport-local').Strategy;


/* GET users listing. */
router.get('/',needAuth, function(req, res, next) {
  res.send('respond with a resource');
});
  
function needAuth(req,res,next) {
	if(req.isAuthenticated()) {
		return next();
	} 
	res.redirect('/users/signin');
}
router.get('/signup', function(req, res, next) {
  res.render('signup', 
  { 
    name: '가입',
    title: 'mju_express - 가입' 
  });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', 
  { 
    name: '로그인',
    title: 'mju_express - 로그인' 
  });
});

router.post('/signup',function(req,res,next) {

	//Get Form Values
	var name 			=	 req.body.name;
	var email 			=	 req.body.email;
	var username 		=	 req.body.username;
	var password 		=	 req.body.password;
	var confirmPassword	=	 req.body.confirmPassword;
  
	//form Validation using Express-Validator
	req.checkBody( 'name','Name Field is Required').notEmpty();
	req.checkBody( 'email','Email Field is Required').notEmpty();
	req.checkBody('email','Email not Valid').isEmail();
	req.checkBody('username','Username Field is Required').notEmpty();
	req.checkBody('password','Password Field is Required').notEmpty();
	req.checkBody('confirmPassword','Passwords do not Match').equals(req.body.password);

	//Check for Errors
	var errors = req.validationErrors();

	if(errors) {
		res.render('signup',{
			errors 			: 	errors,
			name 			: 	name,
			email 			: 	email,
			username 		: 	username,
			password 		: 	password,
			confirmPassword : 	confirmPassword
		});
	} else { 
		var newUser	= new User({
			name 		: 	name,
			email 		: 	email,
			username 	: 	username,
			password 	: 	password, 
		});
    console.log(password); 
		console.log(newUser);
		
		var salt = 10;

		bcrypt.hash(newUser.password,salt, function(err,hash) {
			if(err) throw err;
 
			newUser.password = hash;
 
			newUser.save(newUser,function(err,user) {
				if(err)  throw err;
				console.log(user);
			});
 
			req.flash('success','You are now registered and may log in');

			res.location('/');
			res.redirect('/');
			});
	}

});


 

passport.serializeUser(function(user, done) {
  done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
	});
});

var comparePassword = function(candidatePassword,hash,callback) {
	bcrypt.compare(candidatePassword,hash,function(err, isMatch) {
		if(err) return callback(err);
		callback(null,isMatch);
	});
};
var t;

passport.use(new localStrategy(
	function(username, password, done) {
		User.find({username : username}, function(err,user) {
			
			if(err) throw err;
			if(user.length === 0) {
				console.log('Unknown User');
				return done(null,false,{message: 'Unknown User'});
			} 
			
			comparePassword(password,user[0].password, function(err,isMatch) {
				if(err) throw err;
				if(isMatch) {  
					t= user;
					return done(null, user);  
				} else {
					console.log('Invalid Password');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});
}));
 
router.post('/signin',passport.authenticate('local',{failureRedirect:'/users/signin',failureFlash:'Invalid Username or Password'}), function(req,res) {

	//If Local Strategy Comes True
	req.session.user = t;
	console.log('Authentication Successful');
	req.flash('success','You are Logged In');
	res.redirect('/');

});
router.get('/logout', function(req,res) { 
	req.logout();
	req.flash('success','You have logged out');
	res.redirect('/users/signin');
});

module.exports = router;
