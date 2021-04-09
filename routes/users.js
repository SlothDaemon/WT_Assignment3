var express = require('express');
var router = express.Router();

const Joi = require('joi');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var profileDbFile = 'public/sql/profile.db';
var profileDbFileExists = fs.existsSync(profileDbFile);
var profileDb = new sqlite3.Database(profileDbFile);

var path = require('path');

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

// Initialize the admin's profile if the profile db doesn't exist yet
profileDb.serialize(function(){
  if (!profileDbFileExists){
    console.log('making admins profile');
    profileDb.run("CREATE TABLE PROFILES (username TEXT NOT NULL, bio TEXT, completion INTEGER);");
    var stmt = profileDb.prepare('INSERT INTO PROFILES VALUES (?,?,?)');
    stmt.run('admin',"Hi, I'm admin!",12);
    stmt.finalize();
  }
});

// Read which user's profile is requested and access their info from the profile database
router.get('/:profile', function(req, res, next) {
  let totalquestions = 12; // todo: get this out of the questions database eventually
  let p = req.params.profile;
  req.session.completions = req.session.completions || 0;
  
  const { error, value } = schema.validate({ username: p });

  if (!error){
    let query = 'SELECT rowid AS id, username, bio, completion FROM PROFILES WHERE (username="'+ p +'");';
    profileDb.get(query, function(err,row){
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
