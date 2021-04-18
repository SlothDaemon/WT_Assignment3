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
        let query = 'SELECT qa.QA_Title, q.Q_Title, t.T_Title FROM PROFILES p, Question qa, Quiz q, Topic t WHERE p.username = ' + req.session.user + ' AND p.question = qa.QAID AND qa.Quiz = q.QID AND q.Topic = t.TID;';
        /*db.get(query, function(err, row){
            if (err) { throw err; }
            if(row){
                var data = answerPage(row.QA_Title, row.Q_Title, row.T_Title, req.session.user);
                res.send(data);
            }
            else{
                var data = topicsPage();
                res.send(data);
            }
        })*/
        var data = answerPage('question1', 'quiz1', 'topic1', req.session.user);
        res.send(data);
    }

    // Evaluates answer to question, stores attempt in db, changes user's completion when answer is right
    this.evalAns = function(req,res){
        let alreadyAnswered;
        let getAttempt = 'SELECT a.Attempt FROM Attempt a, Question qa WHERE a.Question = qa.QAID AND qa.Problem_Statement = ' + req.query.problemSt + ' AND a.Attempt = true;';
        let query = 'SELECT qa.Answer, t.Descriptionlink, qa.QAID FROM Question qa, Quiz q, Topic t WHERE qa.Problem_Statement = ' + req.query.problemSt + ' AND qa.Quiz = q.QID AND q.Topic = t.TID;';
        /*db.get(getAttempt, function(err1, attemptrow){
            if (err1) { throw err1; }
            if(attemptrow){ alreadyAnswered = true;}
            else{ alreadyAnswered = false;}
        })
        db.get(query, function(err, row){
            if (err) { throw err; }
            if(row){
                let answerEval = (row.Answer == req.query.answered);
                var data = {
                    eval: answerEval,
                    link: row.Descriptionlink
                }
                if(!alreadyAnswered){
                    var stmt = db.prepare('INSERT INTO Attempt VALUES (?,?,?)');
                    stmt.run(row.QAID, req.session.user, answerEval);
                    stmt.finalize();
                    console.log("Attempt stored");
                    let getProfile = 'SELECT p.completion FROM PROFILES p WHERE p.username = ' + req.session.user + ';';
                    let completion;
                    db.get(getProfile, function(err2, profilerow){
                        if (err2) { throw err2; }
                        if (profilerow){
                            completion = profilerow.completion;
                        }
                        db.run('UPDATE PROFILES SET completion = ? WHERE username = ?;',[
                            completion + 1,
                            req.session.user
                        ],function(error){
                            if (error) {console.log(error)}
                        })
                    })
                    
                }
                res.send(data);
            }
        })*/

        let answerEval = (req.query.answered == 'correct' || req.query.answered == 'option1');
        var data = {
            eval: answerEval,
            link: 'http://localhost:3000/history'
        }

        res.send(data);
    }

    // When user wants to go back to the topics page
    this.homeClicked = function(req,res){
        var data = topicsPage();
        res.send(data);
    }

    // When user wants to go to quizes page
    this.topicClicked = function(req,res){
        var data = quizesPage(req.query.topic);
        res.send(data);
    }

    // When user wants to go to questions page
    this.quizClicked = function(req,res){
        var data = questionsPage(req.query.quiz, req.query.topic);
        res.send(data);
    }

    // When user wants to go to specific question, if no user is logged in req.session.user will be null
    this.questionClicked = function(req,res){
        var data = answerPage(req.query.question, req.query.quiz, req.query.topic, req.session.user);
        res.send(data);
    }

    // Respond with topics data
    this.topicsPage = function(){
        let query = 'SELECT T_Title, DescriptionLink FROM Topic;';
        /*db.get(query, function(err, result){
            if (err) { throw err; }
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
        let query = 'SELECT q.Q_Title FROM Quiz q, Topic t WHERE q.Topic = t.TID AND t.T_title = ' + Title + ';'; 
        /*db.get(query, function(err, result){
            if (err) { throw err; }
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
            quizTwoQuestions: 3,
            topic: Title
        }
        return data;
    }

    // Respond with questions data
    this.questionsPage = function(Title, Topic){
        let query = 'SELECT qa.QA_Title, qa.Type FROM Question qa, Quiz q WHERE qa.Quiz = q.QID AND q.Q_Title = ' + Title + ';';
        /*db.get(query, function(err, result){
            if (err) { throw err; }
            if (result) {
                var data = {
                    pageType: 'questions',
                    questionOne: result.rows[0].QA_Title,
                    questionOneType: result.rows[0].Type,
                    questionTwo: result.rows[1].QA_Title,
                    questionTwoType: result.rows[0].Type,
                    questionThree: result.rows[2].QA_Title,
                    questionThreeType: result.rows[0].Type,
                    quiz: Title,
                    topic: Topic
                }
                return data;
            }
        })*/
        var data = {
            pageType: 'questions',
            questionOne: 'question1',
            questionOneType: 'MultipleChoice',
            questionTwo: 'question2',
            questionTwoType: 'Open',
            questionThree: 'question3',
            questionThreeType: 'Open',
            quiz: Title,
            topic: Topic
        }
        return data;
    }

    // Respond with data of a specific question
    this.answerPage = function(Title, Quiz, Topic, User){
        let query = 'SELECT QAID, QA_Title, Type, Problem_Statement FROM Question WHERE QA_Title = ' + Title + ';';
        /*db.get(query, function(err, row){
            if(err) { throw err; }
            if(row){
                let Attempt;
                if(User != null){
                    let getAttempt = 'SELECT a.Attempt FROM Attempt a WHERE a.User = ' + User + ' AND a.Question IN (SELECT qa.QAID FROM Question qa WHERE qa.QA_Title = ' + row.QA_Title + ' AND qa.Quiz IN (SELECT q.QID FROM Quiz q, WHERE q.Q_Title = ' + Quiz + ')) AND a.Attempt = true;';
                    db.get(getAttempt, function(err, row2){
                        if (err) { throw err;}
                        if(row2){
                            Attempt = true;
                        }
                        else{ Attempt = null}
                    })
                    
                    db.run('UPDATE PROFILES SET question = ? WHERE username = ?'[
                        row.QAID,
                        User
                    ],function(error){
                        if(error){
                            console.log(error);
                        }
                        else{console.log("New active question")}
                    });
                }
                else{ Attempt = null}

                if(row.Type == 'MultipleChoice'){
                    let getAnswers = 'SELECT m.option1, m.option2, m.option3, m.option4 FROM MultipleChoice m, Question qa WHERE m.question = ' + row.QAID + ';';
                    db.get(getAnswers, function (err, row3){
                        if(err) { throw err; }
                        if(row2){
                            var data = {
                                pageType: 'question',
                                type: row.Type,
                                question: row.Problem_Statement,
                                option1: row3.option1,
                                option2: row3.option2,
                                option3: row3.option3,
                                option4: row3.option4,
                                title: Title,
                                quiz: Quiz,
                                topic: Topic,
                                user: User,
                                attempt: Attempt
                            }
                            return data;
                        }
                    })
                }
                else{
                    var data = {
                        pageType: 'question',
                        type: row.Type,
                        question: row.Problem_Statement,
                        title: Title,
                        quiz: Quiz,
                        topic: Topic,
                        user: User,
                        attempt: Attempt
                    }
                    return data;
                }
            }
        })*/
        if(Title == 'question1'){
            var data = {
                pageType: 'question',
                type: 'MultipleChoice',
                question: 'which option is correct?',
                option1: 'option1',
                option2: 'option2',
                option3: 'option3',
                option4: 'option4',
                title: Title,
                quiz: Quiz,
                topic: Topic,
                user: User,
                attempt: null
            }
            return data;
        }
        else{
            var data = {
                pageType: 'question',
                type: 'Open',
                question: 'Answer this question with correct',
                title: Title,
                quiz: Quiz,
                topic: Topic,
                user: User,
                attempt: true
            }
            return data;
        }
    }
}
