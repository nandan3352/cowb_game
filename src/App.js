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
  const [failureMessage, setFailureMessage] = useState('');
  const [visible,setVisible]=useState(false);
  const [hints,setHints]=useState(0);
  const [hintList,setHintList]=useState([]);
  const [reveal,setReveal]=useState(0);
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

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
     setWordLength('');
    }
    else {
      const parsedValue = parseInt(inputValue, 10);

      if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 26) {
        setWordLength(parsedValue);
      } else {
        notifyError('Please enter a valid integer between 1 and 26');
      }
    }

  };

  const startNewGame = () => {
    setGuessWord('');
    setGuessList([]);
    setWordLength('');
    setHints(0);
    setReveal(0);
    setHintList([]);
    setFailureMessage('');
    setCows(0);
    setBulls(0);
    setButtonVisible(true);
    setSuccessMessage('');
    generateSecretWord();
  };

const notifyError = (message) => toast.error(message);

  const submitGuess = () => {
    if(wordLength!=0){ 
    if (guessWord.length !== parseInt(wordLength) || !/^[a-zA-Z]+$/.test(guessWord)) {
      notifyError('Please enter a valid word with the correct length.');
      return;
    }
    if (hasDuplicateCharacters(guessWord)) {
      notifyError('Duplicate characters are not allowed.');
      return;
    }
    checkGuess();}
    else{
      notifyError("Enter word length");
    }
  };
  const hasDuplicateCharacters = (word) => {
    const charSet = new Set(word);
    return charSet.size !== word.length;
  };
  const hint1 = () => {
    if(wordLength!=''){ 
    setHints((prevHints) => prevHints + 1);
    const vowels = 'aeiou';
    let vowelCount = 0;
    for (let i = 0; i < secretWord.length; i++) {
      const currentChar = secretWord[i];
      if (vowels.includes(currentChar)) {
        vowelCount++;
      }
    }
    let s;
    if(vowelCount===0) s=`There are no vowels`;
    else if(vowelCount===1) s=`There is 1 vowel`;
    else s=`There are ${vowelCount} vowels`;
    setHintList((prevHints) => [
      ...prevHints,
      s,
    ]);
  }
else{
  notifyError("Enter word length")
}};
    let randomIndex=Math.floor(Math.random() * secretWord.length);
  const hint2 = () => {
    setHints((prevHints) => prevHints + 1);
    var s1;
    if(randomIndex===0) s1=`The 1st character is ${secretWord[randomIndex]}`;
    else if(randomIndex===1) s1=`The 2nd character is ${secretWord[randomIndex]}`;
    else if(randomIndex===2) s1=`The 3rd character is ${secretWord[randomIndex]}`;
    else s1 = `The ${randomIndex+1}th character is ${secretWord[randomIndex]}`;
    setHintList((prevHints) => [...prevHints, s1]);
  };

   const revealAnswer=()=>{
 if(wordLength!='') { 
    setReveal(1);
    setButtonVisible(false);
    setVisible(false);
    setHintList([]);
    setGuessList([]);
    setCows(0);
    setBulls(0);
    setHints(3);
    let successMsg = `Failed! The correct word is ${secretWord}`;
   setFailureMessage(successMsg);
   setWordLength();}
   else{
    notifyError("Enter word length!")
    setWordLength();
   }
   }
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
      setWordLength('');
      setGuessList([]);
      setReveal(1);
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
          type="text"
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
        { hints <=2 ?(
        <div>
        {hints===0 && <button id="hint1" onClick={hint1}>Give First Hint</button>}
        {hints===1 && <button id="hint2" onClick={hint2}>Give Second Hint</button>}
        {hints===2 && <button id="hint3" >No More Hints!</button>}
        </div> ):(<div></div>)}
</div>
<div>
  {
    reveal==1 ?
     ( <div></div>):
     ( <button onClick={revealAnswer} id="hint3" >Reveal Answer</button>)
  }
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
      <div id="failureMessage">
        {failureMessage && <p style={{color: 'red'}}>{failureMessage}</p>}
      </div>
      
      <ToastContainer autoClose={6000} />
    </div>
  );
};

export default App;
