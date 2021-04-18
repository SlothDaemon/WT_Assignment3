//const app = require("../../app");

function addHandlers(){
   
   const main = document.getElementsByTagName("main")[0];
   main.addEventListener("click", collapsibleHeaders);
   const header = document.getElementsByTagName("header")[0];
   header.addEventListener("click", closeMessage);
}

// Fill in the login UI on all pages. Just a whole bunch of arduous DOM manipulation
function addLoginUI(){
   // ID determined by the jade file, which in turn first checks whether the user is logged in or not
   let loginform = document.getElementById('login');
   let logoutform = document.getElementById('logout');

   if (logoutform) {
      logoutform.setAttribute('method','POST');
      logoutform.setAttribute('id','loginform');
   
      let logoutButton = document.createElement('BUTTON');
      logoutButton.setAttribute('type','submit');
      logoutButton.setAttribute('name','logout');
      logoutButton.setAttribute('value','true');
      logoutButton.textContent = 'Logout';
      logoutform.appendChild(logoutButton);   
      nav.appendChild(logoutform);
   }
   else {
      loginform.setAttribute('method','POST');
      loginform.setAttribute('id','loginform');
      let user = document.createElement('INPUT');
      let pw = document.createElement('INPUT');
      user.setAttribute('type','text');
      user.setAttribute('placeholder','Username');
      user.setAttribute('name','username');
      user.setAttribute('required',true);

      pw.setAttribute('type','password');
      pw.setAttribute('placeholder','Password');
      pw.setAttribute('name','password')      
      pw.setAttribute('required',true);

      let loginButton = document.createElement('BUTTON');
      loginButton.setAttribute('type','submit');
      loginButton.setAttribute('name','login');
      loginButton.setAttribute('value','true');
      loginButton.textContent = 'Login';

      let registerButton = document.createElement('BUTTON');
      registerButton.setAttribute('type','submit');
      registerButton.setAttribute('name','register');
      registerButton.setAttribute('value','true');
      registerButton.textContent = 'Register';

      loginform.appendChild(user);
      loginform.appendChild(pw);
      loginform.appendChild(loginButton);
      loginform.appendChild(registerButton);
      nav.appendChild(loginform);
   }
   
}

// DOM Manipulation to add an edit bio button when a RU looks at their own profile
function addEditBioButton(){
   let editBio = document.getElementById('editbio');
   if (editBio){
      editBio.setAttribute('method','POST');
      bioButton = document.createElement("A");
      bioButton.textContent = 'Edit Bio';
      bioButton.addEventListener('click',createEditForm);
      editBio.appendChild(bioButton);   
   }
}

// Create the textarea and submission button once the edit bio button is pressed
function createEditForm(e){
   e.target.remove();
   let form = document.getElementById('editbio');
   form.setAttribute('id','editingBio');
   let textbox = document.createElement("TEXTAREA");
   textbox.setAttribute('name','bioTextBox');
   let submit = document.createElement("BUTTON");
   submit.setAttribute('type','submit');
   submit.setAttribute('name','newBio');
   submit.setAttribute('value','true');
   submit.textContent = 'Submit';
   form.appendChild(textbox);
   form.appendChild(submit);
}

// Add the clickable X to all messages so they can be closed
function addMessageClosers(){
   let messages = document.getElementsByClassName('message');
   for (let i = 0; i<messages.length; i++){
      let close = document.createElement("A");
      close.textContent = "X";
      messages[i].appendChild(close);
   }
}

// Remove parent node (the message) from the page once the user dismisses them
function closeMessage(e){
   if (e.target && e.target.nodeName == "A"){
      e.target.parentNode.remove();
   }
}

// H2 headers are collapsible in order to remove the wall-of-text effect most pages have
function collapsibleHeaders(e) {
   if(e.target && e.target.nodeName == "H2"){
      const c = e.target.nextElementSibling;
      e.target.classList.toggle("collapsed");
      if (c.style.display === "none") {
         c.style.display = "block";
      } else {
         c.style.display = "none";
      }
   }
}

