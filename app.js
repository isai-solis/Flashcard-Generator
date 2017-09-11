var BasicFlashCard = require ("./BasicCards.js");
var ClozeFlashCard = require ("./ClozeCard.js");
var inquirer = require ("inquirer");
var fs = require ("fs");

inquirer.prompt([{
    name: "command",
    message: "What would you like to do?",
    type: "list", 
    choices: [{
        name: "add flashcard"
    },
    {
        name: "show all cards"
    }]
}]).then (function(answer){
    if(answer.command === "add flashcard"){
        addCard();
    }
    else if(answer.command==="show all cards"){
        showCards();
    }
});

var addCard = function(){
    inquirer.prompt([{
        name: "cardType", 
        message: "What kind of card would you like to create?",
        type: "list", 
        choices: [{
            name: "basic flashcard"
        },
        {
            name: "cloze flashcard"
        }]
    }]).then(function(answer){
        if (answer.cardType==="basic flashcard"){
            inquirer.prompt([{
                name: "front",
                message: "What is your question",
                validate: function(input){
                    if (input===""){
                        console.log("Please input a question.")
                        return false;                      
                    }
                    else{
                        return true;
                    }
                }
            },
                {
                name: "back",
                message: "What is answer?",
                validate: function(input){
                    if (input===""){
                        console.log("Please input an answer.");
                        return false;
                    }
                    else{
                        return true;
                    }
                }

            }]).then(function(answer){
                var newBasic = new BasicFlashCard(answer.front, answer.back);
                newBasic.create();
                theNext()
            });
        }
        else if (answer.cardType==="cloze flashcard"){
            inquirer.prompt([{
                name: "text",
                message: "What is the full text?",
                validate: function(input){
                    if (input===""){
                        console.log("Please input the full text");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
                {
                name:"cloze",
                message: "What is the cloze portion?",
                validate: function(input){
                    if (input===""){
                        console.log("Please input the cloze portion.")
                        return false;
                    }
                    else{
                        return true;
                    }
                }

            }]).then(function(answer){
                var text = answer.text;
                var cloze = answer.cloze;
                if (text.includes(cloze)){
                    var newCloze = new ClozeFlashCard(text, cloze);
                    newCloze.create();
                    theNext();
                }
                else{
                    console.log("The cloze you inputted is not in the full text. Do it again.");
                    addCard();
                }
            });
        }
    });
};
var theNext = function() {
    inquirer.prompt([{
        name: 'nextAction',
        message: 'What would you like to do next?',
        type: 'list',
        choices: [{
            name: 'create new card'
        }, {
            name: 'show all cards'
        }, {
            name: 'nothing'
        }]
    }]).then(function(answer) {
        if (answer.nextAction === 'create new card') {
            addCard();
        } else if (answer.nextAction === 'show all cards') {
            showCards();
        } else if (answer.nextAction === 'nothing') {
            return;
        }
    });
};

var showCards = function() {
    fs.readFile('./log.txt', 'utf8', function(error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
        }
        var questions = data.split(';');
        questions.pop();
        var notBlank = function(value) {
            return value;
        };
        questions = questions.filter(notBlank);
        var count = 0;
        showQuestion(questions, count);
    });
};

var showQuestion = function(array, index) {
    question = array[index];
    var parsedQuestion = JSON.parse(question);
    var questionText;
    var correctReponse;
    if (parsedQuestion.type === 'basic') {
        questionText = parsedQuestion.front;
        correctReponse = parsedQuestion.back;
    } else if (parsedQuestion.type === 'cloze') {
        questionText = parsedQuestion.partial;
        correctReponse = parsedQuestion.cloze;
    }
    inquirer.prompt([{
        name: 'response',
        message: questionText
    }]).then(function(answer) {
        if (answer.response === correctReponse) {
            console.log('Correct!');
            if (index < array.length - 1) {
              showQuestion(array, (index + 1));
            //   theNext();
            }
        } else {
            console.log('Wrong!');
            if (index < array.length - 1) {
              showQuestion(array, (index + 1));
            //   theNext();
            }
        }
    });
};