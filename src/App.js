import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [wordLength, setWordLength] = useState('');
  const [secretWord, setSecretWord] = useState('');
  const [guessWord, setGuessWord] = useState('');
  const [guessList, setGuessList] = useState([]);
  const [cows, setCows] = useState(0);
  const [bulls, setBulls] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [visible,setVisible]=useState(false);
  const [hints,setHints]=useState(0);
  const [hintList,setHintList]=useState([]);
  useEffect(() => {
    if (wordLength > 0) {
      generateSecretWord();
    }
  }, [wordLength]);

  const generateSecretWord = () => {
    const uniqueChars = 'abcdefghijklmnopqrstuvwxyz';
    let secret = '';

    while (secret.length < parseInt(wordLength)) {
      const randomChar = uniqueChars[Math.floor(Math.random() * uniqueChars.length)];
      if (!secret.includes(randomChar)) {
        secret += randomChar;
      }
    }
    setSecretWord(secret);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value >= 1 && value <= 26) {
      setWordLength(value);
    } else {
      notifyError('Word length should be between 1 and 26.');
    }
  };

  const startNewGame = () => {
    setGuessWord('');
    setGuessList([]);

    setCows(0);
    setBulls(0);
    setButtonVisible(true);
    setSuccessMessage('');
    generateSecretWord();
  };

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const submitGuess = () => {
    if (guessWord.length !== parseInt(wordLength) || !/^[a-zA-Z]+$/.test(guessWord)) {
      notifyError('Please enter a valid word with the correct length.');
      return;
    }
    if (hasDuplicateCharacters(guessWord)) {
      notifyError('Duplicate characters are not allowed.');
      return;
    }
    checkGuess();
  };
  const hasDuplicateCharacters = (word) => {
    const charSet = new Set(word);
    return charSet.size !== word.length;
  };
  const hint1 = () => {
    setHints((prevHints) => prevHints + 1);
    const vowels = 'aeiouAEIOU';
    let vowelCount = 0;
    for (let i = 0; i < secretWord.length; i++) {
      const currentChar = secretWord[i];
      if (vowels.includes(currentChar)) {
        vowelCount++;
      }
    }
    let s;
    if(vowelCount===0) s=`There are no vowels in the string`;
    else if(vowelCount===1) s=`There is 1 vowel in the string`;
    else s=`There are ${vowelCount} vowels in the string`;
    setHintList((prevHints) => [
      ...prevHints,
      s,
    ]);
  };

    let randomIndex=Math.floor(Math.random() * secretWord.length);
  const hint2 = () => {
    setHints((prevHints) => prevHints + 1);
    const s = `The character at index ${randomIndex} is ${secretWord[randomIndex]}`;
    setHintList((prevHints) => [...prevHints, s]);
  };

   
  const checkGuess = () => {
    let newCows = 0;
    let newBulls = 0;
    let newHints=0;
setVisible(true);
    for (let i = 0; i < parseInt(wordLength); i++) {
      if (secretWord.includes(guessWord[i])) {
        if (secretWord[i] === guessWord[i]) {
          newBulls++;
        } else {
          newCows++;
        }
      }
    }
    setCows(newCows);
    setBulls(newBulls);
    setGuessList((prevGuesses) => [
      ...prevGuesses,
      { guess: guessWord, cows: newCows, bulls: newBulls,hints:newHints },
    ]);
    if (newBulls === parseInt(wordLength)) {
      let successMsg = `Great! Guessed the word in ${guessList.length + 1} chances with ${hints} hints`;
      if(hints===0) successMsg = `Great! Guessed the word in ${guessList.length + 1} chances without hints`;
      setSuccessMessage(successMsg);
      setButtonVisible(false);
      setVisible(false);
      setHintList([]);
      setGuessList([]);
      setCows(0);
      setBulls(0);
      setHints(3);

    }
    setGuessWord('');
  };

  return (
    <div>
      <h1 style={{ marginTop: '50px' }}>CowBull Game</h1>
      <div>
        <button onClick={startNewGame}>Start New Game</button>
      </div>
      <div>
        <label htmlFor="wordLength">Enter word length:</label>
        <input
          type="number"
          id="wordLength"
          value={wordLength}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="guessWord">Your guess:</label>
        <input
          type="text"
          id="guessWord"
          value={guessWord}
          onChange={(e) => setGuessWord(e.target.value.toLowerCase())}
        />
        {buttonVisible && (
          <button onClick={submitGuess}>Submit Guess</button>
        )}
      </div>

<div>
        {hints <=2 ?(
        <div>
        {hints===0 && <button id="hint1" onClick={hint1}>Give First Hint</button>}
        {hints===1 && <button id="hint2" onClick={hint2}>Give Second Hint</button>}
        {hints===2 && <button id="hint3" >No More Hints!</button>}
        </div> ):(<div></div>)}
</div>

<div>
     {hintList.length > 0 && (
        <ul>
          {hintList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
</div>
      <div id="guessTable">
        {visible &&
        (
        <div>
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Bulls</th>
              <th>Cows</th>
            </tr>
          </thead>
          <tbody>
            {guessList.map((guess, index) => (
              <tr key={index}>
                <td>{guess.guess}</td>
                <td>{guess.bulls}</td>
                <td>{guess.cows}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        )}
      </div>
      <div id="successMessage">
        {successMessage && <p style={{ color: 'blue' }}>{successMessage}</p>}
      </div>
      <ToastContainer autoClose={6000} />
    </div>
  );
};

export default App;