function collapseArticleHeaders() {
   /* Default behaviour to have article headers collapsed, to 
   1. Make articles less walls of text and 
   2. To provide a contrast with aside headers which aren't collapsed, to teach visitors that headers can be (un)collapsed */
   const hs = document.getElementsByTagName('h2');
   for (let i=0; i<hs.length; i++) {
      if (hs[i].parentElement.nodeName !== "ASIDE") {
         hs[i].classList.toggle("collapsed");
         hs[i].nextElementSibling.style.display="none";
      }
   }
}

// Fill the selector part of the attribute changer UI
function fillSelector(){
   var selector = document.getElementById('selector');

   var mainElements = [];
   var sections = [];
   var whitelist = ["SECTION","BODY","MAIN","NAV","ARTICLE","ASIDE","FOOTER"];

   domWalk(whitelist, mainElements, sections);

   var mainGroup = document.createElement("optgroup");
   mainGroup.label = "Main parts";
   selector.add(mainGroup);
   addArrayElements(selector, mainElements, undefined);

   if(sections.length) {
      var sectionGroup = document.createElement("optgroup");
      sectionGroup.label = "Sections";
      selector.add(sectionGroup);
      addArrayElements(selector, sections, undefined);
   }
}

// Initiate recursively walking through the DOM to append the desired elements to the attribute changer
function domWalk (whitelist, mainElements, sections) {
   for (let elem of document.getElementsByTagName("html")[0].childNodes){
      if (elem.nodeType == 1){
         recursiveDomWalk(elem, whitelist, mainElements, sections);
      }
   }
}

// Recursively check if the node inspecting is on the whitelist.
// If yes, recursively look at all its child nodes and add the node to the attribute changer
function recursiveDomWalk(elem, whitelist, mainElements, sections) {
   if (elem.nodeType == 1 && whitelist.includes(elem.nodeName)){
      if (elem.id !== "main-section" && elem.nodeName === "SECTION") {
         sections.push(elem.id);
      }
      else {
         mainElements.push(elem.id);
      }
      for (let i of elem.childNodes) {
         recursiveDomWalk(i, whitelist, mainElements, sections);
      }
   }
}

// Make attribute changer editor form functinal
function enableEditor(){
   var editor = document.getElementById('editor');
   editor.addEventListener('change',changeSelected, false);
}

// Fill in the editor with the options in the array
function fillEditor(){
   var editor = document.getElementById('editor');
   var fontSizeOptions = ["25%","50%","75%","100%","125%","150%","175%","200%"];
   var colorOptions = ["Black", "White", "Orange", "Red", "Green", "Blue", "Yellow"];

   var fontSizeGroup = document.createElement("optgroup");
   fontSizeGroup.label = "Font size";
   editor.add(fontSizeGroup);
   addArrayElements(editor, fontSizeOptions, "Font-size");

   var colorGroup = document.createElement("optgroup");
   colorGroup.label = "Text color";
   editor.add(colorGroup);
   addArrayElements(editor, colorOptions, "Text-color");

   var bgColorGroup = document.createElement("optgroup");
   bgColorGroup.label = "Background";
   editor.add(bgColorGroup);
   addArrayElements(editor, colorOptions, "Background");
}

// For each element in the array, do all the DOM manipulation to add it to the dropdown
function addArrayElements(editor, array, category) {
   for (let i = 0; i < array.length; i++){
      var option = array[i];
      var toAdd = document.createElement("option");
      toAdd.textContent = option.toUpperCase() + option.substr(1);
      toAdd.value = option;
      toAdd.category = category;
      editor.add(toAdd);
   }
}

// Change the selected attribute with the chosen options
function changeSelected(){
   var selector = document.getElementById('selector');
   var selectedOption = selector.options[selector.selectedIndex];
   if(selectedOption !== null){
      var selectedValue = document.getElementById(selectedOption.value);
      var editor = document.getElementById('editor');
      var change = editor.options[editor.selectedIndex];
      if(change.category == "Font-size"){
         selectedValue.style.fontSize = change.value;
      }
      else if(change.category == "Text-color"){
         selectedValue.style.color = change.value;
      }
      else if(change.category == "Background"){
         selectedValue.style.backgroundColor = change.value;
      }
   }
}

