let boxes = document.querySelector("#boxes");
let definitionDiv = document.querySelector("#definition");
let word;
let lengthOfLetters;
let currentQuestion;
let score = 0;
let firstHalf;
let secondHalf;
let definition;

// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const sheetName = urlParams.get("sheetName");
// console.log(sheetName);

const url = "https://sheets.googleapis.com/v4/spreadsheets/";
const spreadsheetId = "1Ot6zIoe66dUYzOqZ4IHSKxp6I_yf9IMh4chSoESdGEk";
const apiKey = "AIzaSyB5dtBwq-qojLDt5tGE9fMj53bQI7J3QPo";
//const sheetName = 'images-fruits'; // Replace with the name of your sheet
const firstQuestionCellName = "A4"; // it could be 'A1' , 'A2' or 'A3'
const lastColumnLetter = "E"; // it could be 'A', 'D', 'F'

const final_url =
  url +
  spreadsheetId +
  "/values/" +
  sheetName +
  "!" +
  firstQuestionCellName +
  ":" +
  lastColumnLetter +
  "?key=" +
  apiKey;

//const final_url =
("https://sheets.googleapis.com/v4/spreadsheets/1Ot6zIoe66dUYzOqZ4IHSKxp6I_yf9IMh4chSoESdGEk/values/WordCompletionByPicture!A4:E?key=AIzaSyB5dtBwq-qojLDt5tGE9fMj53bQI7J3QPo");
fetch(final_url)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.values.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion[1],
        definition: loadedQuestion[0],
      };
      totalQuestions = loadedQuestions.values.length;
      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
  // game.classList.remove("hidden");
  // loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= totalQuestions) {
    localStorage.setItem("mostRecentScore", score);
    console.log("your score is: " + score);
    //go to the end page
    return window.location.assign("end.html");
  }
  questionCounter++;
  //   progressText.innerText = `Question ${questionCounter}/${totalQuestions}`;
  //   Update the progress bar
  //   progressBarFull.style.width = `${
  //    (questionCounter / totalQuestions) * 100
  //   }%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  console.log(currentQuestion.question);
  word = currentQuestion.question;
  definition = currentQuestion.definition;
  console.log(definition);
  lengthOfLetters = word.length;
  firstHalf = word.slice(0, 2);
  secondHalf = word.slice(2);
  lengthOfSecondHalf = secondHalf.length;
  //console.log(lengthOfLetters);
  availableQuesions.splice(questionIndex, 1);
  showPictureAndDefinition();
  //document.getElementById("box1").focus();
  createNextButton();
};

function showPictureAndDefinition() {
  definitionDiv.innerHTML = `<img src="${definition}" hight= 50% width=50%></img>`;
  boxes.innerHTML = `<h1 style="color:blue">${word}</h1>`;
}

function createNextButton() {
  let check = document.getElementById("check");
  check.innerHTML = `
        <button class= "btn btn-outline-success" onclick="combineLetters()">Next -></button>
        `;
}

function combineLetters() {
  //var ids = [];
  var valuesInBoxes = [];
  var children = document.getElementById("boxes").children; //get container element children.
  for (var i = 0, len = children.length; i < len; i++) {
    //ids.push(children[i].id); //get child id.
    valuesInBoxes.push(children[i].value); //get child value
  }
  var userAnswer = valuesInBoxes.join(""); //join all letters in the array and remove the comma
  let userFinalAnswer = firstHalf + userAnswer;
  //check if answer is correct
  if (userFinalAnswer == word) {
    //alert("you are correct");
    score++;
    boxes.innerHTML = "";
    getNewQuestion();
  } else {
    //alert("wrong");
    boxes.innerHTML = "";
    getNewQuestion();
  }
}

function moveToNext(currentInput, nextInputId) {
  const maxLength = parseInt(currentInput.getAttribute("maxlength"));
  const currentLength = currentInput.value.length;

  if (currentLength >= maxLength) {
    document.getElementById(nextInputId).focus();
  }
}

// Function to split a word into two halves
function splitWord(word) {
  // Calculate the midpoint index
  var midpoint = Math.floor(word.length / 2);

  // Use the substring method to get the first half
  var firstHalf = word.substring(0, midpoint);

  // Use the substring method to get the second half
  var secondHalf = word.substring(midpoint);

  // Return an object with the two halves
  return {
    firstHalf: firstHalf,
    secondHalf: secondHalf,
  };
}
