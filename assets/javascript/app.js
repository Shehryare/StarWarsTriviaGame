$(document).ready(function () {

    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click', '.option', trivia.guessChecker);

})
//Game object
var trivia = {
    //properties for trivia
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',
    // Trivia Questions
    questions: {
        q1: 'What was the emperors sith name?',
        q2: 'Who was the General of the driod army?',
        q3: 'Who was ObiWan Kenobis master?',
        q4: 'What was Darth Vaders previous name?',
        q5: "What was the name of Darth Mauls brother/apprentice?"
      
    },  //Trivia question choices 
    options: {
        q1: ['Darth Maul', 'Darth Sidious', 'Count Dooku', 'Darth Bane'],
        q2: ['General Grievous', 'Pre Visla', 'Admiral Thrawn', 'Commander Cody'],
        q3: ['Yoda', 'Mace Windu', 'Luke Skywalker', 'Qui-Gon Jinn'],
        q4: ['Cad bane', 'Kit Fisto', 'Anakan Skywalker ', 'Sifo Dias'],
        q5: ['Boba Fett', 'Baris Ofee', 'Savage Oppress', 'Kanan Jaris']

    }, //Trivia question answers
    answers: {
        q1: 'Darth Sidious',
        q2: 'General Grievous',
        q3: 'Qui-Gon Jinn',
        q4: 'Anakan Skywalker',
        q5: 'Savage Oppress',
       
    },
    // trivia methods
    // method to initialize game
    startGame: function () {
        // restarting game results
        trivia.currentSet = 0; //sets the current set back to zero
        trivia.correct = 0; //resets the correct answers
        trivia.incorrect = 0; //resets incorrect answers
        trivia.unanswered = 0; //resets the unanswered questions
        clearInterval(trivia.timerId); //clears the number on the timer and resets it to zero

        // show game section after start of game
        $('#game').show();

        //  empties last results in the html
        $('#results').html('');

        // adds the timer value into the html 
        $('#timer').text(trivia.timer);

        // remove start button
        $('#start').hide();

        $('#remaining-time').show();

        // asks first question using the nextQuestion function
        trivia.nextQuestion();

    },
    //  loops through each question and options 
    nextQuestion: function () {

        // sets the timer to 10 seconds each question
        trivia.timer = 10;
        $('#timer').removeClass('last-seconds'); //Removes the class name 'last-seconds' from the timer ID
        $('#timer').text(trivia.timer); //replaces the text with timer property

        //  prevents timer from speeding up
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }

        // puts all the current questions and options set into a variable
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent); //adds questionContent into the html under the question ID

        // varibale for all of the user options to be into the current set
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];

        // adding the question options into the html 
        $.each(questionOptions, function (index, key) {
            //appending new button to the options ID into the html
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })

    },
    // function to decrement the timer 
    timerRunning: function () {
        // if timer still has time left and there are still questions left to ask
        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('#timer').addClass('last-seconds');
            }
        }
        // the time has run out and increment unanswered, run result
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
        }
        // if all the questions have been shown end the game, show results
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {

            // adds results of game (correct, incorrect, unanswered) to the page
            $('#results')
                .html('<h3>Thank you for playing!</h3>' +
                    '<p>Correct: ' + trivia.correct + '</p>' +
                    '<p>Incorrect: ' + trivia.incorrect + '</p>' +
                    '<p>Unaswered: ' + trivia.unanswered + '</p>' +
                    '<p>Please play again</p>');

            // hides the game sction
            $('#game').hide();

            // shows start button to begin a new game
            $('#start').show();
        }

    },
    // method to evaluate the option clicked
    guessChecker: function () {

        // timer ID for gameResult setTimeout
        var resultId;

        // the answer to the current question being asked
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

        // if the text of the option picked matches the answer of the current question, increment correct
        if ($(this).text() === currentAnswer) {
            // turn button green for correct
            $(this).addClass('btn-success').removeClass('btn-info');

            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Correct Answer!</h3>');
        }
        // else the user picked the wrong option, increment incorrect
        else {
            // turn button clicked red for incorrect
            $(this).addClass('btn-danger').removeClass('btn-info');

            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Better luck next time! ' + currentAnswer + '</h3>');
        }

    },
    // method to remove previous question results and options
    guessResult: function () {

        // increment to next question set
        trivia.currentSet++;

        // remove the options and results
        $('.option').remove();
        $('#results h3').remove();

        // begin next question
        trivia.nextQuestion();

    }

}