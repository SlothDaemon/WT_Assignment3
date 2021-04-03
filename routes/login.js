const Joi = require('joi');
const e = require('express');
const session = require('express-session');
var hash = require('pbkdf2-password');

var login = e.Router();

const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .max(30)
      .required(),

    password: Joi.string()
      .max(30)
      .pattern(new RegExp('[a-zA-Z0-9#!@$%]'))
});

function errors(err) {
  //Copypasta'd code from app.js, no idea how to do this better without cyclically inporting 
  if (err){
    res.locals.message = err;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.locals.title = "Error " + err;
    res.render('error');
  }
}

//dummy db (read, 'plain javascript object')
var users = {
  admin: { name: 'admin' }
};

// EXAMPLE FROM: https://github.com/expressjs/express/blob/master/examples/auth/index.js
// REMOVE CODE LATER (it's terrible in production anyway)
// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)
hash({password: 'donotsteal' }, function(err, pass, salt, hash){
  if (err) throw err;
  // store the salt & hash in the 'db'
  users.admin.salt = salt;
  users.admin.hash = hash;
});


/* Catches ALL POST requests. Currently, only POST request is the login file. 
Furthermore, it also catches on which page it happened */
pages = ['/','/assessment','/bernerslee','/features','/history','/w3c'];
login.post(pages, function(req,res){
  if (req.body.login) {
    const { error, value } = schema.validate({ username: req.body.username, password: req.body.password });
    if (!error){
      // TODO: Make a database and check wehther the provided credentials exist and correspond
      req.session.regenerate(errors);
      req.session.user = req.body.username;
      req.session.message = "Logged in successfully!";
      req.session.messagetype = 'ok';
      res.redirect('back'); 
    }
    else {
      req.session.message = error.message;
      req.session.messagetype = 'error';
      res.redirect('back');
    }
  }
  

  else if (req.body.register) {
    const { error, value } = schema.validate({ username: req.body.username, password: req.body.password });
    if (!error){
      // TODO: Add login securely to database
      req.session.regenerate(errors);
      req.session.user = req.body.username;
      req.session.message = "Registered successfully!";
      req.session.messagetype = 'ok';
      res.redirect('back'); 
    }
    else {
      req.session.message = error.message;
      req.session.messagetype = 'error';
      res.redirect('back');
    }
  }

  else if (req.body.logout) {
    req.session.destroy(function(){
      res.locals.user = undefined;
      res.redirect('back');
    });
  }


  else {
    req.session.message = "A POST request happened, but went unhandled";
    req.session.messagetype = 'warning';
    res.redirect('back');
  }
});

module.exports = login;