/*
    5 point: A, E, I, O, L, N, R, S, T, U
    10 points: D, G.
    15 points: B, C, M, P
    20 points: F, H, V, W, Y
    25 points: K
    40 points: J, X
    50 points: Q, Z
*/

// This will store ALL the words we will test in an array
var _words = null;

// The count of words processed
var _count = 0;

// Speed is the rate at which words are processed
var _speed = 1000;

// This will store the count of words that pass the test of 'one hundred points'
var _numWordsWorth100Points = 0;

// This array will store the ACTUAL WORDS that pass the hundred point test
var _resultArray = [];

// Flag that toggles execution of processing
var _executionPaused = true;

// This is the Object that holds the point values of each letter so that our code can 'score' each word
var _letterScores = {
    "A": 5,
    "B": 15,
    "C": 15,
    "D": 10,
    "E": 5,
    "F": 20,
    "G": 10,
    "H": 20,
    "I": 5,
    "J": 40,
    "K": 25,
    "L": 5,
    "M": 15,
    "N": 5,
    "O": 5,
    "P": 15,
    "Q": 50,
    "R": 5,
    "S": 5,
    "T": 5,
    "U": 5,
    "V": 20,
    "W": 20,
    "X": 40,
    "Y": 20,
    "Z": 50
}

function toggleExecutionState() {
    _executionPaused = !_executionPaused;

    if (document.getElementsByClassName('fa-play')[0] !== undefined) {
        document.getElementsByClassName('fa-play')[0].className = "fa fa-pause";
        // Start the processing
        generateScoresWithTimeout()
    } else {
        document.getElementsByClassName('fa-pause')[0].className = "fa fa-play";
        // Pause the process
    }
}

function generateScoresWithTimeout() {
    var nextWord = _words[_count];
    var score = calculateWordScore(nextWord);

    // Exit if we are pausing execution
    if (_executionPaused)
        return; // Change icon to pause and stop the execution

    // Test whether score is equal to 100
    if (score == 100) {
        _numWordsWorth100Points += 1;
        _resultArray.push(nextWord);
        document.getElementsByClassName('current-word')[0].innerHTML = nextWord;
        document.getElementsByClassName('num-100-point-words-value')[0].innerHTML = _numWordsWorth100Points;
        var appendWordToListVal = nextWord + ", ";
        document.getElementsByClassName('word-list')[0].innerHTML += appendWordToListVal;
        console.log('Found word: ', nextWord);
    }

    _count++;
    document.getElementsByClassName('num-words-value')[0].innerHTML = _count;

    if (_count < _words.length) {
        window.setTimeout(function() {
            generateScoresWithTimeout();
        }, _speed);
    }
}

/**
 * Utility function that is capable of scoring any word. It takes a single parameter
 * that should be of type String and returns the score as a number to the calling code
 * @param  {String} wordToScore the word whose score we want to know
 * @return {Number} the score of the word
 */
function calculateWordScore(wordToScore) {
    // First check that we have been given a String
    if (typeof wordToScore !== "string") {
        console.error("wordToScore MUST be a String!");
        return;
    }

    // We will need a running score
    var score = 0;

    // We need to loop round each character of the word
    for (var i = 0; i < wordToScore.length; i++) {
        // Get next letter
        var letter = wordToScore.charAt(i);

        // Validate the letter. If NOT a letter - skip to the next one
        if (letter.match(/[^a-zA-Z]/) !== null)
            continue; // skip to the next letter

        // Update the score with the letter score
        score += _letterScores[letter.toUpperCase()];
    }
    // Finally RETURN the score of the word
    return score;
}

/**
 * Utility function that loads a local data file in JSON (Javascript Object Notation) format
 * @param  {String} path    the path to the file
 * @param  {Function} success function takes a single parameter - data returned
 * @param  {Function} error   function takes a single parameter - xhr object
 * @return n/a
 */
function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
                }
            else {
                if (error)
                    error(xhr);
                }
            }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

/**
 * Standard on load (of webpage) function. This code loads the JSON words file into
 * the _words array.
 * @return n/a
 */
window.onload = function() {
    console.log('Loaded page...');

    // Slider Without JQuery
    var slider = new Slider('#ex1', {
        formatter: function(value) {
            // Change the speed as a result of
            _speed = value;
        }
    });

    loadJSON('words.json', function(data) {
        console.dir(data);
        _words = data;
    }, function(xhr) {
        console.error(xhr);
    });
}
