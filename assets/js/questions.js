var questions = [{
        question: "What is the world's fastest production vehicle?",
        choices: ["Bugatti Veyron", "Koenigsegg Agera RS", "Hennessey Venom GT", "Bugatti Chiron", "Lamborghini Sesto Elemento"],
        correctAnswer: 4
    },
    {
        question: "What is the top speed achieved by the Bugatti Chiron?",
        choices: ["312 mph", "304 mph", "332 mph", "297 mph", "322 mph"],
        correctAnswer: 2
    }, {
        question: "What car manufacturer claims it's F5 will break the world speed record?",
        choices: ["Maserati", "Bugatti", "Ferrari", "Lingenfelter", "Hennessey"],
        correctAnswer: 5
    }, {
        question: "What is the most expensive non-resale vehicle?",
        choices: ["Bugatti Chiron", "Lamborghini Veneno", "Keonigsegg CCXR Trevita", "McLaren P1 LM", "Aston Martin Valkyrie"],
        correctAnswer: 4
    }, {
        question: "Which auto manufacturers engine does Morgan Motors use in their vehicles?",
        choices: ["BMW", "Toyota", "Ford", "Mercedes-Benz", "Ferrari"],
        correctAnswer: 1
    }, {
        question: "What does the acronym TPS stand for?",
        choices: ["Toyota Proven Success", "Toyota Production System", "Toyota Profit System", "Toyote Penalty System", "Toyota Promises Security"],
        correctAnswer: 2
    }, {
        question: "Pontiac used to make two muscle cars that were virtually identical. What were the called?",
        choices: ["Gremlin & Annihilator", "Bluebird & Firestorm", "Firebird & Trans Am", "Thunder & Lightning", "GTO & Camaro"],
        correctAnswer: 3
    }
];

var currentQuestion = 0;
var viewingAns = 0;
var correctAnswers = 0;
var quizOver = false;
var iSelectedAnswer = [];
var c = 180;
var t;
$(document).ready(function() {
    // Display the first question
    displayCurrentQuestion();
    $(this).find(".message").hide();
    $(this).find(".lastButton").attr('disabled', 'disabled');

    timedCount();

    $(this).find(".lastButton").on("click", function() {

        if (!quizOver) {
            if (currentQuestion == 0) { return false; }

            if (currentQuestion == 1) {
                $(".lastButton").attr('disabled', 'disabled');
            }

            currentQuestion--; // Since we have already displayed the first question on DOM ready
            if (currentQuestion < questions.length) {
                displayCurrentQuestion();

            }
        } else {
            if (viewingAns == 3) { return false; }
            currentQuestion = 0;
            viewingAns = 3;
            viewResults();
        }
    });


    // On clicking next, display the next question
    $(this).find(".nextButton").on("click", function() {
        if (!quizOver) {

            var val = $("input[type='radio']:checked").val();

            if (val == undefined) {
                $(document).find(".message").text("Please select an answer");
                $(document).find(".message").show();
            } else {
                // TODO: Remove any message -> not sure if this is efficient to call this each time....
                $(document).find(".message").hide();
                if (val == questions[currentQuestion].correctAnswer) {
                    correctAnswers++;
                }
                iSelectedAnswer[currentQuestion] = val;

                currentQuestion++; // Since we have already displayed the first question on DOM ready
                if (currentQuestion >= 1) {
                    $('.lastButton').prop("disabled", false);
                }
                if (currentQuestion < questions.length) {
                    displayCurrentQuestion();

                } else {
                    displayScore();
                    $('#iTimeShow').html('Quiz Time Completed!');
                    $('#timer').html("You scored: " + correctAnswers + " out of: " + questions.length);
                    c = 185;
                    $(document).find(".lastButton").text("View Answer");
                    $(document).find(".nextButton").text("Play Again?");
                    quizOver = true;
                    return false;

                }
            }

        } else { // quiz is over and clicked the next button (which now displays 'Play Again?'
            quizOver = false;
            $('#iTimeShow').html('Time Remaining:');
            iSelectedAnswer = [];
            $(document).find(".nextButton").text("Next Question");
            $(document).find(".lastButton").text("Last Question");
            $(".lastButton").attr('disabled', 'disabled');
            resetQuiz();
            viewingAns = 1;
            displayCurrentQuestion();
            hideScore();
        }
    });
});



