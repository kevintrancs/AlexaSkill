const getUserChoice = userInput => {
  userInput = userInput.toLowerCase();
  if(userInput === 'rock' || userInput === 'scissors' || userInput === 'paper' || userInput === 'bomb'){
    return userInput;
  } else{
    return 'Error: Not valid input';
  }
}
function getComputerChoice(){
  switch(Math.floor(Math.random() * 3)){
    case 0:
      return 'rock';
      break;
    case 1: 
      return 'paper';
      break;
    case 2:
      return 'scissors';
      break;
    default:
      return 'Try again';
      break;
  }
}
function determineWinner(userChoice, computerChoice){
  if(userChoice === computerChoice){
    return 'It\'s a tie!';
    // Secret cheat code, bomb makes user win every time
  } else if(userChoice === 'bomb'){
    return 'User wins';
  } else if(userChoice === 'rock'){
    if(computerChoice === 'paper'){
      return 'Computer wins';
    } else{
      return 'User wins';
    }
  } else if(userChoice === 'paper'){
    if(computerChoice === 'scissors'){
      return 'Computer wins';
    } else {
      return 'User wins';
    }
  }
  else if(userChoice === 'scissors'){
    if(computerChoice === 'rock'){
      return 'Computer wins';
    } else {
      return 'User wins';
    }
  }
}
function playGame(){
  let userChoice = getUserChoice('bomb');
  let computerChoice = getComputerChoice();
  console.log(`User chooses ${userChoice} and computer chooses ${computerChoice}.`);
  console.log(determineWinner(userChoice, computerChoice))
}
playGame();