// If a quesion is answered, check if user is logged in, then evaluate or tell user to log in
function evaluateAnswer(target, user, answered, question, type){
   if(target && target.nodeName == "INPUT" && target.type === 'radio' || type == 'open'){
      if(user){
         let answer;
         if (type == 'mc'){
            answer = target.value;
         }
         else{
            answer = "";
            for (let i = 0; i<answered.length; i++){
               if(answered[i] >= 'A' && answered[i] <= 'Z'){
                  answer += answered[i].toLowerCase();
               }
               else{
                  answer += answered[i];
               }
            }
         }

         $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/answer',
            dataType: 'json',
            data: {
               answered: answer,
               problemSt: question 
            }
         }).done(function(data){
            if(data.eval){
               target.parentNode.parentNode.style.color = 'green';
               text = document.createTextNode("You answered correctly!");
               p = document.createElement('p');
               p.appendChild(text);
               target.parentNode.appendChild(p);
            }
            else{
               target.parentNode.parentNode.style.color = 'red';
               a = document.createElement('a');
               a.href = data.link;
               text = document.createTextNode("You answered incorrectly! The Correct answer is: " + data.correctAns + ".");
               atext = document.createTextNode("Click here to go to the topic's description page");
               a.appendChild(atext);
               p = document.createElement('p');
               p.appendChild(text);
               p2 = document.createElement('p');
               p2.appendChild(a);
               target.parentNode.appendChild(p);
               target.parentNode.appendChild(p2);
            }
         }).fail(function(jqXHR, textStatus, err){
            console.log('AJAX error response:', textStatus);
         })
      }
      else{
         let p = document.createElement('p');
         let text = document.createTextNode("Log in to evaluate your answer!");
         p.appendChild(text);
         p.style.color = 'red';
         target.parentNode.appendChild(p);
         
      }
   }
}

// Fill the assessment page
function loadAssessment(){
   $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/load',
      dataType: 'json'
   }).done(function(data){
         if(data.pageType == 'topics'){ createTopicsPage(data.topicOne, data.DLOne, data.topicTwo, data.DLTwo);}
         if(data.pageType == 'question'){ createAnswerPage(data)}
   }).fail(function(jqXHR, textStatus, err){
         console.log('AJAX error response:', err);
   })
}

// When user goes back from a quizes page, go to topics page
function clickedHome(){
   $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/click',
      dataType: 'json',
      data: {type: 'home'}
   }).done(function(data){
         if(data.pageType == 'topics'){ createTopicsPage(data.topicOne, data.DLOne, data.topicTwo, data.DLTwo);}
   }).fail(function(jqXHR, textStatus, err){
         console.log('AJAX error response:', textStatus);
   })
}

// When a topic is clicked, go to it's quizes page with ajax request
function clickedTopic(Title){
   $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/click',
      dataType: 'json',
      data: {
         type: 'topic',
         topic : Title
      }
   }).done(function(data){
      if(data.pageType == 'quizes'){createQuizesPage(data.quizOne, data.quizTwo, data.topic)}

   }).fail(function(jqXHR, textStatus, err){
      console.log('AJAX error response:', textStatus);
   })
}

// When a quiz is clicked, go to it's questions page with ajax request
function clickedQuiz(Title, Topic){
   $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/click',
      dataType: 'json',
      data: {
         type: 'quiz',
         quiz : Title,
         topic: Topic
      }
   }).done(function(data){
      if(data.pageType == 'questions'){createQuestionsPage(data.questionOne, data.questionOneType, data.questionTwo, data.questionTwoType, data.questionThree, data.questionThreeType, data.quiz, data.topic)}

   }).fail(function(jqXHR, textStatus, err){
      console.log('AJAX error response:', textStatus);
   })
}

// When a question is clicked go to it's page with ajax request
function clickedQuestion(Title, Quiz, Topic){
   $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/click',
      dataType: 'json',
      data: {
         type: 'question',
         question: Title,
         quiz: Quiz,
         topic: Topic
      }
   }).done(function(data){
      if(data.pageType == 'question'){createAnswerPage(data)}

   }).fail(function(jqXHR, textStatus, err){
      console.log('AJAX error response:', textStatus);
   })
}

