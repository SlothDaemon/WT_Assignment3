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

/*
// If an answer to an MC question is selected, change the div's style accordingly
function evaluateMCAnswer(e){
   if(e.target && e.target.nodeName == "INPUT" && e.target.type === 'radio' && e.target.value==='false'){
      e.target.parentNode.parentNode.style.color = "red";
   }
   else if (e.target && e.target.nodeName == "INPUT" && e.target.type === 'radio' && e.target.value==='true'){
      e.target.parentNode.parentNode.style.color = "green";
   }
}

// Check if all the inputs, in lowercase, correspond with the correct answers
// If all answers are true, change the div style accordingly
function evaluateFillAnswer(e){
   let article = document.getElementById('question'+e.target.id);
   let givenAnswers = article.getElementsByTagName("INPUT");
   var correct = true;
   for (let i = 0; i<givenAnswers.length; i++){
      correct = ((givenAnswers[i].value.toLowerCase() === this.answers[i].toLowerCase()) && correct);
   }

   if (correct) {
      e.target.parentNode.parentNode.style.color ="green";
   }
   else {
      e.target.parentNode.parentNode.style.color ="red";
   }
}
*/

// Fill the assessment page
function loadAssessment(){
   $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/load',
      dataType: 'json',
   }).done(function(data){
         console.log("data succesfully sent");
         if(data.pageType == 'topics'){ createTopicsPage(data.topicOne, data.DLOne, data.topicTwo, data.DLTwo);}
         //if(data.pageType == 'question'){ createQuestionPage(data.)}
   }).fail(function(jqXHR, textStatus, err){
         console.log('AJAX error response:', textStatus);
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
         console.log("data succesfully sent");
         if(data.pageType == 'topics'){ createTopicsPage(data.topicOne, data.DLOne, data.topicTwo, data.DLTwo);}
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
      console.log("Quizes info recieved");
      if(data.pageType == 'quizes'){createQuizesPage(data.quizOne, data.quizOneQuestions, data.quizTwo, data.quizTwoQuestions)}

   }).fail(function(jqXHR, textStatus, err){
      console.log('AJAX error response:', textStatus);
   })
}

// Lets user choose between the quizes
function createQuizesPage(quizOne, q1Questions, quizTwo, q2Questions){
   let mainsection = document.getElementById("main-section");
   while(mainsection.firstChild){mainsection.removeChild(mainsection.lastChild)}
   mainsection.style.display = 'block';
   let h1 = document.createElement('h1');
   h1.textContent = 'Quizes';
   h1.style.textAlign = 'center';
   mainsection.appendChild(h1);
   let quiz1 = createQuizesPageArticle(quizOne, q1Questions);
   let quiz2 = createQuizesPageArticle(quizTwo, q2Questions);
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
   quiz1.addEventListener('click', function(){clickedQuiz(quizOne);});
   quiz2.addEventListener('click', function(){clickedQuiz(quizTwo);});
   goBack.addEventListener('click', function() {clickedHome();});
   console.log("Quizes page created");
}

// Creates the article for a quiz
function createQuizesPageArticle(header, amount){
   article = document.createElement('ARTICLE');
   let h1 = document.createElement('h1');
   let p  = document.createElement('p');
   let text = document.createTextNode('This quiz has ' + amount + ' questions');
   p.appendChild(text);
   h1.textContent = header;
   h1.style.fontSize = '1.5em';
   article.appendChild(h1);
   article.appendChild(p);
   return article;
}

// When a topic is clicked, go to it's quizes page with ajax request
function clickedQuiz(Title){
   
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
   createAnswers(form, nr){
      for (let i=0; i<this.answers.length; i++){
         var input = document.createElement("INPUT");
         input.setAttribute('type','radio');
         input.setAttribute('name','answer'+nr);
         input.setAttribute('value',this.answers[i].correct);
         input.setAttribute('id','answer'+nr+i);

         var label = document.createElement("LABEL");
         label.setAttribute('for','answer'+nr+i);
         label.appendChild(document.createTextNode(this.answers[i].value));

         form.appendChild(document.createElement("BR"));
         form.appendChild(input);
         form.appendChild(label);
      }
   }
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
   addSelectors();
   addHandlers();
   fillSelector();
   fillEditor();
   enableEditor();
   collapseArticleHeaders();
   addLoginUI();
   addEditBioButton();
   addMessageClosers();
   if (document.title === "Assessment"){
      loadAssessment();
   }

}

// Do all the DOM manipulation once the window has loaded
window.addEventListener('load', initialise, false);