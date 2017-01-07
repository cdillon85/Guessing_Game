function generateWinningNumber (){
	return Math.ceil(Math.random()*100);
};

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

function Game(){
	this.playersGuess=null;
	this.pastGuesses = [];
	this.winningNumber=generateWinningNumber();
}

Game.prototype.difference=function(){
		return Math.abs(this.playersGuess - this.winningNumber);
	};

Game.prototype.isLower=function(){
		return this.playersGuess<this.winningNumber;
	};


Game.prototype.playersGuessSubmission = function(guess) {
    if(typeof guess !== 'number' || guess < 1 || guess > 100) {
        throw "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
};

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        $('#hint, #submit').prop("disabled",true);
        $('#title').text("Press the Reset button to play again!")
        return 'You Win! You are the Guess Master!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'Seriously, you already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled",true);
                return 'You lose. Press RESET to play again!';
            }
            else {
                var diff = this.difference();
                if (this.isLower()){
                    $('#title').text("Come on, guess higher")
                }else{
                    $('#title').text("Not quite, guess lower!")
                }
                if(diff < 10) return'You\'re burning up! Oh, so close!';
                else if(diff < 25) return'You\'re lukewarm. Getting closer!';
                else if(diff < 50) return'You\'re a bit chilly. Come on, guess again!';
                else return'You\'re ice cold! Guess again.';
            }
        }
    }
};

function newGame(){
	return new Game();
};

Game.prototype.provideHint=function(){
	var hint=[];
	hint.push(this.winningNumber, generateWinningNumber(), generateWinningNumber())
	return shuffle(hint);
	
}



function makeAGuess(game) {
    var guess = $('#player-guess').val();
    $('#player-guess').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}

$(document).ready(function() {
    var game = new Game();
    
    $('#submit-btn').click(function(e) {
       makeAGuess(game);
    })

    $('#player-guess').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Guess a number between 1-100!');
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);

    })
})