// Lets user choose between the topics
function createTopicsPage(topicOne, DLOne, topicTwo, DLTwo)
{
   let mainsection = document.getElementById("main-section");
   while(mainsection.firstChild){mainsection.removeChild(mainsection.lastChild)}
   mainsection.style.display = 'block';
   let h1 = document.createElement('h1');
   h1.textContent = 'Topics';
   h1.style.textAlign = 'center';
   mainsection.appendChild(h1);
   let topic1 = createTopicPageArticle(topicOne, DLOne);
   let topic2 = createTopicPageArticle(topicTwo, DLTwo);
   topic1.addEventListener('mouseover', function(){topic1.style.backgroundColor = 'orangered'; topic1.style.color = 'white'});
   topic1.addEventListener('mouseout', function(){topic1.style.backgroundColor = 'white'; topic1.style.color = 'black'});
   topic2.addEventListener('mouseover', function(){topic2.style.backgroundColor = 'orangered'; topic2.style.color = 'white'});
   topic2.addEventListener('mouseout', function(){topic2.style.backgroundColor = 'white'; topic2.style.color = 'black'});
   mainsection.appendChild(topic1);
   mainsection.appendChild(topic2);
   topic1.addEventListener('click', function(){clickedTopic(topicOne);});
   topic2.addEventListener('click', function(){clickedTopic(topicTwo);});
   console.log("Topics page created");
}

// Creates the article for a topic
function createTopicPageArticle(header, link){
   article = document.createElement('ARTICLE');
   let h1 = document.createElement('h1');
   let text = document.createTextNode("Click here for the topic description");
   let a = document.createElement('a');
   h1.textContent = header;
   h1.style.fontSize = '1.5em';
   a.title = "Click here for the topic description";
   a.href = link;
   a.appendChild(text);
   article.appendChild(h1);
   article.appendChild(a);
   return article;
}

// Lets user choose between the quizes
function createQuizesPage(quizOne, quizTwo, topic){
   let mainsection = document.getElementById("main-section");
   while(mainsection.firstChild){mainsection.removeChild(mainsection.lastChild)}
   mainsection.style.display = 'block';
   let h1 = document.createElement('h1');
   h1.textContent = topic + ' Quizes';
   h1.style.textAlign = 'center';
   mainsection.appendChild(h1);
   let quiz1 = createQuizesPageArticle(quizOne);
   let quiz2 = createQuizesPageArticle(quizTwo);
   mainsection.appendChild(quiz1);
   mainsection.appendChild(quiz2);
   let goBack = document.createElement('article');
   let p = document.createElement('p');
   let text = document.createTextNode('Go back to Topics');
   p.appendChild(text);
   goBack.appendChild(p);
   mainsection.appendChild(goBack);

   quiz1.addEventListener('mouseover', function(){quiz1.style.backgroundColor = 'orangered'; quiz1.style.color = 'white'});
   quiz1.addEventListener('mouseout', function(){quiz1.style.backgroundColor = 'white'; quiz1.style.color = 'black'});
   quiz2.addEventListener('mouseover', function(){quiz2.style.backgroundColor = 'orangered'; quiz2.style.color = 'white'});
   quiz2.addEventListener('mouseout', function(){quiz2.style.backgroundColor = 'white'; quiz2.style.color = 'black'});
   goBack.addEventListener('mouseover', function(){goBack.style.backgroundColor = 'orangered'; goBack.style.color = 'white'});
   goBack.addEventListener('mouseout', function(){goBack.style.backgroundColor = 'white'; goBack.style.color = 'black'});
   quiz1.addEventListener('click', function(){clickedQuiz(quizOne, topic);});
   quiz2.addEventListener('click', function(){clickedQuiz(quizTwo, topic);});
   goBack.addEventListener('click', function() {clickedHome();});
   console.log("Quizes page created");
}

// Creates the article for a quiz
function createQuizesPageArticle(header){
   article = document.createElement('ARTICLE');
   let h1 = document.createElement('h1');
   let p  = document.createElement('p');
   let text = document.createTextNode('This quiz has 3 questions');
   p.appendChild(text);
   h1.textContent = header;
   h1.style.fontSize = '1.5em';
   article.appendChild(h1);
   article.appendChild(p);
   return article;
}

