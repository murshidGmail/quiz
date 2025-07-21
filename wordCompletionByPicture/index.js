const url = "https://sheets.googleapis.com/v4/spreadsheets/";
const spreadsheetId = "1Ot6zIoe66dUYzOqZ4IHSKxp6I_yf9IMh4chSoESdGEk";
const apiKey = "AIzaSyB5dtBwq-qojLDt5tGE9fMj53bQI7J3QPo";
const sheetName = "ListOfQuizesPictures"; // Replace with the name of your sheet
const firstQuestionCellName = "A2"; // it could be 'A1' , 'A2' or 'A3'
const lastColumnLetter = "E"; // it could be 'A', 'D', 'F'
let listOfQuizes = [];
let title, description, sheetValue, image, quizType;

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
console.log(final_url);

fetch(final_url)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuizes) => {
    listOfQuizes = loadedQuizes.values.map((loadedQuiz) => {
      listOfQuizes = [...loadedQuiz];
      // 0 = title, 1 = sheetName, 2= type , 3 = description, 4 = image
      title = listOfQuizes[0];
      sheetValue = listOfQuizes[1];
      quizType = listOfQuizes[2];
      description = listOfQuizes[3];
      image = listOfQuizes[4];

      // Get the container element
      var container = document.getElementById("container");
      // Iterate through the JSON data and create cards

      container.innerHTML += `
      <div class="col-md-4 mt-3">
      <div class="card text-center border border-danger" >
      <h5 class="card-header text-info">${title}</h5>
        <img
          class="card-img-top"
          src=${image}
          alt="Card Image"
        />
        <div class="card-body">
          <p class="card-text">${description}</p>
          <div>
          <button
          type="button"
            onclick='learnPage("${sheetValue}", "${quizType}")'
            class="btn btn-primary"
            value=${sheetValue}
            >Learn</button>
          <button
          type="button"
            onclick='quizPage("${sheetValue}", "${quizType}")'
            class="btn btn-primary"
            value=${sheetValue}
            >Start Quiz</button>
          </div>
        </div>
      </div>
      </div>
      `;
    });
  })
  .catch((err) => {
    console.error(err);
  });

function quizPage(sheetValue, quizType) {
  //console.log(sheetValue);
  window.location.assign(
    "wordCompletionByPicture.html?sheetName=" +
      sheetValue +
      "&quizType=" +
      quizType
  );
}

function learnPage(sheetValue, quizType) {
  //console.log(sheetValue);
  window.location.assign(
    "wordCompletionByPictureLearn.html?sheetName=" +
      sheetValue +
      "&quizType=" +
      quizType
  );
}
