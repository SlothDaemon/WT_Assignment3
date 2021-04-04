const Joi = require('joi');
const e = require('express');
const session = require('express-session');
var hash = require('pbkdf2-password');
var hasher = hash();
var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('logins');  

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

function addMessage(req, type, message){
  req.session.messages.push([type, message]);
}

function errors(err) {
  //Copypasta'd code from app.js, no idea how to do this better without cyclically inporting 
  if (err){
    // Custom error handler (custom flash message system)
    res.locals.user = req.session.user
    res.locals.msgs = req.session.messages || [];
    res.locals.msgs.push(['error', 'Error ' + err.status + ' ' + err.message]);
    
    /* // verbose error page (too verbose for production, please comment out for end product)
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.locals.title = "Error " + err.status;
    res.render('error'); */
    res.redirect('back');
  }
}

//dummy db (read, 'plain javascript object')
var users = {
  admin: { name: 'admin' }
};

// EXAMPLE FROM: https://github.com/expressjs/express/blob/master/examples/auth/index.js
// REMOVE CODE LATER (it's terrible in production anyway)
// when you create a user, generate a salt
hasher({password: 'donotsteal' }, function(err, pass, salt, hash){
  if (err) throw err;
  // store the salt & hash in the 'db'
  users.admin.salt = salt;
  users.admin.hash = hash;
});


function auth(name, pass, f){
  // console.log('authing: ' + name + ' with pass: ' + pass)
  let user = users[name];
  if (!user) return f(new Error('User not found'));
  else {
    hasher({password:pass, salt: user.salt}, function(err, pass, salt, hash){
      if (err) return f(err);
      else if (hash === user.hash) return f(null, user);
      else f(new Error('Invalid password'));
    })
  }
}


/* Catches ALL POST requests. Currently, only POST request is the login file. 
Furthermore, it also catches on which page it happened */
pages = ['/','/assessment','/bernerslee','/features','/history','/w3c'];
login.post(pages, function(req,res){
  if (req.body.login) {
    const { error, value } = schema.validate({ username: req.body.username, password: req.body.password });
    if (!error){
      // TODO: Make a database and check wehther the provided credentials exist and correspond
      auth(req.body.username, req.body.password, function(err, user){
        if (user){
          req.session.regenerate(errors);
          req.session.user = user.name;
          addMessage(req,'ok',"Logged in successfully!");
          res.redirect('back'); 
        }
        else {
          addMessage(req,'warning',"Username or password invalid");
          res.redirect('back'); 
        }
      })
      
    }
    else {
      addMessage(req,'error',error.message);
      res.redirect('back');
    }
  }
  
  else if (req.body.register) {
    const { error, value } = schema.validate({ username: req.body.username, password: req.body.password });
    if (!error){
      // TODO: Add login securely to database
      let newUser = req.body.username;
      users.push({name: newUser})
      hasher({password: req.body.password }, function(err, pass, salt, hash){
        if (err) throw err;
        // store the salt & hash in the 'db'
        users[newUser].salt = salt;
        users[newUser].hash = hash;
      });

      req.session.regenerate(errors);
      req.session.user = req.body.username;
      addMessage(req,'ok',"Registered successfully!");
      res.redirect('back'); 
    }
    else {
      addMessage(req,'error',error.message);
      res.redirect('back');
    }
  }

  else if (req.body.logout) {
    req.session.destroy(errors);
    res.redirect('back');
  }

  else {
    addMessage(req,'warning',"A POST request happened, but went unhandled");
    res.redirect('back');
  }
});

module.exports = login;