// Lets user choose between questions
function createQuestionsPage(questionOne, type1, questionTwo, type2, questionThree, type3, quiz, topic){
   let mainsection = document.getElementById("main-section");
   while(mainsection.firstChild){mainsection.removeChild(mainsection.lastChild)}
   mainsection.style.display = 'block';
   let h1 = document.createElement('h1');
   h1.textContent = topic + ': ' + quiz;
   h1.style.textAlign = 'center';
   mainsection.appendChild(h1);
   let question1 = createQuestionsPageArticle(questionOne, type1);
   let question2 = createQuestionsPageArticle(questionTwo, type2);
   let question3 = createQuestionsPageArticle(questionThree, type3);
   mainsection.appendChild(question1);
   mainsection.appendChild(question2);
   mainsection.appendChild(question3);
   let goBack = document.createElement('article');
   let p = document.createElement('p');
   let text = document.createTextNode('Go back to Quizes');
   p.appendChild(text);
   goBack.appendChild(p);
   mainsection.appendChild(goBack);

   question1.addEventListener('mouseover', function(){question1.style.backgroundColor = 'orangered'; question1.style.color = 'white'});
   question1.addEventListener('mouseout', function(){question1.style.backgroundColor = 'white'; question1.style.color = 'black'});
   question2.addEventListener('mouseover', function(){question2.style.backgroundColor = 'orangered'; question2.style.color = 'white'});
   question2.addEventListener('mouseout', function(){question2.style.backgroundColor = 'white'; question2.style.color = 'black'});
   question3.addEventListener('mouseover', function(){question3.style.backgroundColor = 'orangered'; question3.style.color = 'white'});
   question3.addEventListener('mouseout', function(){question3.style.backgroundColor = 'white'; question3.style.color = 'black'});
   goBack.addEventListener('mouseover', function(){goBack.style.backgroundColor = 'orangered'; goBack.style.color = 'white'});
   goBack.addEventListener('mouseout', function(){goBack.style.backgroundColor = 'white'; goBack.style.color = 'black'});
   question1.addEventListener('click', function(){clickedQuestion(questionOne, quiz, topic);});
   question2.addEventListener('click', function(){clickedQuestion(questionTwo, quiz, topic);});
   question3.addEventListener('click', function(){clickedQuestion(questionThree, quiz, topic);});
   goBack.addEventListener('click', function(){clickedTopic(topic);});
   console.log("Quizes page created");
}

// Creates the article for a question
function createQuestionsPageArticle(header, type){
   article = document.createElement('ARTICLE');
   let h1 = document.createElement('h1');
   let p  = document.createElement('p');
   let text;
   if(type == 'Open'){text = document.createTextNode('This is a open question');}
   else{text = document.createTextNode('This is a multiple choice question');}
   p.appendChild(text);
   h1.textContent = header;
   h1.style.fontSize = '1.5em';
   article.appendChild(h1);
   article.appendChild(p);
   return article;
}

// Creates the article of a specific question, the user can answer if logged in
function createAnswerPage(data){
   let mainsection = document.getElementById("main-section");
   while(mainsection.firstChild){mainsection.removeChild(mainsection.lastChild)}
   mainsection.style.display = 'block';
   let h1 = document.createElement('h1');
   h1.textContent = data.topic + ': ' + data.quiz + ' ' + data.title;
   h1.style.textAlign = 'center';
   mainsection.appendChild(h1);
   let goBack = document.createElement('article');
   let p = document.createElement('p');
   let text = document.createTextNode('Go back to Questions');
   p.appendChild(text);
   goBack.appendChild(p);
   let question = document.createElement('ARTICLE');
   let questionHeader = document.createElement('h1');
   questionHeader.textContent = data.question + '?';
   questionHeader.style.fontSize = '1.5em'; 
   question.appendChild(questionHeader);

   let answerForm;
   if (data.type == 'MultipleChoice'){
      answerForm = createAnswerFormMC(data.option1, data.option2, data.option3, data.option4);
      if(data.attempt){
         let attemptP = document.createElement('p');
         let attempttext = document.createTextNode('You have answered this question correctly already');
         attemptP.appendChild(attempttext);
         attemptP.style.collor = 'green';
         answerForm.appendChild(attemptP);
      }
      question.addEventListener('click', function(e){evaluateAnswer(e.target, data.user, null, data.question, 'mc')});
   }
   else{
      answerForm = createAnswerFormOpen(data.user, data.question);
   }
   question.appendChild(answerForm);
   mainsection.appendChild(question);
   goBack.addEventListener('mouseover', function(){goBack.style.backgroundColor = 'orangered'; goBack.style.color = 'white'});
   goBack.addEventListener('mouseout', function(){goBack.style.backgroundColor = 'white'; goBack.style.color = 'black'});
   goBack.addEventListener('click', function(){clickedQuiz(data.quiz, data.topic);});
   mainsection.appendChild(goBack);

}

