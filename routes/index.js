var express = require('express');
var router = express.Router();

function needAuth(req,res,next) {
	if(req.isAuthenticated()) {
		return next();
	} 
	res.redirect('/users/signin');
}
/* GET home page. */
router.get('/',needAuth, function(req, res, next) { 
	res.redirect('/project');
});

 
module.exports = router;
