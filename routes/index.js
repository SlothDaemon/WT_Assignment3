var express = require('express');
var router = express.Router();


// For pages in pages, catch the session's user, permission level and messages (if any) for use in the dynamic sites.
pages = ['/','/index','/assessment','/bernerslee','/features','/history','/w3c']
router.all(pages, function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.permissionlevel = req.session.permissionlevel;
  res.locals.msgs = req.session.messages || [];
  req.session.messages = [];
  next();
});

// GET page, set title and description for each
router.get(['/', '/index','/index.html'], function(req, res, next) {
  res.render('index', { title: 'Advances in HTML5 Technology', description: "This website is all about HTML5, its new features, its rich history and more!"});
});

router.get(['/assessment', '/assessment.html'], function(req,res,next){
  res.render('assessment', { title: 'Assessment', description: 'Assess your knowledge of HTML5, W3C and Tim Berners-Lee!.'});
});

router.get(['/bernerslee', '/bernerslee.html'], function(req, res, next) {
  res.render('bernerslee', { title: "Tim Berners-Lee", description: 'A biography of the creator of the World Wide Web, and the founder of the World Wide Web Consortium (W3C), Tim Berners-Lee.'});
});

router.get(['/features', '/features.html'], function(req,res,next){
  res.render('features', { title: 'Features', description: 'An inculsive but succinct description of the new features in HTML5.'});
});

router.get(['/history', '/history.html'], function(req,res,next){
  res.render('history', { title: 'History', description: 'A history lesson of HTML, W3C and WHATWG and how they are involved in the creation of HTML5.'});
});

router.get(['/w3', '/w3c','/w3c.html'], function(req, res, next) {
  res.render('w3c', { title: "W3C", description: 'A description of the World Wide Web Consortium (W3C) founded by Tim Berners-Lee.' });
});

// AJAX GET request for Assessment page load
router.get('/load', function(req, res){
  if (req.session.user == null){
    loadNoLogin(req,res);
  }
  else{
    loadWithUser(req,res);
  }
});

// AJAX GET request for Assessment page after something is clicked
router.get('/click', function(req,res){
  if(req.query.type == 'topic'){
    topicClicked(req,res);
  }
  else if(req.query.type == 'quiz'){
    quizClicked(req,res);
  }
  else if(req.query.type == 'question'){
    questionClicked(req,res);
  }
  else if(req.query.type == 'home'){
    homeClicked(req,res);
  }
});

router.get('/answer', function(req,res){
  evalAns(req,res);
})

module.exports = router;
