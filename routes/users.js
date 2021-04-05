var express = require('express');
var router = express.Router();

var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var profileDbFile = 'public/sql/profile.db';
var profileDbFileExists = fs.existsSync(profileDbFile);
var profileDb = new sqlite3.Database(profileDbFile);

var path = require('path');

router.all('*', function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.permissionlevel = req.session.permissionlevel;
  res.locals.msgs = req.session.messages || [];
  req.session.messages = [];
  next();
});

profileDb.serialize(function(){
  if (!profileDbFileExists){
    console.log('making admins profile');
    profileDb.run("CREATE TABLE PROFILES (username TEXT NOT NULL, bio TEXT, completion INTEGER);");
    var stmt = profileDb.prepare('INSERT INTO PROFILES VALUES (?,?,?)');
    stmt.run('admin',"Hi, I'm admin!",12);
    stmt.finalize();
  }
});

/* GET users listing. */
router.get('/:profile', function(req, res, next) {
  let totalquestions = 12; // get this out of the questions database
  let p = req.params.profile;
  req.session.completions = req.session.completions || 0;
  
  let query = 'SELECT rowid AS id, username, bio, completion FROM PROFILES WHERE (username="'+ p +'");';
  profileDb.get(query, function(err,row){
    if (err) { throw err; }
    if (row) {
      var profilestats = { 
        name: row.username, 
        completed: row.completion,
        session: req.session.completions, 
        bio: row.bio || ""
      };
      // The scope of these variables make no fucking sense to me, so I guess I'm copypasta'ing code again
      res.render('users/profile', {title: p+"'s profile!", description: p+"'s profile! See their customized profile and progress on the questions!", total: totalquestions, profile:profilestats});
    }
    else {
      var profilestats = {name: p, completed: 0, session: req.session.completions, bio: ""};
      res.render('users/profile', {title: p+"'s profile!", description: p+"'s profile! See their customized profile and progress on the questions!", total: totalquestions, profile:profilestats});
    }
  });
  
});

module.exports = router;
