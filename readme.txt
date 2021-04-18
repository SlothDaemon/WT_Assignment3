Group ID: group10

Daniël Salomons 6508383
Ravan Strijker 	7257642
Pim Versteeg has not done anything for this assessment. Our assignment mentor Joep Kneefel has been informed about this per email.

The website is live at
http://webtech.science.uu.nl/group10

As per the express-generator template, the script to start the website is located in bin/www, which in turn calls upon the main script app.js in the root folder. This imports a variety of libraries, of which we have added Joi for user input sanitation and validation and sdlite3 as a login-, profile and question database and express sessions for logins. 
Our webpages are no longer static HTML pages, they are now Jade views, which you can find under the views folder. All non-layout.jade views extend layout.jade, which holds the render for the header with flash messages, navbar with login form, and the foother. The other views hold the respective content of the pages. views/users/profile.jade is filled in by looking up the data of the profiles database of the requested user's profile (so http://webtech.science.uu.nl/group10/users/admin would lookup user "admin"'s profile data. As a consequence, unregistered users have no saved data, as per specification.
These views are navigated to by the routes under the routes/ folder, index.js for navigating to a non-user webpage and re-routing AJAX requests to assessment.js, login.js catches all POST request that happen on the website, users.js generates the user profiles of the registered users, and assessment.js deals with all AJAX requests.
Our static folder is calld public/, which holds the client-side JS, CSS and images. You can find style.css in the css/ folder, which does the styling of our webpages. The js/ folder has the jquery library, which we use for ajax requests, and the script.js file. This file holds all client-side functions and requests data from the server with AJAX to enable the assessment page.
The sql/ folder holds our sql database. The selfsame folder holds the sql database definition for your perusal. Additionally, it's copy-pasted below, along with the insert statements used to fill the database with the topics, quizes and questions. 
The database has seven tables. The Topic table holds the data of each topic. The Quiz table has data of each quiz, including which topic it is in. The Question table has question data, including the quiz it belongs to. The MultipleChoice table contains question ids of all multiple choice typed questions, together with the four possible options. The LOGINS table stores a user's username and permissionlevel, and a salt and hash for the password. The PROFILES table stores a user's username, bio, the amount of correctly answered questions and the question the user last visited. The Attempt table stores all attempts on questions by each user, and whether the answer was correct or not. 

logins:
admin, opensesame

no extra credit features were done.

sql definition:
CREATE TABLE Topic(
  TID INT NOT NULL PRIMARY KEY,
  T_Title varchar(255),
  Descriptionlink varchar(255)
); 
 
CREATE TABLE Quiz(
  QID INT NOT NULL PRIMARY KEY,
  Q_Title varchar(255),
  Topic INT,
  FOREIGN KEY (Topic) REFERENCES Topic(TID)
);

CREATE TABLE Question(
  QAID INT NOT NULL PRIMARY KEY,
  QA_Title varchar(255),
  Type varchar(255),
  Problem_Statement varchar(255),
  Answer varchar(255),
  Quiz INT,FOREIGN KEY (Quiz) REFERENCES Quiz(QID)
);

CREATE TABLE PROFILES(
  username TEXT NOT NULL,
  bio TEXT,
  completion INTEGER,
  question INT,
  FOREIGN KEY (question) REFERENCES Question(QAID)
);

CREATE TABLE LOGINS(
  username TEXT NOT NULL,
  salt HASHBYTES NOT NULL,
  hash HASHBYTES NOT NULL,
  permissionlevel INTEGER NOT NULL
);
 
CREATE TABLE Attempt(
  Question INT,
  User varchar(255),
  Attempt varchar(255),
  FOREIGN KEY (Question) REFERENCES Question(QID),
  FOREIGN KEY (User) REFERENCES PROFILES(username)
);

CREATE TABLE MultipleChoice(
  question INT NOT NULL,
  option1 varchar(255),
  option2 varchar(255),
  option3 varchar(255),
  option4 varchar(255),
  FOREIGN KEY (question) REFERENCES Question(QAID)
 );

insert statements for topics, quizes and questions:
INSERT INTO Topic VALUES
(1,'Tim Berners-Lee', 'http://localhost:3000/bernerslee'),
(2,'HTML5s history', 'http://localhost:3000/history');

INSERT INTO Quiz VALUES
(1,'His life', 1),
(2,'His reseach', 1),
(3, 'Comparison with Flash', 2),
(4, 'Recommendation stages', 2);

INSERT INTO Question VALUES
(1, 'Question 1','Open','In what year was Tim Berners-Lee born', '1955', 1),
(2, 'Question 2','MultipleChoice','Where did Tim Berners-Lee study', 'Oxford', 1),
(3, 'Question 3','MultipleChoice', 'How many siblings does Tim Berners-Lee have', '3', 1),
(4, 'Question 1','MultipleChoice', 'In which city did Berners-Lee work after leaving CERN in december 1980', 'Bournemouth', 2),
(5, 'Question 2','Open', 'What was the address of the first website and webserver', 'info.cern.ch', 2),
(6, 'Question 3','Open', 'In what year did Berners-Lee found WC3', '1994', 2),
(7, 'Question 1','MultipleChoice', 'Which feature does Adobe Flash have, that HTML does not', 'Animation', 3),
(8, 'Question 2','Open', 'What was the title of the public letter that Steve Jobs issued in 2010', 'thoughts on flash', 3),
(9, 'Question 3','MultipleChoice', 'When was Abobe Flash officially discontinued', '31 December 2020', 3),
(10, 'Question 1','Open', 'Where did the WC3 HTML work group advance HTML5 to in May 2011', 'last call', 4),
(11, 'Question 2','MultipleChoice', 'When did WC3 and WHATWG agree on a degree of separation', 'July 2012', 4),
(12, 'Question 3','Open', 'How many years were between HTML5.0s first draft and WC3 Recommendation', '7', 4);

INSERT INTO MultipleChoice VALUES
(2, 'Cambridge', 'Oxford', 'London', 'Manchester'),
(3, '0', '1', '2', '3'),
(4, 'Bournemouth', 'Leeds', 'Sheffield', 'Sydney'),
(7, 'Playing audio', 'Playing video', 'Using Scalable Vector Graphs', 'Animation'),
(9, '1 Januari 2021', '31 December 2020', '1 December 2020', '30 November 2020'),
(11, 'July 2012', 'March 2013', 'October 2013', 'Februari 2014');

