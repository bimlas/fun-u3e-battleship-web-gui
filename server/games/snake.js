const
  boardWidth = 20,
  boardHeight = 20,
  players = {};

let
  board;

module.exports.initGame = initGame;
function initGame() {
  createEmptyBoard();
  placeFoodRandomly();
  updateGameStateContinuously();

  function updateGameStateContinuously() {
    nextTick();
    setTimeout(updateGameStateContinuously, 300);
  }
}

module.exports.addPlayer = addPlayer;
function addPlayer(name) {
  const
    centerX = Math.floor(boardWidth / 2),
    centerY = Math.floor(boardHeight / 2);

  players[name] = {
    head: {
      x: centerX,
      y: centerY
    },
    movement: {
      x: 0,
      y: 1,
    },
    snakeLength: 3,
  };
}

module.exports.playerAction = playerAction;
function playerAction(playerName, actionName) {
  switch (actionName) {
    case 'joinGame':
      addPlayer(playerName);
      break;

    case 'moveNorth':
      players[playerName].movement.x = 0;
      players[playerName].movement.y = -1;
      break;

    case 'moveSouth':
      players[playerName].movement.x = 0;
      players[playerName].movement.y = 1;
      break;

    case 'moveEast':
      players[playerName].movement.x = 1;
      players[playerName].movement.y = 0;
      break;

    case 'moveWest':
      players[playerName].movement.x = -1;
      players[playerName].movement.y = 0;
      break;
  }
}

module.exports.nextTick = nextTick;
function nextTick() {
  if (!hasPlayers()) return;

  updateSnakeCells();

  forEachPlayers(player => {
    movePlayerHead(player);
  });
}

module.exports.getBoard = getBoard;
function getBoard() {
  return board.map(rows => rows.map(cell => cell ? 1 : 0));
}

function createEmptyBoard() {
  board = [];
  for (let rowIndex = 0; rowIndex < boardHeight; rowIndex++) {
    board.push(new Array(boardWidth));
  }
}

function placeFoodRandomly() {
  const
    y = Math.floor(Math.random() * boardHeight),
    x = Math.floor(Math.random() * boardWidth);

  board[y][x] = -1;
}

function movePlayerHead(player) {
  const nextPosition = {
    x: player.head.x + player.movement.x,
    y: player.head.y + player.movement.y,
  };

  if(isOutOfBoard(nextPosition.x, nextPosition.y) || isCellOfSnake(nextPosition.x, nextPosition.y)) {
    player.movement.x = player.movement.y = 0;
    return;
  }

  player.head.x = nextPosition.x;
  player.head.y = nextPosition.y;

  if(isCellOfFood(player.head.x, player.head.y)) {
    player.snakeLength += 1;
    placeFoodRandomly();
  }

  board[player.head.y][player.head.x] = player.snakeLength;
}

function updateSnakeCells() {
  forEachBoardCells((x, y, cellValue) => {
    if(cellValue > 0) {
      board[y][x] -= 1;
    }
  });
}

function hasPlayers() {
  return Object.keys(players).length !== 0;
}

function isOutOfBoard(x, y) {
  return (x < 0 || x >= boardWidth) || (y < 0 || y >= boardHeight);
}

function isCellOfSnake(x, y) {
  return board[y][x] > 0;
}

function isCellOfFood(x, y) {
  return board[y][x] < 0;
}

function forEachBoardCells(callback) {
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      callback(x, y, board[y][x]);
    }
  }
}

function forEachPlayers(callback) {
  Object.keys(players).forEach(playerName => {
    callback(players[playerName]);
  });
}