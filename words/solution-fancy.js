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
var _count = 0;

// This will store the count of words that pass the test of 'one hundred points'
var _numWordsWorth100Points = 0;

// This array will store the ACTUAL WORDS that pass the hundred point test
var _resultArray = [];

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

function generateScores() {
    // Loop around each word
    for (var i = 0; i < _words.length; i++) {
        // Get next word
        var nextWord = _words[i];
        var score = calculateWordScore(nextWord);

        // Test whether score is equal to 100
        if (score == 100) {
            _numWordsWorth100Points += 1;
            _resultArray.push(nextWord);
        }
    }
    console.dir(_resultArray);
}

function generateScoresWithTimeout() {
    var nextWord = _words[_count];
    var score = calculateWordScore(nextWord);

    // Test whether score is equal to 100
    if (score == 100) {
        _numWordsWorth100Points += 1;
        _resultArray.push(nextWord);
        document.getElementsByClassName('current-word')[0].innerHTML = nextWord;
        console.log('Found word: ', nextWord);

    }

    _count++;

    if (_count < _words.length) {
        window.setTimeout(function() {
            generateScoresWithTimeout();
        }, 200);
    }
    console.log("count");
}

function logResults(json) {
    console.log(json);
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
    loadJSON('words.json', function(data) {
        console.dir(data);
        _words = data;
    }, function(xhr) {
        console.error(xhr);
    });
}
