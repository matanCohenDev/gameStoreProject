let playerone, playertwo;
let player1color = 'rgb(244, 65, 65)';
let player2color = 'rgb(66, 134, 244)';

const startBtn = document.getElementById("start");
const nameInput = document.getElementById("nameInput");
let playtTime = document.getElementById("timeforplay");

let timer;
let timeLeft;

// Display the input modal
function inputs() {
  startBtn.style.display = "none";
  nameInput.style.display = "block";
}

// Close the input modal
function Close() {
  nameInput.style.display = "none";
  startBtn.style.display = "block";
}

let currentPlayer = 1;
let currentName;
let currentColor;

// Function to initialize names and start the game
function namesInput() {
  nameInput.style.display = "none";
  document.getElementById("gamepage").style.display = "block";

  const plr1 = document.getElementById("player1");
  playerone = plr1.value || "Player 1";
  const plr2 = document.getElementById("player2");
  playertwo = plr2.value || "Player 2";

  currentName = playerone;
  currentColor = player1color;

  $(".plyr1").text(playerone + ", it is your turn!").css("color", "red");
  $(".plyr2").text(playertwo).css("color", "blue");
  $(".plyr1").css("font-weight", "bolder");
  $(".plyr2").css("font-weight", "lighter");

  // Set up event listeners for button clicks on the game board
  $(".board button").on("click", function () {
    const col = $(this).closest("td").index();
    const bottomAvail = checkBottom(col);
    changeColor(bottomAvail, col, currentColor);

    if (horizontalWinCheck() || verticalWinCheck() || diagonalWinCheck()) {
      $("h1").text(currentName + " has won!");
      $("h3, h2").fadeOut("fast");
      clearInterval(timer);
      $("#timer-wrap").hide();
      return;
    }

    makeMove();
    startTimer(); // Start the timer for the next player
  });
}

// Updates the current player when a move is made
function makeMove() {
  currentPlayer = currentPlayer * -1;
  if (currentPlayer === 1) {
    currentName = playerone;
    currentColor = player1color;
    $(".plyr1").text(currentName + ", it is your turn!").css("color", "red").css("font-weight", "bolder");
    $(".plyr2").css("font-weight", "lighter");
    $("#timer-wrap").css("background-color", "red");
  } else {
    currentName = playertwo;
    currentColor = player2color;
    $(".plyr2").text(currentName + ", it is your turn!").css("color", "blue").css("font-weight", "bolder");
    $(".plyr1").css("font-weight", "lighter");
    $("#timer-wrap").css("background-color", "blue");
  }
}

// Check the color of a button at a specific row and column
function returnColor(row, col) {
  return $("table tr").eq(row).find("td").eq(col).find("button").css("background-color");
}

// Change the color of a button at a specific row and column
function changeColor(row, col, color) {
  $("table tr").eq(row).find("td").eq(col).find("button").css("background-color", color);
}

// Check the lowest available row in a column
function checkBottom(col) {
  for (let row = 5; row >= 0; row--) {
    if (returnColor(row, col) === "rgb(128, 128, 128)") {
      return row;
    }
  }
}

// Check for a matching sequence of four colors
function colorMatchCheck(one, two, three, four) {
  return (
    one === two &&
    one === three &&
    one === four &&
    one !== "rgb(128, 128, 128)" &&
    one !== undefined
  );
}

// Check for horizontal wins
function horizontalWinCheck() {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        colorMatchCheck(
          returnColor(row, col),
          returnColor(row, col + 1),
          returnColor(row, col + 2),
          returnColor(row, col + 3)
        )
      ) {
        return true;
      }
    }
  }
}

// Check for vertical wins
function verticalWinCheck() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      if (
        colorMatchCheck(
          returnColor(row, col),
          returnColor(row + 1, col),
          returnColor(row + 2, col),
          returnColor(row + 3, col)
        )
      ) {
        return true;
      }
    }
  }
}

// Check for diagonal wins
function diagonalWinCheck() {
  for (let row = 5; row >= 3; row--) {
    for (let col = 0; col < 4; col++) {
      if (
        colorMatchCheck(
          returnColor(row, col),
          returnColor(row - 1, col + 1),
          returnColor(row - 2, col + 2),
          returnColor(row - 3, col + 3)
        ) ||
        colorMatchCheck(
          returnColor(row - 3, col),
          returnColor(row - 2, col + 1),
          returnColor(row - 1, col + 2),
          returnColor(row, col + 3)
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

// Timer functions
function skipCurrentPlayer() {
  makeMove();
  startTimer();
}

function updateTimer() {
  timeLeft -= 1;
  if (timeLeft >= 0) {
    $("#timer").text(timeLeft);
  } else {
    skipCurrentPlayer();
  }
}

function startTimer() {
  timeLeft = playtTime.value ? parseInt(playtTime.value) : 30;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
  updateTimer();
}
