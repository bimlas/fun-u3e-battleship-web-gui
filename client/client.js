document.addEventListener('DOMContentLoaded', event => {
  document.querySelector('#settings').addEventListener('submit', handleJoinToGameEvent);
  document.addEventListener('keydown', handleKeyboardEvent);
});

function handleJoinToGameEvent(event) {
  event.preventDefault();
  postToServer('/snake', 'joinGame', initGame);
  updateGameStateContinously();

  function updateGameStateContinously() {
    updateGameState();
    setTimeout(updateGameStateContinously, 100);
  }
}

function updateGameState() {
  getFromServer('/snake', initGame);
}

function handleKeyboardEvent(event) {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      postToServer('/snake', 'moveNorth');
      break;
    case 'ArrowDown':
      event.preventDefault();
      postToServer('/snake', 'moveSouth');
      break;
    case 'ArrowRight':
      event.preventDefault();
      postToServer('/snake', 'moveEast');
      break;
    case 'ArrowLeft':
      event.preventDefault();
      postToServer('/snake', 'moveWest');
      break;
  }
}

function getFromServer(path, callback) {
  const
    Http = new XMLHttpRequest(),
    url = document.querySelector('#server-address-input').value;

  Http.open("GET", `${url}${path}`);
  Http.send();

  Http.onreadystatechange = (e) => {
    if (Http.readyState === 4 && Http.status === 200) {
      callback(JSON.parse(Http.responseText));
    }
  }
}

function postToServer(path, action, callback) {
  const
    Http = new XMLHttpRequest(),
    url = document.querySelector('#server-address-input').value,
    playerName = document.querySelector('#player-name-input').value,
    data = {
      playerName: playerName,
      action: action,
    };

  Http.open("POST", `${url}${path}`);
  Http.send(JSON.stringify(data));

  Http.onreadystatechange = (e) => {
    if (Http.readyState === 4 && Http.status === 200) {
      callback(JSON.parse(Http.responseText));
    }
  }
}

function initGame(board) {
  const
    numberOfColumns = board[0].length,
    numberOfRows = board.length;

  document.querySelectorAll('.cell').forEach(cell => cell.remove());

  document.querySelectorAll('.battlefield').forEach(battlefield => {
    for (let y = 0; y < numberOfRows; y++) {
      for (let x = 0; x < numberOfColumns; x++) {
        const cell = createCell(numberOfColumns, numberOfRows);
        cell.classList.add(`x${x}`);
        cell.classList.add(`y${y}`);
        if (board[y][x] === 1) {
          cell.classList.add('active');
        }
        battlefield.appendChild(cell);
      }
    }
  });
}

function createCell(numberOfColumns, numberOfRows) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.style.width = `${100 / numberOfColumns}%`;
  cell.style.height = `${100 / numberOfRows}%`;
  return cell;
}