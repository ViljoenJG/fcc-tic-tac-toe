let originalBoard;
let human = 'X';
let ai = 'O';

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

function toggleWeapon(weapon) {
  human = weapon;
  ai = weapon === 'X' ? 'O' : 'X';

  document.querySelector('#weapon').innerText = weapon;

  document
    .getElementById(weapon === 'X' ? 'chooseX' : 'chooseO')
    .classList.toggle('weapon-selected');

    document
      .getElementById(weapon === 'O' ? 'chooseX' : 'chooseO')
      .classList.toggle('weapon-selected');
}

function startGame() {
  document.querySelector('.complete').style.display = 'none';
  document.querySelector('.complete .text').innerText = '';
  document.querySelector('#choose-weapon').style.display = 'block';
  originalBoard = Array.from(Array(9).keys());

  cells.forEach(function(cell) {
    cell.innerText = '';
    cell.style.removeProperty('background-color');
    cell.addEventListener('click', handleClick, false);
  })
}

function handleClick(e) {
  hideWeaponSelector();
  if (!isNaN(Number(originalBoard[e.target.id]))) {
    turn(e.target.id, human);
    if (!checkWin(originalBoard, human) && !checkTie())
      turn(aiMove(), ai);
  }
}

function hideWeaponSelector() {
  let el = document.querySelector('#choose-weapon');
  let current = el.style.display;
  if (current !== 'none')
    el.style.display = 'none'
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
  if (availableMoves().length === 0) {
    cells.forEach(cell => {
      cell.style.backgroundColor = 'green';
      cell.removeEventListener('click', handleClick, false);
    });

    anounceWinner('It\'s a Tie')
    return true;
  }
  return false;
}

function gameOver(winner) {
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
  return originalBoard.filter(x => !isNaN(Number(x)));
}

function aiMove() {
  return getBestMove(originalBoard, ai).index;
}

function getBestMove(board, player) {
  let openSpots = availableMoves(board);

  if (checkWin(board, human)) {
    return { score: -10 };
  } else if (checkWin(board, ai)) {
    return { score: 10 };
  } else if (openSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  openSpots.forEach((spot, i) => {
    let move = { index: board[spot] };
    board[spot] = player;

    let result;

    if (player === ai) {
      result = getBestMove(board, human);
    } else {
      result = getBestMove(board, ai);
    }

    move.score = result.score;
    board[spot] = move.index;
    moves.push(move);
  });

  let bestMove;

  if (player === ai) {
    let bestScore = -10000;
    moves.forEach((move, i) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = 10000;
    moves.forEach((move, i) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}
