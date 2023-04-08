//Importing the "random-words" module
const randomWords = require('random-words');

//Function to write a random word from the english language
function writeRandomWord() {
  //Get a random word from the module
  const word = randomWords();
  //Log the word to the console
  console.log(word);
}

//Exporting the function
module.exports = writeRandomWord;