// Creates the answer form for a multiple choice question
function createAnswerFormMC(option1, option2, option3, option4){
   form = document.createElement('FORM');
   createAnswersMC(form, option1);
   createAnswersMC(form, option2);
   createAnswersMC(form, option3);
   createAnswersMC(form, option4);
   return form;
}

// Creates the answer form for a open question
function createAnswerFormOpen(user, question){
   form = document.createElement('FORM');
   input = document.createElement('INPUT');
   input.setAttribute('type','text');
   input.setAttribute('id','answer');
   let label = document.createElement("LABEL");
   label.setAttribute('for','answer');
   label.appendChild(document.createTextNode('Answer: '));
   let button = document.createElement('button');
   button.setAttribute('type', 'button');
   button.appendChild(document.createTextNode('Evaluate'));
   button.addEventListener('click', function(e){evaluateAnswer(e.target, user, input.value, question, 'open')});
   form.appendChild(label);
   form.appendChild(input);
   form.appendChild(button);
   return form;
}

function createAnswersMC(form, option){
   var input = document.createElement("INPUT");
   input.setAttribute('type','radio');
   input.setAttribute('id',option);
   input.setAttribute('name', 'answer');
   input.setAttribute('value', option);

   var label = document.createElement("LABEL");
   label.setAttribute('for',option);
   label.appendChild(document.createTextNode(option));

   form.appendChild(document.createElement("BR"));
   form.appendChild(input);
   form.appendChild(label);
}


// Add the editor and selector attribute changer UI to the footer of each page
function addSelectors(){
   let footer = document.getElementById("footer")
   for (let i = 0; i<2; i++){
      let select = document.createElement("SELECT");
      let option = document.createElement("OPTION");
      option.value = "";
      option.setAttribute('disabled', true);
      option.setAttribute('selected', true);
      option.setAttribute('hidden', true);
      switch (true) {
         case i === 0:
            select.setAttribute('id','editor');
            option.textContent = "Edit";
            break;
         case i === 1:
            select.setAttribute('id','selector');
            option.textContent = "Select";
            break;
      }
      select.appendChild(option);
      footer.appendChild(select);
   }
}

// Shuffle an array
Array.prototype.shuffle = function() {
   // Fisher-Yates shuffle
   for (let i = this.length - 1; i; i--){
      let j = Math.floor(Math.random()*(i+1));
      let temp = this[j];
      this[j] = this[i];
      this[i] = temp;
   }
};

