var path = require('path');
var dbFile = path.resolve(__dirname, '../sql/html5.db');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

module.exports = function(){
    // When no user is loged in, the topics page is shown on load
    this.loadNoLogin = function(req,res){
        console.log("No login");
        var data = topicsPage();
        res.send(data);
    };

    // When a user is loged in load topics page or the user's active question
    this.loadWithUser = function(req,res){
        console.log("User " + req.session.user + " is loged in");
        var data = {
            name: req.session.user,
            age: 30,
            city: 'England'
        };
        res.send(data);
    }

    // Respond with topics data
    this.topicsPage = function(){
        console.log("frontPage function");
        let query = 'SELECT T_Title, DescriptionLink FROM Topic;';
        /*db.get(query, function(err, result){
            if (err || !result) { throw err; }
            if (result) {
                var data = {
                    pageType: 'topics',
                    topicOne: result.rows[0].T_title,
                    DLOne: result.rows[0].Descriptionlink,
                    topicTwo: result.rows[1].T_title,
                    DLTwo: result.rows[1].Descriptionlink
                }
                return data;
            }
        });*/

        var data = {
            pageType: 'topics',
            topicOne: 'topic1',
            DLOne: 'http://localhost:3000/history',
            topicTwo: 'topic2',
            DLTwo: 'http://localhost:3000/features'
        }
        return data;
    }
}