function timedCount() {
    if (c == 185) {
        return false;
    }

    var hours = parseInt(c / 3600) % 24;
    var minutes = parseInt(c / 60) % 60;
    var seconds = c % 60;
    var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    $('#timer').html(result);

    if (c == 0) {
        displayScore();
        $('#iTimeShow').html('Quiz Time Completed!');
        $('#timer').html("You scored: " + correctAnswers + " out of: " + questions.length);
        c = 185;
        $(document).find(".lastButton").text("View Answer");
        $(document).find(".nextButton").text("Play Again?");
        quizOver = true;
        return false;

    }

    if (c == 0) {
        if (!quizOver) {
            var val = $("input[type='radio']:checked").val();
            if (val == questions[currentQuestion].correctAnswer) {
                correctAnswers++;
            }
            currentQuestion++; // Since we have already displayed the first question on DOM ready

            if (currentQuestion < questions.length) {
                displayCurrentQuestion();
                c = 15;
            } else {
                displayScore();
                $('#timer').html('');
                c = 16;
                $(document).find(".nextButton").text("Play Again?");
                quizOver = true;
                return false;
            }
        } else { // quiz is over and clicked the next button (which now displays 'Play Again?'
            quizOver = false;
            $(document).find(".nextButton").text("Next Question");
            resetQuiz();
            displayCurrentQuestion();
            hideScore();
        }
    }
    c = c - 1;
    t = setTimeout(function() {
        timedCount()
    }, 1000);
}


// This displays the current question AND the choices
function displayCurrentQuestion() {

    if (c == 185) {
        c = 180;
        timedCount();
    }
    //console.log("In display current Question");
    var question = questions[currentQuestion].question;
    var questionClass = $(document).find(".quizContainer > .question");
    var choiceList = $(document).find(".quizContainer > .choiceList");
    var numChoices = questions[currentQuestion].choices.length;
    // Set the questionClass text to the current question
    $(questionClass).text(question);
    // Remove all current <li> elements (if any)
    $(choiceList).find("li").remove();
    var choice;


    for (i = 0; i < numChoices; i++) {
        choice = questions[currentQuestion].choices[i];

        if (iSelectedAnswer[currentQuestion] == i) {
            $('<li><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
        } else {
            $('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
        }
    }
}

function resetQuiz() {
    currentQuestion = 0;
    correctAnswers = 0;
    hideScore();
}

function displayScore() {
    $(document).find(".quizContainer > .result").text("You scored: " + correctAnswers + " out of: " + questions.length);
    $(document).find(".quizContainer > .result").show();
}

function hideScore() {
    $(document).find(".result").hide();
}

// This displays the current question AND the choices
function viewResults() {

    if (currentQuestion == 10) { currentQuestion = 0; return false; }
    if (viewingAns == 1) { return false; }

    hideScore();
    var question = questions[currentQuestion].question;
    var questionClass = $(document).find(".quizContainer > .question");
    var choiceList = $(document).find(".quizContainer > .choiceList");
    var numChoices = questions[currentQuestion].choices.length;
    // Set the questionClass text to the current question
    $(questionClass).text(question);
    // Remove all current <li> elements (if any)
    $(choiceList).find("li").remove();
    var choice;


    for (i = 0; i < numChoices; i++) {
        choice = questions[currentQuestion].choices[i];

        if (iSelectedAnswer[currentQuestion] == i) {
            if (questions[currentQuestion].correctAnswer == i) {
                $('<li style="border:2px solid green;margin-top:10px;"><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            } else {
                $('<li style="border:2px solid red;margin-top:10px;"><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            }
        } else {
            if (questions[currentQuestion].correctAnswer == i) {
                $('<li style="border:2px solid green;margin-top:10px;"><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            } else {
                $('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            }
        }
    }

    currentQuestion++;

    setTimeout(function() {
        viewResults();
    }, 3000);
}