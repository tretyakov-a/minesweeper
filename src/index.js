import './styles/index.scss';

import { options, cellSize } from './js/constants';
import GameState from './js/game-state';
import Cell from './js/cell';

const cellClass = 'game-field__cell';
const setModificator = name => `${cellClass}_${name}`;
const cellModificators = {
  closed: setModificator('closed'),
  flagged: setModificator('flagged'),
  empty: setModificator('empty'),
  mine: setModificator('mine'),
  number: setModificator('number-'),
  highlighted: setModificator('highlighted'),
}

const currentDifficulty = options.difficulty.medium;

const gameState = new GameState(currentDifficulty);

const cells = {};

const gameContainer = document.querySelector('.game');
const gameField = renderGameField();
gameField.addEventListener('mousedown', handleGameFieldMouseDown);
gameField.addEventListener('mouseup', handleGameFieldMouseUp);
gameField.addEventListener('contextmenu', handleGameFieldRightClick);

gameContainer.insertAdjacentElement('afterbegin', gameField);

const message = document.createElement('div');
gameContainer.insertAdjacentElement('afterbegin', message);

document.addEventListener('mouseup', handleDocumentMouseUp);
let highlightedCells = null;

function createCell(cellKey) {
  const cell = document.createElement('td');
  cell.classList.add(cellClass);
  cell.classList.add(cellModificators.closed);
  cell.dataset.key = cellKey;
  cell.dataset.state = Cell.STATE_CLOSED;
  return cell;
}

function renderGameField() {
  const { width, height } = currentDifficulty;
  const table = document.createElement('table');
  table.classList.add('game-field');

  for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
    const row = document.createElement('tr');
    for (let colIdx = 0; colIdx < width; colIdx += 1) {
      const cellKey = toCellKey([rowIdx, colIdx]);
      const cell = createCell(cellKey);
      cells[cellKey] = cell;
      row.insertAdjacentElement('beforeend', cell);
    }
    table.insertAdjacentElement('beforeend', row);
  }
  return table;
}

function getCellModificator(value) {
  if (Cell.isNumberValue(value)) {
    return cellModificators.number + value;
  } else if (value === Cell.VALUE_MINE) {
    return cellModificators.mine;
  }
}

function splitCellKey(key) {
  return key.split('-').map(Number);
}

function toCellKey([rowIdx, colIdx]) {
  return `${rowIdx}-${colIdx}`;
}

function applyState() {
  Object.keys(cells).forEach(key => {
    const [ rowIdx, colIdx ] = splitCellKey(key);
    const cell = gameState.getCell(rowIdx, colIdx);
    const cellEl = cells[key];
    const cellElState = +cellEl.dataset.state;
    if (cell.isOpened && cellElState !== Cell.STATE_OPENED) {
      cellEl.dataset.state = Cell.STATE_OPENED;
      cellEl.classList.remove(cellModificators.closed);
      cellEl.classList.add(getCellModificator(cell.value));

    } else if (cell.isFlagged && cellElState !== Cell.STATE_FLAGGED) {
      cellEl.dataset.state = Cell.STATE_FLAGGED;
      cellEl.classList.remove(cellModificators.closed);
      cellEl.classList.add(cellModificators.flagged);

    } else if (cell.isClosed && cellElState !== Cell.STATE_CLOSED) {
      cellEl.dataset.state = Cell.STATE_CLOSED;
      cellEl.classList.remove(cellModificators.flagged);
      cellEl.classList.add(cellModificators.closed);
    }
  })
}

function handleGameFieldMouseUp(e) {
  const cellEl = e.target.closest('.game-field__cell');
  if (cellEl) {
    const [ rowIdx, colIdx ] = splitCellKey(cellEl.dataset.key);
    const cell = gameState.getCell(rowIdx, colIdx);
    if (e.button === 0) {
      gameState.openCell(rowIdx, colIdx);

      if (cell.isMined) {
        console.log('You`r looser!');
      }
    }
    if (e.button === 2) {
      gameState.flagCell(rowIdx, colIdx);
    }
    applyState();
  }
}

function handleGameFieldRightClick(e) {
  e.preventDefault();
}

function handleDocumentMouseUp(e) {
  if (highlightedCells !== null) {
    highlightedCells.forEach(key => cells[key].classList.remove(cellModificators.highlighted));
    highlightedCells = null;
  }
}


function handleGameFieldMouseDown(e) {
  e.preventDefault();
  const cell = e.target.closest('.game-field__cell');
  if (cell) {
    const [ rowIdx, colIdx ] = splitCellKey(cell.dataset.key);
    if (e.button === 0) {
      const cell = gameState.getCell(rowIdx, colIdx);
      if (cell.isOpened && cell.isNumber) {
        highlightedCells = gameState
          .getHighlightedCells(rowIdx, colIdx)
          .map(toCellKey);
        highlightedCells
          .forEach(key => cells[key].classList.add(cellModificators.highlighted));
      }
    }
  }
}