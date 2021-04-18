Group ID: group10

Daniël Salomons 6508383
Ravan Strijker 	7257642
Pim Versteeg heeft niks gedaan bij deze opdracht.

The website is live at
http://webtech.science.uu.nl/group10

As per the express-generator template, the script to start the website is located in bin/www, which in turn calls upon the main script app.js in the root folder. This imports a variety of libraries, of which we have added Joi for user input sanitation and validation and sdlite3 as a login- profile and question database and express sessions for logins. 
Our webpages are no longer static HTML pages, they are now Jade views, which you can find under the views folder. All non-layout.jade views extend layout.jade, which holds the render for the header with flash messages, navbar with login form, and the foother. The other views hold the respective content of the pages. views/users/profile.jade is filled in by looking up the data of the profiles database of the requested user's profile (so http://webtech.science.uu.nl/group10/users/admin would lookup user "admin"'s profile data. As a consequence, unregistered users have no saved data, as per specification.
These views are navigated to by the routes under the routes/ folder, index.js for navigating to a non-user webpage, login.js catches all POST request that happen on the website, and users.js generates the user profiles of the registered users.
our static folder is calld public/, which holds the client-side JS, CSS and images.
the sql/ folder holds our sql database. the selfsame folder holds the sql database definition for your perusal. additionally, it's copy-pasted below.

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
 )
