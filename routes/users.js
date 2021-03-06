var express = require('express');
var router = express.Router();
var hash = require('pbkdf2-password');
var hasher = hash();
var path = require('path');

const Joi = require('joi');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var dbFile = path.resolve(__dirname, '../sql/html5.db');
var dbFileExists = fs.existsSync(dbFile);
var db = new sqlite3.Database(dbFile);
const dbDef = ['CREATE TABLE Topic(TID INT NOT NULL PRIMARY KEY,T_Title varchar(255),Descriptionlink varchar(255));', 
               'CREATE TABLE Quiz(QID INT NOT NULL PRIMARY KEY,Q_Title varchar(255),Topic INT,FOREIGN KEY (Topic) REFERENCES Topic(TID));',
               'CREATE TABLE Question(QAID INT NOT NULL PRIMARY KEY,QA_Title varchar(255),Type varchar(255),Problem_Statement varchar(255),Answer varchar(255),Quiz INT,FOREIGN KEY (Quiz) REFERENCES Quiz(QID));',
               'CREATE TABLE PROFILES (username TEXT NOT NULL, bio TEXT, completion INTEGER,question INT,FOREIGN KEY (question) REFERENCES Question(QAID));',
               'CREATE TABLE LOGINS (username TEXT NOT NULL, salt HASHBYTES NOT NULL, hash HASHBYTES NOT NULL, permissionlevel INTEGER NOT NULL);',
               'CREATE TABLE Attempt(Question INT,User varchar(255),Attempt varchar(255),FOREIGN KEY (Question) REFERENCES Question(QID),FOREIGN KEY (User) REFERENCES PROFILES(username));',
               'CREATE TABLE MultipleChoice(question INT NOT NULL,option1 varchar(255),option2 varchar(255),option3 varchar(255),option4 varchar(255),FOREIGN KEY (question) REFERENCES Question(QAID))']


// Create a verification schema using Joi to sanitize data inputs
const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .max(30)
    .required(),
});

// Catch the session's user, permission level and messages (if any) for use in the dynamic sites.
router.all('*', function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.permissionlevel = req.session.permissionlevel;
  res.locals.msgs = req.session.messages || [];
  req.session.messages = [];
  next();
});

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

// Read which user's profile is requested and access their info from the profile database
router.get('/:profile', function(req, res, next) {
  let query = 'SELECT COUNT(QAID) AS count FROM Question;';
  let totalquestions;
  db.get(query, function(err, row){
    if (err) { throw err; }
    if (row) {totalquestions = row.count;}
  })
  let p = req.params.profile;
  req.session.completions = req.session.completions || 0;
  
  const { error, value } = schema.validate({ username: p });

  if (!error){
    let query = 'SELECT rowid AS id, username, bio, completion, question FROM PROFILES WHERE (username="'+ p +'");';
    db.get(query, function(err,row){
      if (err) { throw err; }
      // If user was found, retrieve their data from the profile db
      if (row) {
        var profilestats = { 
          exists: true,
          name: row.username, 
          completed: row.completion,
          session: req.session.completions, 
          bio: row.bio || ""
        };
        res.render('users/profile', {title: p+"'s profile!", description: p+"'s profile! See their customized profile and progress on the questions!", total: totalquestions, profile:profilestats});
      }
      // If no user was found
      else {
        var profilestats = {exists:false};
        res.render('users/profile', {title: "User not found!", description: "User not found!", total: totalquestions, profile:profilestats});
      }
    });
  }
  // If requested username is non alphanumeric or otherwise failed Joi sanitation verification
  else {
    var profilestats = {exists:false};
    res.render('users/profile', {title: "User not found!", description: "User not found!", total: totalquestions, profile:profilestats});
  }
});

module.exports = router;
