const Joi = require('joi');
const e = require('express');
const session = require('express-session');
var hash = require('pbkdf2-password');
var hasher = hash();
var path = require('path');

var fs = require('fs');
var dbFile = path.resolve(__dirname, '../sql/html5.db'); //'/sql/html5.db';
var dbFileExists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

const dbDef = ['CREATE TABLE Topic(TID INT NOT NULL PRIMARY KEY,T_Title varchar(255),Descriptionlink varchar(255));', 
               'CREATE TABLE Quiz(QID INT NOT NULL PRIMARY KEY,Q_Title varchar(255),Topic INT,FOREIGN KEY (Topic) REFERENCES Topic(TID));',
               'CREATE TABLE Question(QAID INT NOT NULL PRIMARY KEY,QA_Title varchar(255),Type varchar(255),Problem_Statement varchar(255),Answer varchar(255),Quiz INT,FOREIGN KEY (Quiz) REFERENCES Quiz(QID));',
               'CREATE TABLE PROFILES (username TEXT NOT NULL, bio TEXT, completion INTEGER,question INT,FOREIGN KEY (question) REFERENCES Question(QAID));',
               'CREATE TABLE LOGINS (username TEXT NOT NULL, salt HASHBYTES NOT NULL, hash HASHBYTES NOT NULL, permissionlevel INTEGER NOT NULL);',
               'CREATE TABLE Attempt(Question INT,User varchar(255),Attempt varchar(255),FOREIGN KEY (Question) REFERENCES Question(QID),FOREIGN KEY (User) REFERENCES PROFILES(username));',
               'CREATE TABLE MultipleChoice(question INT NOT NULL,option1 varchar(255),option2 varchar(255),option3 varchar(255),option4 varchar(255),FOREIGN KEY (question) REFERENCES Question(QAID))']

var login = e.Router();

// Create a verification schema using Joi to sanitize data inputs
const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .max(30)
      .required(),

    password: Joi.string()
      .max(30)
      .pattern(new RegExp('[a-zA-Z0-9#!@$%]'))
});

// Add messages to the user with my custom flash message system
function addMessage(req, type, message){
  req.session.messages.push([type, message]);
}

function errors(err) {
  //Copypasta'd code from app.js, no idea how to do this better without cyclically inporting app.js in here
  if (err){
    // Custom error handler (custom flash message system)
    res.locals.user = req.session.user
    res.locals.msgs = req.session.messages || [];
    res.locals.msgs.push(['error', 'Error ' + err.status + ' ' + err.message]);
    res.redirect('back');
  }
}

// Initialize the admin's credentials and profile if the db doesn't exist yet
db.serialize(function(){
  if (!dbFileExists) {
    for (const command of dbDef){
      db.run(command);
    }
    var stmt = db.prepare('INSERT INTO LOGINS VALUES (?,?,?,?)');
    hasher({password: 'opensesame'}, function(err, pass, salt, hash){
      if (err)  throw err; 
      stmt.run('admin', salt, hash, 3);
      stmt.finalize();
    });
    var stmt2 = db.prepare('INSERT INTO PROFILES VALUES (?,?,?,?)');
    stmt2.run('admin',"Hi, I'm admin!",12,null);
    stmt2.finalize();
    console.log('added admin to db');
  }
});

// Authentication function with callback 
function auth(name, pass, f){
  let query = 'SELECT rowid AS id, username, salt, hash, permissionlevel FROM LOGINS WHERE (username="'+name+'")';
  db.get(query, function(err,row){
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

/* Catches ALL POST requests
Furthermore, it also catches on which page it happened */
pages = ['/','/assessment','/bernerslee','/features','/history','/w3c'];
login.post('*', function(req,res){
  // If the login button was pressed
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

  // If the register button was pressed
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

  // If the logout button was pressed
  else if (req.body.logout) {
    req.session.destroy(errors);
    res.redirect('back');
  }

  // If the edit bio button was pressed
  else if (req.body.newBio) {
    db.run('UPDATE PROFILES SET bio = ? WHERE username=?;',[
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

  // if some other POST request happens
  else {
    addMessage(req,'warning',"A POST request happened, but went unhandled");
    res.redirect('back');
  }
});

// Check the user's credentials using the auth function and if it exists, log them in and change session variables accordingly
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

// Check if an username exists already and if not create a login and profile
function registerNewUser(req, res, newUser, newPass){
  let query = 'SELECT rowid AS id, username FROM LOGINS WHERE (username="'+ newUser +'");';
  db.get(query, function(err,row){
    if (row) {
      addMessage(req,'error','Username ' + newUser + ' already taken.');
      res.redirect('back');
    }
    else {
      db.serialize(function(){
        var stmt = db.prepare('INSERT INTO LOGINS VALUES (?,?,?,?)');
        hasher({password: newPass}, function(err, pass, salt, hash){
          if (err) throw err; 
          stmt.run(newUser, salt, hash, 1);
          stmt.finalize();
        });
        console.log('added regular user ' + newUser + ' to html5.db');
      });

      db.serialize(function(){
        var stmt = db.prepare('INSERT INTO PROFILES VALUES (?,?,?,?)');
        stmt.run(newUser,"",0,null);
        stmt.finalize();
        console.log('added ' + newUser + 's profile to html5.db');
      })

      addMessage(req,'ok',"Registered successfully! Please log in.");
      res.redirect('back'); 
    }
  });
}

module.exports = login;