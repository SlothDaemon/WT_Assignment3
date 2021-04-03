var express = require('express');
var router = express.Router();

pages = ['/','/assessment','/bernerslee','/features','/history','/w3c'];
router.all(pages, function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.msg = req.session.message;
  res.locals.typ = req.session.messagetype;
  req.session.message = undefined;
  req.session.messagetype = undefined;
  next();
});

/* GET home page. */
router.get(['/', '/index','/index.html'], function(req, res, next) {
  res.render('index', { title: 'Advances in HTML5 Technology', description: "This website is all about HTML5, its new features, its rich history and more!"});
});

router.get(['/assessment', '/assessment.html'], function(req,res,nesxt){
  res.render('assessment', { title: 'Assessment', description: 'Assess your knowledge of HTML5, W3C and Tim Berners-Lee!.'});
});

router.get(['/bernerslee', '/bernerslee.html'], function(req, res, next) {
  res.render('bernerslee', { title: "Tim Berners-Lee", description: 'A biography of the creator of the World Wide Web, and the founder of the World Wide Web Consortium (W3C), Tim Berners-Lee.'});
});

router.get(['/features', '/features.html'], function(req,res,nesxt){
  res.render('features', { title: 'Features', description: 'An inculsive but succinct description of the new features in HTML5.'});
});

router.get(['/history', '/history.html'], function(req,res,nesxt){
  res.render('history', { title: 'History', description: 'A history lesson of HTML, W3C and WHATWG and how they are involved in the creation of HTML5.'});
});

router.get(['/w3', '/w3c','/w3c.html'], function(req, res, next) {
  res.render('w3c', { title: "W3C", description: 'A description of the World Wide Web Consortium (W3C) founded by Tim Berners-Lee.' });
});


module.exports = router;
