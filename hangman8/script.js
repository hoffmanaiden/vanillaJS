const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const figureParts = document.querySelectorAll('.figure-part');

// const basicWords = ['apple', 'bear', 'cat', 'doggies'];
const realWords = require("an-array-of-english-words");
// must browserify script.js before using realWords (cause its npm)
// (terminal) browserify script.js -o bundle.js
// then include bundle.js in html

let selectedWord = realWords[Math.floor(Math.random() * realWords.length)];
// let selectedWord = basicWords[Math.floor(Math.random() * basicWords.length)];

const correctLetters = [];
const wrongLetters = [];

// show secret word
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(letter => `
        <span class="letter">
          ${correctLetters.includes(letter) ? letter : ''}
        </span>
      `)
      .join('')
    }
  `;
  // split/join above puts a \n after each letter
  // innerWord removes \n
  const innerWord = wordEl.innerText.replace(/\n/g, '');
  if(innerWord === selectedWord){
    finalMessage.innerText = `
      Congratulations!\n
      👌🤩You won!😎🎉\n
      word was ${selectedWord}
    `;
    popup.style.display = "flex";
  }
}

function updateWrongLettersEl(){
  // display wrong guesses
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;
  // add a body part
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    if(index < errors){
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });
  // Check if lost
  if(wrongLetters.length === figureParts.length){
    finalMessage.innerText = `
    GAME OVER 😕\n
    word was ${selectedWord}
    `;
    popup.style.display ="flex";;
  }
}

function showNotification(){
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

// on keydown letter press...
window.addEventListener('keydown', e => {
  // letter keycodes are 65(a) through 90(z)
  // if letter is pressed...
  if(e.keyCode >= 65 && e.keyCode <= 90){
    const letter = e.key;
    // if letter is in secret word...
    if(selectedWord.includes(letter)){
      // if letter has not been previously guessed...
      if(!correctLetters.includes(letter)){
        correctLetters.push(letter);
        displayWord();
      } else {
        // if previously guessed
        showNotification();
      }
    } else {
      // if letter is NOT in secret word
      if(!wrongLetters.includes(letter)){
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        // if previously guessed
        showNotification();
      }
    }
  }
});

// play again?
playAgainBtn.addEventListener('click', () => {
  // empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);
  // set new word
  selectedWord = realWords[Math.floor(Math.random() * realWords.length)];
  displayWord();
  updateWrongLettersEl();
  popup.style.display = 'none';
});

displayWord();


