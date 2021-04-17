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

    // When user wants to go back to the topics page
    this.homeClicked = function(req,res){
        console.log("home clicked");
        var data = topicsPage();
        res.send(data);
    }

    // When user wants to quizes page
    this.topicClicked = function(req,res){
        console.log("topic clicked");
        var data = quizesPage(req.query.topic);
        res.send(data);
    }

    this.quizClicked = function(req,res){
        console.log("quiz clicked");
        var data = questionsPage(req.query.quiz);
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

    // Resopnd with quizes data
    this.quizesPage = function(Title){
        console.log("quizespage function");
        let query = 'SELECT q.Q_Title FROM Quiz q, Topic t WHERE q.Topic = t.TID AND t.T_title = ' + Title + ';'; 
        /*db.get(query, function(err, result){
            if (err || !result) { throw err; }
            if (result) {
                let query1 = 'SELECT COUNT(qa.QAID) FROM Question qa, Quiz q WHERE qa.Quiz = q.QID AND q.Q_Title = ' + result.rows[0].Q_Title + ';';
                let query2 = 'SELECT COUNT(qa.QAID) FROM Question qa, Quiz q WHERE qa.Quiz = q.QID AND q.Q_Title = ' + result.rows[1].Q_Title + ';';
                let quizOneAmount;
                let quizTwoAmount;
                db.get(query1, function(err, row){
                    if (err || !row) { throw err; }
                    if (row) {
                        quizOneAmount = row;
                    }
                })
                db.get(query2, function(err, row){
                    if (err || !row) { throw err; }
                    if (row) {
                        quizTwoAmount = row;
                    }
                })

                var data= {
                    pageType: 'quizes',
                    quizOne: result.rows[0].Q_Title,
                    quizOneQuestions: quizOneAmount,
                    quizTwo: result.rows[1].Q_Title,
                    quizTwoQuestions: quizTwoAmount,
                    topic: Title
                }
                return data;  
            }
        })*/
        var data = {
            pageType: 'quizes',
            quizOne: 'quiz1',
            quizOneQuestions: 3,
            quizTwo: 'quiz2',
            quizTwoQuestions: 3
        }
        return data;
    }

    // Respond with questions data
    this.questionsPage = function(Title){
        console.log("questionspage function");
        let query = 'SELECT qa.QA_Title, qa.Type FROM Question qa, Quiz q WHERE qa.Quiz = q.QID AND q.Q_Title = ' + Title + ';';
        /*db.get(query, function(err, result){
            if (err || !result) { throw err; }
            if (result) {
                var data = {
                    pageType: 'questions',
                    questionOne: result.rows[0].QA_Title,
                    questionOneType: result.rows[0].Type,
                    questionTwo: result.rows[1].QA_Title,
                    questionTwoType: result.rows[0].Type,
                    questionThree: result.rows[2].QA_Title,
                    questionThreeType: result.rows[0].Type,
                    quiz: Title
                }
            }
        })*/
        var data = {
            pageType: 'questions',
            questionOne: 'question1',
            questionOneType: 'x',
            questionTwo: 'question2',
            questionTwoType: 'y',
            questionThree: 'question3',
            questionThreeType: 'z',
            quiz: Title
        }
        return data;
    }
}
