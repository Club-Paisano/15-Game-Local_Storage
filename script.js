//jshint esversion: 9
/*

Author: Anthony Noel
This page is a rock paper scissors game with a GUI and local storage saving
Future Dev:
-Make it so that when the player clicks a button, the user can't click it again before the round is over
-Fix the timer
-the round thing only goes to 10
*/

const playerButtons = Array.from(document.querySelectorAll("button"));
const computerButton = document.querySelector("div[data-computer]");
const scoreElements = document.querySelectorAll(".score h2");
const countdownElement = document.querySelector(".countdown");
const roundElement = document.querySelector(".round");
roundElement.textContent = localStorage.getItem("round") || "Round 0";
let score =  JSON.parse(localStorage.getItem('score')) || {
  Wins: 0,
  Ties: 0,
  Losses: 0
};

const computerPlay = () => {
  //slide out the computer span item
  computerButton.classList.add("inactive");
  computerButton.classList.add("buttonSelect");
  //Create an Array with "Rock", "Paper", "Scissors"
  const options = ["rock", "paper", "scissors"];
  //Choose a Random number between 0-2
  const selection = Math.floor(Math.random() * 3);

  //change the comp image to match its selection
  let button = playerButtons.find(button => button.dataset.pselect === options[selection]);
  let compuButtonText =computerButton.querySelector("h1");
  compuButtonText.textContent = button.textContent;
  //Choose the computer's selection from the array according to the number
  //Return that selection string
  return options[selection];
};

const playerPlay = (pChoice) => {
  //Disable the other 2 buttons that aren't the same as the pChoice value that was passed
  playerButtons.forEach(button => {
    if (button.dataset.pselect != pChoice) {
      button.disabled = true;
      if(button.classList.contains("buttonSelect")) button.classList.remove("buttonSelect");
    } else button.classList.add("buttonSelect");
  });

  // return the player selection value
  return pChoice;

};


function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      resolve(ms);
    }, ms );
  });
}


const playRound = (playerSelection, computerSelection) => {
  //Update the round
  // debugger;

  roundElement.textContent = `Round ${parseInt(roundElement.textContent[roundElement.textContent.length-1]) + 1}`;
  localStorage.setItem("round", roundElement.textContent);
  //Start the timer for 3 secs updating the countdown element
  // for (let countdown = 3; countdown >= 0; countdown--) {
  //     countdownElement.textContent= countdown;
  //     await wait(1000);
  // }

  computerButton.classList.remove("inactive");


  //calculate who won
  //Update the score
  console.log(`Player chose ${playerSelection} and the computer chose ${computerSelection}`);

  //Variable to hold the result of the comparison between the selectors
  let result;
  //Compare the player's selection to the computer's and if the computer wins make the results


  //If it's a tie and return immediately
  if (playerSelection === computerSelection) {
    return "You Tie!";

  }

  // If the pair is “rock, paper”, the paper wins
  // If the pair is “scissors, paper”, the scissors wins
  // If the pair is “scissors, rock”, the rock wins
  if (playerSelection === "rock") {
    if (computerSelection === "paper") {
      result = "You Lose!";
    } else if (computerSelection === "scissors") {
      result = "You Win!";
    }
  } else if (playerSelection === "paper") {
    if (computerSelection === "scissors") {
      result = "You Lose!";
    } else if (computerSelection === "rock") {
      result = "You Win!";
    }
  } else if (playerSelection === "scissors") {
    if (computerSelection === "rock") {
      result = "You Lose!";
    } else if (computerSelection === "paper") {
      result = "You Win!";
    }
  }


  //return the result
  return result;
};

const updateScreenScore = (scoreObj) => {
  //set the h2s textcontent for the scoreelements equal to the according score obj's number
  scoreElements.forEach(scoreElement => {
    scoreElement.textContent = `${scoreElement.dataset.score}: `+scoreObj[`${scoreElement.dataset.score}`];
  });


};

const calcScore = (resultString, currentScore) => {
  //Search the result string for the word "win", "tie", or "lose"
  //depending on which is found increase the indicated currentScore's Object value

  if (resultString.indexOf("Win") > -1) {
    //
    currentScore.Wins++;
  } else if (resultString.indexOf("Tie") > -1) {
    currentScore.Ties++;
  } else if (resultString.indexOf("Lose") > -1) {
    currentScore.Losses++;
  }


  //Update the score element on the screen as well
  updateScreenScore(score);


};

const game = (e) => {


  //Call the playerPlay function and pass it the dataset-pSelect of the button
  //catch the returned player value
  const playerSelection = playerPlay(e.target.dataset.pselect);

  //Get a computer selection and catch the returned value
  const computerSelection = computerPlay();

  //Play a round + update the round counter + start the timer
  const result = playRound(playerSelection, computerSelection);
  //Calculate and update the score

  calcScore(result, score);

  //inable the buttons
  playerButtons.forEach(button => button.disabled = false);

  localStorage.setItem('score', JSON.stringify(score));
};

playerButtons.forEach(button => button.addEventListener("click", game));
updateScreenScore(score);
