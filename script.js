window.onload = function() {
    var username = localStorage.getItem('username');
    if (username) {
        document.getElementById('signup').style.display = 'none';
        document.getElementById('loader').style.display = 'none';
        document.getElementById('home').style.display = 'block';
        document.getElementById('header').style.display = 'flex';
        document.getElementById('username').innerHTML = '<i class="fa fa-user"></i> '+username;
        // document.getElementById('accuracy').innerHTML = '<i class="fa fa-check"></i> 0%';
        showAccuracy(localStorage.getItem('totalQuestions'), localStorage.getItem('correctAnswers'));
    }else{
        document.getElementById('signup').style.display = 'block';
        document.getElementById('loader').style.display = 'none';
        document.getElementById('home').style.display = 'none';
    }

}

function signup() {
    var username = document.getElementById('userInput').value;
    localStorage.setItem('username', username);
    localStorage.setItem('accuracy', 0);
    localStorage.setItem('totalQuestions', 0);
    localStorage.setItem('correctAnswers', 0);
    window.location.reload();

}


function resetHistory(){
    var r = confirm("Are you sure you want to reset your progress?");
    if (r == true) {
        localStorage.removeItem('username');
        localStorage.removeItem('accuracy');
        localStorage.removeItem('totalQuestions');
        localStorage.removeItem('correctAnswers');
        window.location.reload();
    }
    
}


function startQuiz(){
    document.getElementById('home').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.getElementById('loader').style.display = 'block';

    var category= document.getElementById('category').value;
    var difficulty= document.getElementById('difficulty').value;
    var amount= document.getElementById('amount').value;
    localStorage.setItem('currentAnsweredQuestions', 0);
    localStorage.setItem('currentQuestion', 0);
    localStorage.setItem('currentCorrectAnswers', 0);
    localStorage.setItem('currentWrongAnsware', 0);  
    localStorage.setItem('currentAccuracy', 0);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://opentdb.com/api.php?amount='+amount+'&category='+category+'&difficulty='+difficulty+'&type=multiple', true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var questions = response.results;
            localStorage.setItem('questions', JSON.stringify(questions));            
            showquestion();
            document.getElementById('loader').style.display = 'none';
            document.getElementById('questions').style.display = 'block';
            document.getElementById('header').style.display = 'flex';
        }
    }
}

function showquestion(){
    
    localStorage.setItem('currentQuestion', parseInt(localStorage.getItem('currentQuestion'))+1);
    showAccuracy(localStorage.getItem('currentAnsweredQuestions'), localStorage.getItem('currentCorrectAnswers'));
    var questions = JSON.parse(localStorage.getItem('questions'));
    var question = questions.shift();

    localStorage.setItem('questions', JSON.stringify(questions));
    var answers = question.incorrect_answers;   
    answers.push(question.correct_answer);
    answers = shuffle(answers);
    document.getElementById('question').innerHTML = localStorage.currentQuestion+". "+question.question;
    let i=0
    while(i<=3){
       document.getElementsByClassName('answer')[i].innerHTML = `${i+1}. ` + answers[i];
       if (answers[i] == question.correct_answer) {
           document.getElementsByClassName('answer')[i].value =true;  
         }else{
              document.getElementsByClassName('answer')[i].value =false;
         }
         i++; 
    }
    
    
    if(JSON.parse(localStorage.getItem('questions')).length==0){
        document.getElementById('next').style.display = 'none';
        document.getElementById('skip').style.display = 'none';
        document.getElementById('finish').style.display = 'block';
        document.getElementById('finish').innerHTML = 'Skip & Finish';
    }


}
function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function answer(e){
   options= document.getElementsByClassName('answer');
    
    if(JSON.parse(localStorage.getItem('questions')).length==0){
        document.getElementById('next').style.display = 'none';
        document.getElementById('skip').style.display = 'none';
        document.getElementById('finish').style.display = 'block';
        document.getElementById('finish').innerHTML = 'Finish'; 
    }else{
        document.getElementById('next').style.display = 'block';
    document.getElementById('skip').style.display = 'none';
    }
   for (let i = 0; i < options.length; i++) {
        options[i].removeAttribute('onclick');
    }
    localStorage.setItem('currentAnsweredQuestions', parseInt(localStorage.getItem('currentAnsweredQuestions'))+1);
  
   if(e.value=="true"){
         localStorage.setItem('currentCorrectAnswers', parseInt(localStorage.getItem('currentCorrectAnswers'))+1);
         showAccuracy(localStorage.getItem('currentAnsweredQuestions'), localStorage.getItem('currentCorrectAnswers'));
         e.style.backgroundColor = 'green';
         e.innerHTML='<i class="fa fa-check"></i> '+ e.innerHTML.slice(3); ;
   }else{
        localStorage.setItem('currentWrongAnsware', parseInt(localStorage.getItem('currentWrongAnsware'))+1);
        showAccuracy(localStorage.getItem('currentAnsweredQuestions'), localStorage.getItem('currentCorrectAnswers'));
        e.style.backgroundColor = 'red';
        e.innerHTML='<i class="fa fa-times"></i> '+ e.innerHTML.slice(3); 
        for (let i = 0; i < options.length; i++) {
            if(options[i].value=="true"){
                options[i].style.backgroundColor = 'green';
                options[i].innerHTML='<i class="fa fa-check"></i> '+ options[i].innerHTML.slice(3); ;
            }
        }
   }
}

showAccuracy = function(totalQuestions, correctAnswers){
    var accuracy = (correctAnswers/totalQuestions)*100;
    if(isNaN(accuracy)){
        accuracy = 0;
    }
    accuracy= Math.round(accuracy);
    document.getElementById('accuracy').innerHTML = '<i class="fa fa-check"></i> '+accuracy+'%';
}

function next(){
    document.getElementById('next').style.display = 'none';
    document.getElementById('skip').style.display = 'block';    
    for (let i = 0; i < 4; i++) {
        document.getElementsByClassName('answer')[i].style.backgroundColor = 'white';
        document.getElementsByClassName('answer')[i].setAttribute('onclick', 'answer(this)');
    }
    showquestion(); 

}

function skip(){
    document.getElementById('next').style.display = 'none';
    document.getElementById('skip').style.display = 'block';    
    for (let i = 0; i < 4; i++) {
        document.getElementsByClassName('answer')[i].style.backgroundColor = 'white';
        document.getElementsByClassName('answer')[i].setAttribute('onclick', 'answer(this)');
    }
    showquestion(); 
}


function finish(){
    var currentCorrectAnswers = parseInt(localStorage.getItem('currentCorrectAnswers'));
    var currentAnsweredQuestions = parseInt(localStorage.getItem('currentAnsweredQuestions'));
    var currentWrongAnsware = parseInt(localStorage.getItem('currentWrongAnsware'));
    var totalQuestions = parseInt(localStorage.getItem('totalQuestions'));
    var correctAnswers = parseInt(localStorage.getItem('correctAnswers'));
    var accuracy = parseInt(localStorage.getItem('accuracy'));
    localStorage.setItem('totalQuestions', totalQuestions+currentAnsweredQuestions);
    localStorage.setItem('correctAnswers', correctAnswers+currentCorrectAnswers);
    localStorage.setItem('accuracy', accuracy+currentCorrectAnswers);
    window.location.reload();
}
