let originalBoard;
let gameWon = false;
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
  gameWon = false;
  document.querySelector('.complete').style.display = 'none';
  document.querySelector('.complete .text').innerText = '';
  originalBoard = Array.from(Array(9).keys()).map(() => 0);
  cells.forEach(function(cell) {
    cell.innerText = '';
    cell.style.removeProperty('background-color');
    cell.addEventListener('click', handleClick, false);
  })
}

function handleClick(e) {
  if (originalBoard[e.target.id]) return;
  turn(e.target.id, human);
  if (!checkTie()) turn(aiMove(), ai);
}

function turn(id, player) {
  originalBoard[id] = player;
  document.getElementById(id).innerText = player;
  let winner = checkWin(originalBoard, player);
  if (winner) return gameOver(winner);
}

function checkWin(board, player) {
  let plays = board.reduce((ac, el, i) =>
    (el === player) ? ac.concat(i) : ac, []);

  return winningCombos.reduce((acc, combo, index) => {
    if (!acc && combo.every(e => plays.indexOf(e) !== -1))
      return { index, player };
    return acc;
  }, null);
}

function anounceWinner(winner) {
  document.querySelector('.complete').style.display = 'block';
  document.querySelector('.complete .text').innerText = winner
}

function checkTie() {
  if (!gameWon && availableMoves().length === 0) {
    cells.forEach(cell => {
      cell.style.backgroundColor = 'green';
      cell.removeEventListener('click', handleClick, false);
    });
    return true;
  }
  return false;
}

function gameOver(winner) {
  gameWon = true;
  winningCombos[winner.index].forEach((i) => {
    document.getElementById(i).style.backgroundColor =
      winner.player === human ? 'blue' : 'red';
  })

  cells.forEach(cell =>
    cell.removeEventListener('click', handleClick, false));

  anounceWinner(winner.player === human ?
    'You are the winner!' : 'You lose...');
}

function availableMoves() {
  return originalBoard.reduce((acc, e, i) => {
    if (!e) acc.push(i);
    return acc;
  }, [])
}

function aiMove() {
  return availableMoves()[0]
}
