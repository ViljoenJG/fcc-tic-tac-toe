let originalBoard;
const human = 'X';
const ai = 'O';

const winningCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [2,4,6],
  [0,3,6],
  [1,4,7],
  [2,5,8],
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
  originalBoard = Array.from(Array(9).keys());
  cells.forEach(function(cell) {
    cell.innerText = '';
    cell.style.removeProperty('background-color');
    cell.addEventListener('click', handleClick, false);
  })
}

function handleClick(e) {
  turn(e.target.id, human);
}

function turn(id, player) {
  originalBoard[id] = player;
  document.getElementById(id).innerText = player;
  let gameWon = checkWin(originalBoard, player);

  if (gameWon) {
    return gameOver(gameWon);
  }
}

function checkWin(board, player) {
  let plays = board.reduce((ac, el, i) =>
    (el === player) ? ac.concat(i) : ac, []);

  let gameWon = null;
  winningCombos.forEach((combo, index) => {
    if (combo.every(e => plays.indexOf(e) !== -1)) {
      gameWon = {index, player};
    }
  })

  return gameWon;
}

function gameOver(gameWon) {
  winningCombos[gameWon.index].forEach((i) => {
    document.getElementById(i).style.backgroundColor =
      gameWon.player === human ? 'blue' : 'red';

    cells.forEach(cell =>
      cell.removeEventListener('click', handleClick, false))
  })
}
