let gamePattern = [];
let userClickedPattern = [];
let buttonColours = ["green", "red", "yellow", "blue"];
let gameStarted = false;
let level = 0;

$(document).keypress("keypress", function (){
  if(!gameStarted){
    $("h1").text("Level " + level);
  nextSequence();
  gameStarted = true;
  }
});

$(".btn").click(function() {
  let userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel){
  if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
    if(userClickedPattern.length === gamePattern.length){
      setTimeout(function(){
        nextSequence();
      }, 1000);
    }
  }
  else{
    playSound("wrong");
    $("body").addClass("game-over");
    $("h1").text("Game Over, Press Any Key to Restart");
    setTimeout(function(){
      $("body").removeClass("game-over");
    }, 200);
    startOver();
  }
}
function nextSequence(){
  userClickedPattern = [];
  level++;
  $("h1").text("Level "+level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

  playSound(randomChosenColour);
}
function playSound(name) {
  var audio = new Audio("/public/gamesCssJs/simon-game/sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour){
$("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function startOver() {
  level = 0;
  gamePattern = [];
  gameStarted = false;
}

