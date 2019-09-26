const
  boardWidth = 20,
  boardHeight = 20,
  players = {};

let
  board;

module.exports.initGame = initGame;
function initGame() {
  createEmptyBoard(boardWidth, boardHeight);
  placeFoodRandomly();
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
  if (Object.keys(players).length === 0) {
    return;
  }

  forEachBoardCell((x, y, cellValue) => {
    if(cellValue > 0) {
      board[y][x] -= 1;
    }
  });

  Object.keys(players).forEach(playerName => {
    const player = players[playerName];

    player.head.x += player.movement.x;
    player.head.y += player.movement.y;

    if(board[player.head.y][player.head.x] < 0) {
      console.log('Megeszlek, had novekedjek!');
      player.snakeLength += 1;
      placeFoodRandomly();
    }

    if(board[player.head.y][player.head.x] > 0) {
      console.log('Tekereg a kigyo, a farkaba harap...');
      player.movement.x = player.movement.y = 0;
    }
    board[player.head.y][player.head.x] = player.snakeLength;
  });
}

module.exports.getBoard = getBoard;
function getBoard() {
  return board.map(rows => rows.map(cell => cell ? 1 : 0));
}

function createEmptyBoard(width, height) {
  board = [];
  for (let rowIndex = 0; rowIndex < height; rowIndex++) {
    board.push(new Array(width));
  }
}

function placeFoodRandomly() {
  const
    y = Math.floor(Math.random() * boardHeight),
    x = Math.floor(Math.random() * boardWidth);

  board[y][x] = -1;
}

function forEachBoardCell(callback) {
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      callback(x, y, board[y][x]);
    }
  }
}