/*
// Question superclass
class Question {
   constructor(desc) {
      this.description = desc;
   }

   // DOM manipulation to create the article for the question to be appended dto
   createBaseArticle(nr){
      let article = document.createElement("ARTICLE");
      article.setAttribute('id','question'+nr);
   
      let questionHeading = document.createElement("H1");
      questionHeading.textContent = "Q" + (nr+1) + ": " + this.description;
      article.appendChild(questionHeading);
      return article;
   }

}

class MultipleChoice extends Question {
   constructor(desc, answ){
      super(desc);
      this.answers = answ;
   }

   // DOM manipulation fill in the rest of the article
   createArticle(nr){
      let article = super.createBaseArticle(nr);
   
      var answerForm = document.createElement("FORM");
      this.answers.shuffle();
      this.createAnswers(answerForm, nr);
   
      article.appendChild(answerForm);
      article.addEventListener('click',evaluateMCAnswer);
      return article;
   }
   
   // DOM manipulation to create the rest of the question
   
}

class MultipleChoiceAnswer{
   constructor(val, correct){
      this.value = val;
      this.correct = correct;
   }
}

class FillIn extends Question {
   constructor(partialansw, answ) {
      super("Fill in the blank");
      this.partialAnswer = partialansw.split('#');
      this.answers = answ;
   }

   // DOM manipulation fill in the rest of the article
   createArticle(nr){
      let article = super.createBaseArticle(nr);
   
      var answerForm = document.createElement("FORM");

      for (let i=0; i<this.answers.length; i++){
         this.createAnswer(answerForm, i, nr);
      }
      if (this.partialAnswer.length > this.answers.length) {
         let rest = document.createTextNode(this.partialAnswer[this.partialAnswer.length - 1]+' ');
         answerForm.appendChild(rest);
      }
      
      let btn = document.createElement("BUTTON");
      btn.setAttribute('type','button');
      btn.setAttribute('id',nr);
      btn.appendChild(document.createTextNode('Evaluate'));
      btn.addEventListener('click',evaluateFillAnswer.bind(this));
      answerForm.appendChild(btn);
      
      article.appendChild(answerForm);      
      return article;
   }

   // DOM manipulation to create the rest of the question
   createAnswer(form, i, nr){
      let input = document.createElement("INPUT");
      input.setAttribute('type','text');
      input.setAttribute('id','answer'+nr+i);

      let label = document.createElement("LABEL");
      label.setAttribute('for','answer'+nr+i);
      label.appendChild(document.createTextNode(this.partialAnswer[i]));
      form.appendChild(label);
      form.appendChild(input);
   }
}

// Create the MC questions
function multiQuestions(){
   let a11 = new MultipleChoiceAnswer("Tim Berners-Lee",true);
   let a12 = new MultipleChoiceAnswer("Sergey Sosnovsky",false);
   let a13 = new MultipleChoiceAnswer("Arthur C. Clarke",false);
   let a14 = new MultipleChoiceAnswer("Robert Melancton Metcalfe",false);
   let answers1 = [a11,a12,a13,a14];
   let q1 = new MultipleChoice("Who invented the World Wide Web?",answers1);

   let a21 = new MultipleChoiceAnswer("USA",false);
   let a22 = new MultipleChoiceAnswer("USSR",false);
   let a23 = new MultipleChoiceAnswer("Switzerland",true);
   let a24 = new MultipleChoiceAnswer("Australia",false);
   let answers2 = [a21,a22,a23,a24];
   let q2 = new MultipleChoice("Where was the internet invented?",answers2);

   let a31 = new MultipleChoiceAnswer("Nanjing University",false);
   let a32 = new MultipleChoiceAnswer("Harbin Institute of Technology",false);
   let a33 = new MultipleChoiceAnswer("Beihang University",true);
   let a34 = new MultipleChoiceAnswer("Fudan University",false);
   let answers3 = [a31,a32,a33,a34];
   let q3 = new MultipleChoice("Which university is the Chinese host of W3C?", answers3);
   return [q1,q2,q3];
}

// Create the fill in questions
function fillQuestions(){
   let q1 = new FillIn("The four levels of maturity for a W3C process are working draft, candidate recommendation, # and W3C recommendation.",["proposed recommendation"]);
   let q2 = new FillIn("Tim Berners-Lee was born in # and his online nickname is #.",["1995", "TimBL"]);
   return [q1,q2];
}
*/

// Run the list of DOM manipulation functions once the window has loaded
function initialise() {
   addHandlers();
   collapseArticleHeaders();
   addLoginUI();
   addEditBioButton();
   addMessageClosers();
   if (document.title === "Assessment"){
      loadAssessment();
   }
   else{
      addSelectors();
      fillSelector();
      fillEditor();
      enableEditor();
   }

}

// Do all the DOM manipulation once the window has loaded
window.addEventListener('load', initialise, false);