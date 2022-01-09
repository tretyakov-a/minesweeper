import './styles/index.scss';

import { options, cellSize } from './js/constants';

const cellClass = 'game-field__cell';
const cellModificators = {
  closed: `${cellClass}_closed`,
  empty: `${cellClass}_empty`,
  mine: `${cellClass}_mine`,
  number: `${cellClass}_number-`,
}

const currentDifficulty = options.difficulty.medium;

const gameState = generateZeroMatrix(currentDifficulty);
generateMines(currentDifficulty);
fillGameStateWithNumbers();

const gameField = document.querySelector('.game');
gameField.insertAdjacentElement('afterbegin', generateGameField(currentDifficulty));
gameField.addEventListener('click', handleGameFieldClick);

function generateZeroMatrix({ width, height}) {
  const matrix = [];
  for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateMines({ mines: minesNumber, width, height}) {
  const mines = [];
  for (let k = 0; k < minesNumber; k += 1) {
    let rowIdx, colIdx, cellIdx;
    do {
      rowIdx = randomNumber(0, height);
      colIdx = randomNumber(0, width);
      cellIdx = `${rowIdx}-${colIdx}`;
    } while (mines.find(el => el === cellIdx));
    mines.push(cellIdx);
    gameState[rowIdx][colIdx] = '*';
  }
  return mines;
}

function generateGameField(difficulty) {
  const { width, height} = difficulty;
  const table = document.createElement('table');
  table.classList.add('game-field');

  for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
    const row = document.createElement('tr');
    for (let colIdx = 0; colIdx < width; colIdx += 1) {
      const cellIdx = `${rowIdx}-${colIdx}`;
      const cell = document.createElement('td');
      cell.classList.add(cellClass);
      cell.classList.add(cellModificators.closed);
      cell.dataset.idx = cellIdx;

      // openCell(cell); // dev

      row.insertAdjacentElement('beforeend', cell);
    }
    table.insertAdjacentElement('beforeend', row);
  }

  return table;
}


function openCell(cell) {
  const [rowIdx, colIdx] = cell.dataset.idx.split('-');
  const cellValue = gameState[rowIdx][colIdx];
  let newModificator = cellModificators.empty;
  cell.classList.remove(cellModificators.closed);

  if (cellValue > 0  && cellValue <= 8) {
    newModificator = cellModificators.number + cellValue;
  } else if (cellValue === '*') {
    newModificator = cellModificators.mine;
  }
  cell.classList.add(newModificator);
}

function handleGameFieldClick(e) {
  const cell = e.target.closest('td');
  if (cell) {
    openCell(cell);
  }
}

function fillGameStateWithNumbers() {
  const checkCell = (i, j) => (
    gameState[i] !== undefined
    && gameState[i][j] !== undefined
    && gameState[i][j] === '*'
  );

  const countNeighboringMines = (i, j) => {
    const checks = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    return checks.reduce((counter, [dx, dy]) => counter += checkCell(i + dx, j + dy), 0);
  }

  for (let i = 0; i < gameState.length; i += 1) {
    for (let j = 0; j < gameState[i].length; j += 1) {
      if (gameState[i][j] !== '*') {
        gameState[i][j] = countNeighboringMines(i, j);
      }
    }
  }
}