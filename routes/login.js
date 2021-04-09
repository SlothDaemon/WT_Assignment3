const Joi = require('joi');
const e = require('express');
const session = require('express-session');
var hash = require('pbkdf2-password');
var hasher = hash();

var fs = require('fs');
var loginDbFile = 'public/sql/login.db';
var loginDbFileExists = fs.existsSync(loginDbFile);
var sqlite3 = require('sqlite3').verbose();
var loginDb = new sqlite3.Database(loginDbFile);

var profileDbFile = 'public/sql/profile.db';
var profileDbFileExists = fs.existsSync(profileDbFile);
var profileDb = new sqlite3.Database(profileDbFile);

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

const bio = Joi.object({
  bioContent: Joi.string()
    .max(1024)
    .pattern(new RegExp('[a-zA-Z0-9!,.]'))
})

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

loginDb.serialize(function(){
  if (!loginDbFileExists) {
    loginDb.run("CREATE TABLE LOGINS (username TEXT NOT NULL, salt HASHBYTES NOT NULL, hash HASHBYTES NOT NULL, permissionlevel INTEGER NOT NULL)");
    var stmt = loginDb.prepare('INSERT INTO LOGINS VALUES (?,?,?,?)');
    hasher({password: 'opensesame'}, function(err, pass, salt, hash){
      if (err)  throw err; 
      stmt.run('admin', salt, hash, 3);
      stmt.finalize();
    });
    console.log('added admin to loginDb');
  }
});

function auth(name, pass, f){
  let query = 'SELECT rowid AS id, username, salt, hash, permissionlevel FROM LOGINS WHERE (username="'+name+'")';
  loginDb.get(query, function(err,row){
    if (!row) return f(new Error('User not found'));
    else {
      hasher({password: pass, salt: row.salt}, function(error, passw, salt, hash){
        if (error) return f(error);
        else if (hash === row.hash) return f(null, row.username, row.permissionlevel);
        else f(new Error('Invalid password'));
      });
    }
  });
}

/* Catches ALL POST requests. Currently, only POST request is the login loginDbFile. 
Furthermore, it also catches on which page it happened */
pages = ['/','/assessment','/bernerslee','/features','/history','/w3c'];
login.post('*', function(req,res){
  if (req.body.login) {
    const { error, value } = schema.validate({ username: req.body.username, password: req.body.password });
    if (!error){
      loginUser(req, res, req.body.username, req.body.password);
    }
    else {
      addMessage(req,'error',error.message);
      res.redirect('back');
    }
  }
  
  else if (req.body.register) {
    const { error, value } = schema.validate({ username: req.body.username, password: req.body.password });
    if (!error){
      registerNewUser(req, res, req.body.username, req.body.password);
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


  else if (req.body.newBio) {
    profileDb.run('UPDATE PROFILES SET bio = ? WHERE username=?;',[
      req.body.bioTextBox,
      req.session.user
    ],function(error){
      if (error){
        console.log(error);
        addMessage(req,'error',error.message);
        res.redirect('back');
      }
      else {
        addMessage(req,'ok','Bio successfully updated!');
        res.redirect('back');
      }
    });
  }

  else {
    addMessage(req,'warning',"A POST request happened, but went unhandled");
    res.redirect('back');
  }
});

function loginUser(req, res, existingUser, existingPass){
  auth(existingUser, existingPass, function(err, user, permissionlevel){
    if (user){
      req.session.regenerate(errors);
      req.session.user = user;
      req.session.permissionlevel = permissionlevel;
      addMessage(req,'ok',"Logged in successfully!");
      res.redirect('back'); 
    }
    else {
      addMessage(req,'warning',"Username or password invalid");
      res.redirect('back'); 
    }
  })
}

function registerNewUser(req, res, newUser, newPass){
  let query = 'SELECT rowid AS id, username FROM LOGINS WHERE (username="'+ newUser +'");';
  loginDb.get(query, function(err,row){
    if (row) {
      addMessage(req,'error','Username ' + newUser + ' already taken.');
      res.redirect('back');
    }
    else {
      loginDb.serialize(function(){
        var stmt = loginDb.prepare('INSERT INTO LOGINS VALUES (?,?,?,?)');
        hasher({password: newPass}, function(err, pass, salt, hash){
          if (err) throw err; 
          stmt.run(newUser, salt, hash, 1);
          stmt.finalize();
        });
        console.log('added regular user ' + newUser + ' to loginDb');
      });

      profileDb.serialize(function(){
        var stmt = profileDb.prepare('INSERT INTO PROFILES VALUES (?,?,?)');
        stmt.run(newUser,"",0);
        stmt.finalize();
      })

      addMessage(req,'ok',"Registered successfully! Please log in.");
      res.redirect('back'); 
    }
  });
}

module.exports = login;