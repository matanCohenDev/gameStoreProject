const boardSize = 10;
const board = document.querySelector('.game-board');
let cells = [];
let thiefPosition;
let copPosition;
let carPosition;
let gameOver = false;

function createBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
    cells.push(cell);
  }
  initializeGame();
}

function initializeGame() {
  thiefPosition = 0;
  carPosition = boardSize * boardSize - 1;
  do {
    copPosition = getRandomFarPosition();
  } while (copPosition === thiefPosition || copPosition === carPosition);

  cells[thiefPosition].classList.add('thief');
  cells[copPosition].classList.add('cop');
  cells[carPosition].classList.add('car');
}

function getRandomFarPosition() {
  let pos;
  do {
    pos = Math.floor(Math.random() * boardSize * boardSize);
  } while (
    pos === thiefPosition ||
    pos === carPosition ||
    manhattanDistance(pos, thiefPosition) < 3 ||
    manhattanDistance(pos, carPosition) < 3
  );
  return pos;
}

function manhattanDistance(pos1, pos2) {
  const x1 = pos1 % boardSize;
  const y1 = Math.floor(pos1 / boardSize);
  const x2 = pos2 % boardSize;
  const y2 = Math.floor(pos2 / boardSize);
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function moveThief(direction) {
  if (gameOver) return;
  let newThiefPosition = thiefPosition;

  if (direction === 'KeyW' && thiefPosition >= boardSize && thiefPosition % boardSize !== boardSize - 1) {
    newThiefPosition -= (boardSize - 1);
  }
  if (direction === 'KeyQ' && thiefPosition >= boardSize && thiefPosition % boardSize !== 0) {
    newThiefPosition -= (boardSize + 1);
  }
  if (direction === 'KeyS' && thiefPosition < boardSize * (boardSize - 1) && thiefPosition % boardSize !== boardSize - 1) {
    newThiefPosition += (boardSize + 1);
  }
  if (direction === 'KeyA' && thiefPosition < boardSize * (boardSize - 1) && thiefPosition % boardSize !== 0) {
    newThiefPosition += (boardSize - 1);
  }
  if (direction === 'ArrowUp' && thiefPosition >= boardSize) newThiefPosition -= boardSize;
  if (direction === 'ArrowDown' && thiefPosition < boardSize * (boardSize - 1)) newThiefPosition += boardSize;
  if (direction === 'ArrowLeft' && thiefPosition % boardSize !== 0) newThiefPosition -= 1;
  if (direction === 'ArrowRight' && thiefPosition % boardSize !== boardSize - 1) newThiefPosition += 1;

  if (newThiefPosition !== thiefPosition) {
    cells[thiefPosition].classList.remove('thief');
    thiefPosition = newThiefPosition;
    cells[thiefPosition].classList.add('thief');
    if (checkGameStatus()) return;
    bfsMoveCop();
  }
}

function bfsMoveCop() {
  if (gameOver) return;
  const queue = [[copPosition]];
  const visited = new Set();
  visited.add(copPosition);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (current === thiefPosition) {
      const nextMove = path[1];
      cells[copPosition].classList.remove('cop');
      copPosition = nextMove;
      cells[copPosition].classList.add('cop');
      if (checkGameStatus()) return;
      return;
    }

    const neighbors = getNeighbors(current);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
}

function getNeighbors(pos) {
  const neighbors = [];
  if (pos >= boardSize) neighbors.push(pos - boardSize);
  if (pos < boardSize * (boardSize - 1)) neighbors.push(pos + boardSize);
  if (pos % boardSize !== 0) neighbors.push(pos - 1);
  if (pos % boardSize !== boardSize - 1) neighbors.push(pos + 1);
  return neighbors;
}

function checkGameStatus() {
  if (thiefPosition === carPosition) {
    alert('ניצחת! הגנב הגיע לרכב!');
    gameOver = true;
    resetGame();
    return true;
  } else if (thiefPosition === copPosition) {
    alert('נפסלת! השוטר תפס אותך!');
    gameOver = true;
    resetGame();
    return true;
  }
  return false;
}

function resetGame() {
  cells.forEach(cell => cell.classList.remove('thief', 'cop', 'car'));
  gameOver = false;
  initializeGame();
}

document.addEventListener('keydown', (e) => {
  const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyQ', 'KeyW', 'KeyS', 'KeyA'];
  if (validKeys.includes(e.code)) {
    moveThief(e.code);
  }
});

createBoard();
