let canvas = document.getElementById("the-game"); 
let context = canvas.getContext("2d"); 
let game, snake, food; 

game = {
  score: 0, 
  over: false, 
  message: null, 

  start: function() { 
    game.over = false; 
    game.message = null; 
    game.score = 0; 
    snake.init(); 
    food.set(); 
  },

  stop: function() { 
    game.over = true; 
    game.message = 'GAME OVER - PRESS SPACEBAR'; 
  },

  drawBox: function(x, y, size, color) { 
    context.fillStyle = color; 
    context.beginPath(); 
    context.moveTo(x - (size / 3), y - (size / 3)); 
    context.lineTo(x + (size / 3), y - (size / 3)); 
    context.lineTo(x + (size / 3), y + (size / 3)); 
    context.lineTo(x - (size / 3), y + (size / 3)); 
    context.closePath(); 
    context.fill(); 
  },

  drawScore: function() { 
    context.fillStyle = '#999'; 
    context.font = (canvas.height) + 'px Impact, sans-serif'; 
    context.textAlign = 'center'; 
    context.fillText(game.score, canvas.width / 2, canvas.height * 0.9); 
  },

  drawMessage: function() { 
    if (game.message !== null) { 
      context.fillStyle = '#00F'; 
      context.font = (canvas.height / 10) + 'px Impact'; 
      context.textAlign = 'center'; 
      context.fillText(game.message, canvas.width / 2, canvas.height / 2); 
      context.strokeText(game.message, canvas.width / 2, canvas.height / 2); 
    }
  },

  resetCanvas: function() { 
    context.clearRect(0, 0, canvas.width, canvas.height); 
  }
};

snake = {
  size: canvas.width / 40, 
  x: null, 
  y: null, 
  color: '#0F0', 
  direction: 'left', 
  sections: [], 

  init: function() { 
    snake.sections = []; 
    snake.direction = 'left'; 
    snake.x = canvas.width / 2 + snake.size / 2; 
    snake.y = canvas.height / 2 + snake.size / 2; 
    
    for (let i = snake.x + (5 * snake.size); i >= snake.x; i -= snake.size) 
      snake.sections.push(i + ',' + snake.y); 
  },
  

  move: function() { 
    switch (snake.direction) { 
      case 'up': 
        snake.y -= snake.size; 
        break;
      case 'down': 
        snake.y += snake.size; 
        break;
      case 'left': 
        snake.x -= snake.size; 
        break;
      case 'right': 
        snake.x += snake.size; 
        break;
    }
    snake.checkCollision(); 
    snake.checkGrowth(); 
    snake.sections.push(snake.x + ',' + snake.y); 
  },

  draw: function() { 
    for (let i = 0; i < snake.sections.length; i++) 
      snake.drawSection(snake.sections[i].split(',')); 
  },

  drawSection: function(section) { 
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color); 
  },

  checkCollision: function() { 
    if (snake.isCollision(snake.x, snake.y)) 
      game.stop(); 
  },

  isCollision: function(x, y) { 
    if (x <= 0  || x > canvas.width || y <= 0 || y > canvas.height || snake.sections.indexOf(x + ',' + y) >= 0) 
      return true; 
  },

  checkGrowth: function() { 
    if (snake.x == food.x && snake.y == food.y) { 
      game.score++; 
      food.set(); 
    }
     else 
      snake.sections.shift(); 
  }

};

food = {
  size: null, 
  x: null, 
  y: null, 
  color: '#0FF', 

  set: function() { 
    food.size = snake.size; 
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2; 
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2; 
  },

  draw: function() { 
    game.drawBox(food.x, food.y, food.size, food.color); 
  }
};

let inverseDirection = { 
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

let keys = { 
  up: [38, 75, 87], 
  down: [40, 74, 83], 
  left: [37, 65, 72], 
  right: [39, 68, 76], 
  start_game: [13, 32] 
};

function getKey(value) { 
  for (let key in keys) 
    if (keys[key].indexOf(value) >= 0)  
      return key; 
  return null; 
}

addEventListener("keydown", function (e) { 
  let lastKey = getKey(e.keyCode); 
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0 && lastKey != inverseDirection[snake.direction]) 
      snake.direction = lastKey; 
    else if (['start_game'].indexOf(lastKey) >= 0 && game.over) 
      game.start(); 
}, false);

function loop() { 
  if (game.over == false) { 
    game.resetCanvas(); 
    game.drawScore();
    snake.draw();
    snake.move();  
    food.draw();
    game.drawMessage(); 
  }
  setTimeout(function(){ 
    loop();
  }, 100); 
}

loop(); 
