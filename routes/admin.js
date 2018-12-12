var express = require('express');
var router = express.Router();   
var User =	require('../models/users');
var bcrypt = require('bcrypt');

router.get('/',isAdmin, function(req, res, next) { 
    User.find({}, function(err, users) { 
        res.render('admin/user_list', 
        { 
        name: '유저목록',
        title: '관리자 - 유저 목록' ,
        users: users
        });
    });
  });


  
router.put('/users/:id', isAdmin, (req, res, next) => {
    User.findById({_id: req.params.id}, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('danger', '존재하지 않는 유저 입니다.');
        return res.redirect('back');
      } 
      user.name = req.body.name;
      user.email = req.body.email;
		
      if (req.body.password) {
		var salt = 10;
		bcrypt.hash(req.body.password,salt, function(err,hash) { //패스워드 해싱
			if(err) throw err; 
			user.password = hash; 
		}); 
      }
      
      user.isAdmin = req.body.isAdmin==="on"?1:0;
      user.save(function(err) {
        if (err) {
          return next(err);
        }
        req.flash('success', '성공적으로 수정되었습니다.');
        res.redirect('/admin');
      });
    });
  });

router.get('/users/:id/edit', isAdmin, (req, res, next) => {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        return next(err);
      }
      res.render('admin/user_edit',
	    {
	      name: '유저목록',
	      title: '관리자 - 사용자 정보 수정' ,
		   user: user,
	    });
    });
  });


router.delete('/users/:id', isAdmin, (req, res, next) => {
    User.findOneAndRemove({_id: req.params.id}, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Deleted Successfully.');
      res.redirect('/users');
    });
  });
  
   
function isAdmin(req,res,next) {
    if(req.isAuthenticated() && req.user.isAdmin) {
        return next();
    } 
    res.redirect('/');
}

module.exports = router;