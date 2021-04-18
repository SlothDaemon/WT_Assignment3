var path = require('path');
var dbFile = path.resolve(__dirname, '../sql/html5.db');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

module.exports = function(){
    // When no user is loged in, the topics page is shown on load
    this.loadNoLogin = function(req,res){
        topicsPage(res);
    };

    // When a user is loged in load topics page or the user's active question
    this.loadWithUser = function(req,res){
        let query = 'SELECT qa.QA_Title, q.Q_Title, t.T_Title FROM PROFILES p, Question qa, Quiz q, Topic t WHERE p.username = "' + req.session.user + '" AND p.question = qa.QAID AND qa.Quiz = q.QID AND q.Topic = t.TID;';
        db.get(query, function(err, row){
            if (err) { throw err; }
            if(row){
                answerPage(res, row.QA_Title, row.Q_Title, row.T_Title, req.session.user);
            }
            else{
                topicsPage(res);
            }
        })
    }

    // Evaluates answer to question, stores attempt in db, changes user's completion when answer is right
    this.evalAns = function(req,res){
        let alreadyAnswered;
        let getAttempt = 'SELECT a.Attempt FROM Attempt a, Question qa WHERE a.Question = qa.QAID AND qa.Problem_Statement = "' + req.query.problemSt + '" AND a.Attempt = true;';
        let query = 'SELECT qa.Answer, t.Descriptionlink, qa.QAID FROM Question qa, Quiz q, Topic t WHERE qa.Problem_Statement = "' + req.query.problemSt + '" AND qa.Quiz = q.QID AND q.Topic = t.TID;';
        db.get(getAttempt, function(err1, attemptrow){
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
                    link: row.Descriptionlink,
                    correctAns: row.Answer
                }
                if(!alreadyAnswered){
                    var stmt = db.prepare('INSERT INTO Attempt VALUES (?,?,?)');
                    stmt.run(row.QAID, req.session.user, '' + answerEval + '');
                    stmt.finalize();
                    console.log("Attempt stored");
                    let getProfile = 'SELECT p.completion FROM PROFILES p WHERE p.username = "' + req.session.user + '";';
                    let completion;
                    if(answerEval){
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
                    
                }
                if (answerEval){
                    req.session.completions = req.session.completions || 0;
                    req.session.completions += 1;
                }
                res.send(data);
            }
        })
    }

    // When user wants to go back to the topics page
    this.homeClicked = function(req,res){
        topicsPage(res);
    }

    // When user wants to go to quizes page
    this.topicClicked = function(req,res){
        quizesPage(res, req.query.topic);
    }

    // When user wants to go to questions page
    this.quizClicked = function(req,res){
        questionsPage(res, req.query.quiz, req.query.topic);
    }

    // When user wants to go to specific question, if no user is logged in req.session.user will be null
    this.questionClicked = function(req,res){
       answerPage(res, req.query.question, req.query.quiz, req.query.topic, req.session.user);
    }

    // Respond with topics data
    this.topicsPage = function(res){
        let query = 'SELECT T_Title, DescriptionLink FROM Topic;';
        db.all(query, function(err, result){
            if (err) { throw err; }
            if (result) {
                var data = { 
                    pageType : "topics",
                    topicOne : result[0].T_Title,
                    DLOne : result[0].Descriptionlink,
                    topicTwo : result[1].T_Title,
                    DLTwo : result[1].Descriptionlink
                }
                res.send(data);
            }
        });
    }

    // Resopnd with quizes data
    this.quizesPage = function(res, Title){
        let query = 'SELECT q.Q_Title FROM Quiz q, Topic t WHERE q.Topic = t.TID AND t.T_title = "' + Title + '";'; 
        db.all(query, function(err, result){
            if (err) { throw err; }
            if (result) {
                var data= {
                    pageType: 'quizes',
                    quizOne: result[0].Q_Title,
                    quizTwo: result[1].Q_Title,
                    topic: Title
                }
                
                res.send(data);  
            }
        })
    }

    // Respond with questions data
    this.questionsPage = function(res, Title, Topic){
        let query = 'SELECT qa.QA_Title, qa.Type FROM Question qa, Quiz q WHERE qa.Quiz = q.QID AND q.Q_Title = "' + Title + '";';
        db.all(query, function(err, result){
            if (err) { throw err; }
            if (result) {
                var data = {
                    pageType: 'questions',
                    questionOne: result[0].QA_Title,
                    questionOneType: result[0].Type,
                    questionTwo: result[1].QA_Title,
                    questionTwoType: result[1].Type,
                    questionThree: result[2].QA_Title,
                    questionThreeType: result[2].Type,
                    quiz: Title,
                    topic: Topic
                }
                res.send(data);
            }
        })
    }

    // Respond with data of a specific question
    this.answerPage = function(res, Title, Quiz, Topic, User){
        let query = 'SELECT qa.QAID, qa.QA_Title, qa.Type, qa.Problem_Statement FROM Question qa, Quiz q WHERE QA_Title = "' + Title + '" AND q.Q_Title = "'+ Quiz + '" AND qa.Quiz = q.QID;';
        db.get(query, function(err, row){
            if(err) { throw err; }
            if(row){
                let Attempt;
                if(User != null){
                    let getAttempt = 'SELECT a.Attempt FROM Attempt a, Question qa, Quiz q WHERE a.User = "' + User + '" AND a.Question = qa.QAID AND qa.QA_Title = "' + row.QA_Title + '" AND qa.Quiz = q.QID AND q.Q_Title = "' + Quiz + '" AND a.Attempt = "true";';
                    db.get(getAttempt, function(err, row2){
                        if (err) { throw err;}
                        if(row2){
                            Attempt = true;
                        }
                        else{ Attempt = null}
                    })
                    
                    db.run('UPDATE PROFILES SET question = ? WHERE username = ?;',[
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
                    let getAnswers = 'SELECT option1, option2, option3, option4 FROM MultipleChoice WHERE question = ' + row.QAID + ';';
                    db.get(getAnswers, function (err, row3){
                        if(err) { throw err; }
                        if(row3){
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
                            res.send(data);
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
                    res.send(data);
                }
            }
        })
    }
}
