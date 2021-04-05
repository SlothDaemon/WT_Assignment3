function addHandlers(){
   const main = document.getElementsByTagName("main")[0];
   main.addEventListener("click", collapsibleHeaders);
   const header = document.getElementsByTagName("header")[0];
   header.addEventListener("click", closeMessage);
}

function addLoginUI(){
   // ID first determined by server session
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

/* messages are now handled by serverside js
function popupMessage(type, content){
   let header = document.getElementsByTagName("header")[0];
   let msg = document.createElement("ASIDE");
   msg.classList.toggle("message");
   msg.textContent = content;
   switch (true){
      case type === "warning":
         msg.classList.toggle("message--warning");
         break;
      case type === "error":
         msg.classList.toggle("message--error");
         break;
      case type === "ok":
         msg.classList.toggle("message--ok");
         break;
      default:
         break;
   }
   let close = document.createElement("A");
   close.textContent="X";
   msg.appendChild(close);
   header.appendChild(msg);
}*/

function closeMessage(e){
   if (e.target && e.target.nodeName == "A"){
      e.target.parentNode.style.display = 'none';
   }
}

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

function domWalk (whitelist, mainElements, sections) {
   for (let elem of document.getElementsByTagName("html")[0].childNodes){
      if (elem.nodeType == 1){
         recursiveDomWalk(elem, whitelist, mainElements, sections);
      }
   }
}

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

function enableEditor(){
   var editor = document.getElementById('editor');
   editor.addEventListener('change',changeSelected, false);
}

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

function addArrayElements(editor, array, category) {
   for (let i = 0; i < array.length; i++){
      var option = array[i];
      var toAdd = document.createElement("option");
      toAdd.textContent = option[0].toUpperCase() + option.substr(1);
      toAdd.value = option;
      toAdd.category = category;
      editor.add(toAdd);
   }
}

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

function evaluateMCAnswer(e){
   if(e.target && e.target.nodeName == "INPUT" && e.target.type === 'radio' && e.target.value==='false'){
      e.target.parentNode.parentNode.style.color = "red";
   }
   else if (e.target && e.target.nodeName == "INPUT" && e.target.type === 'radio' && e.target.value==='true'){
      e.target.parentNode.parentNode.style.color = "green";
   }
}

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

function fillAssessment(){
   if (document.title === "Assessment"){
      let questions = multiQuestions().concat(fillQuestions());
      questions.shuffle();
      let mainSection = document.getElementById("main-section");
      for (let nr=0; nr<questions.length; nr++) {
         mainSection.appendChild(questions[nr].createArticle(nr));
   }}
}

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

Array.prototype.shuffle = function() {
   // Fisher-Yates shuffle
   for (let i = this.length - 1; i; i--){
      let j = Math.floor(Math.random()*(i+1));
      let temp = this[j];
      this[j] = this[i];
      this[i] = temp;
   }
};

class Question {
   constructor(desc) {
      this.description = desc;
   }

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

   createArticle(nr){
      let article = super.createBaseArticle(nr);
   
      var answerForm = document.createElement("FORM");
      this.answers.shuffle();
      this.createAnswers(answerForm, nr);
   
      article.appendChild(answerForm);
      article.addEventListener('click',evaluateMCAnswer);
      return article;
   }
   
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

function fillQuestions(){
   let q1 = new FillIn("The four levels of maturity for a W3C process are working draft, candidate recommendation, # and W3C recommendation.",["proposed recommendation"]);
   let q2 = new FillIn("Tim Berners-Lee was born in # and his online nickname is #.",["1995", "TimBL"]);
   return [q1,q2];
}


function initialise() {
   addSelectors();
   fillAssessment();
   addHandlers();
   fillSelector();
   fillEditor();
   enableEditor();
   collapseArticleHeaders();
   addLoginUI();
}

window.addEventListener('load', initialise, false);