const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let totalQuestions = 0;
let questions = [];

// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const questionType = urlParams.get("quizType");
const sheetName = urlParams.get("sheetName");
if (questionType === "image") {
  const questionTypeImage = document.createElement("img");
  questionTypeImage.setAttribute("id", "question");
  questionTypeImage.style.width = "50%";
  questionTypeImage.style.height = "25%";
  //const question = document.getElementById('question');
  document.getElementById("questionContainer").appendChild(questionTypeImage);
} else if (questionType === "text") {
  const questionTypeText = document.createElement("h2");
  questionTypeText.setAttribute("id", "question");
  document.getElementById("questionContainer").appendChild(questionTypeText);
  //const question = document.getElementById('question');
} else if (questionType === "voice") {
  const questionTypeVoice = document.createElement("audio");
  questionTypeVoice.setAttribute("id", "question");
  questionTypeVoice.setAttribute("controls", "controls");
  document.getElementById("questionContainer").appendChild(questionTypeVoice);
  const answerDiv = document.createElement("h1");
  answerDiv.setAttribute("id", "CorrectAnswerH1");
  document.getElementById("correctAnswerContainer").appendChild(answerDiv);
}

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

//const url ='https://sheets.googleapis.com/v4/spreadsheets/1Ot6zIoe66dUYzOqZ4IHSKxp6I_yf9IMh4chSoESdGEk/values/Th1U2!A4:E?key=AIzaSyB5dtBwq-qojLDt5tGE9fMj53bQI7J3QPo';
fetch(final_url)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.values.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion[0],
        correctAnswerWord: loadedQuestion[1],
      };
      totalQuestions = loadedQuestions.values.length;

      // creat a list for the options without the first item which is the correct answer
      // we will be adding the correct answer to the list later using splice
      const answerChoices = [...loadedQuestion.slice(2)];
      // generate random number for the correct answer location in the list of options
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;

      // add the correct answer choice to the 3 items so the
      // list will be 4 items
      // the first paramerer is the location of the answer= it will be shuffled
      // second parameter to not delete any item in the list
      // third parameter is the data you want to insert whichi is
      // loadedQuestion[1] = the correct answer
      answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion[1]);

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 50;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= totalQuestions) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${totalQuestions}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / totalQuestions) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  //console.log(currentQuestion);
  if (questionType === "image") {
    question.src = currentQuestion.question;
  } else if (questionType === "text") {
    question.innerHTML = currentQuestion.question;
  } else if (questionType === "voice") {
    question.src = currentQuestion.question;
    CorrectAnswerH1.innerHTML = currentQuestion.correctAnswerWord;
  }

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

let nextBTN = document.getElementById("nextBTN");
nextBTN.addEventListener("click", (e) => {
  getNewQuestion();
});
