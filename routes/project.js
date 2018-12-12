var express = require('express');

const User = require('../models/users'); 
const Comment = require('../models/comment'); 
const Project = require('../models/project'); 

var router = express.Router();

function needAuth(req,res,next) {
	if(req.isAuthenticated()) {
		return next();
	} 
	res.redirect('/users/signin');
}


router.get('/:id/edit', needAuth,function (req, res, next) {
  const project =  Project.findById(req.params.id).exec(function(err,pj) { 
	//console.log(pj);
  res.render('project/project_edit', {project: pj});
  });
});

router.post('/:id/edit', function (req, res, next) {
  const project =  Project.findById(req.params.id).exec(function(err,pj) {  
  if (!pj) {
    req.flash('danger', 'Not exist project');
    return res.redirect('back');
  }
  console.log(req.body.content);
  pj.title = req.body.title;
  pj.content = req.body.content;
  pj.category = req.body.category; 
  pj.target = req.body.target; 
  pj.endDate = req.body.endDate; 
  pj.manager = req.body.manager; 
  pj.contact = req.body.contact;  
	  
   pj.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/project');
  });
});
router.get('/new', needAuth, (req, res, next) => {
  res.render('project/project_add',
  {
	  
	  name: '공모전 등록',
	  title: 'mju_express 공모전 등록',
	  project: {}
  });
});

 
router.post('/', needAuth, function( req, res, next) {
  const user = req.session.user[0];
  var project = new Project({ 
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    target: req.body.target,
    endDate: req.body.endDate,
    manager: req.body.manager,
    contact: req.body.contact,
    author: user._id
  });
  console.log(user);
  console.log(project);
  project.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/');
});

router.get('/:id/delete', needAuth, function(req, res, next)  { 
	
  const project =  Project.findById(req.params.id).exec(function(err,pj) {  
  if (!pj) {
    req.flash('danger', 'Not exist project');
    return res.redirect('back');
  }
  pj.remove();
  });
});

router.get('/',needAuth, function(req, res, next) {
	
	
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;  
  var projects = Project.paginate({}, {
    sort: {createdAt: -1}, 
    populate: 'author', 
    page: page, limit: limit
  }, function(err, result) {
    
  res.render('project/project_list', 
  { 
  	projects: result, 
  	query: req.query,
    name: '공모전 목록',
    title: 'mju_express 공모전' 
  });
});  
});

router.post('/:id/comments', needAuth, function (req, res, next) {
  const user = req.session.user[0];
  const project =  Project.findById(req.params.id).exec(function(err,pj) {   

  if (!pj) {
    req.flash('danger', 'Not exist projects');
    return res.redirect('back');
  }

  var comment = new Comment({
    author: user._id,
    targetProject: pj._id,
    content: req.body.content
  });
  comment.save();
  pj.numAnswers++;
  pj.save();

  req.flash('success', 'Successfully answered');
  res.redirect(`/project/${req.params.id}`);
  });
});


router.get('/:id', function(req, res, next){
	console.log(req.params.id);
	Project.findById(req.params.id).populate('author').exec(function(err,pj) { 
		if(!pj) {
		  console.log('Unknown thread');
		  res.redirect('/');
		  return ;
		} 
		console.log(pj);
		console.log(pj.author);
		var comment = Comment.find({targetProject: pj.id}).populate('author').exec(function(err,comments)
		 {
			console.log(comments);
			var author = User.findById(req.params.id).populate('author'); 
			pj.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록??? 
			pj.save();
			res.render('project/project_view', 
			{
			  name: '공모전',
			  title: 'mju_express 공모전',
			  project: pj, 
			  author: author,
			  comments: comments
			});
		});
	});
	  

});

module.exports = router;
