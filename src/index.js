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

const toCellKey = ([rowIdx, colIdx]) => `${rowIdx}-${colIdx}`;

const currentDifficulty = options.difficulty.medium;

const gameState = new GameState(currentDifficulty);

const cells = {};
const gameField = document.querySelector('.game');
gameField.insertAdjacentElement('afterbegin', renderGameField());
const message = document.createElement('div');
gameField.insertAdjacentElement('afterbegin', message);

document.addEventListener('mouseup', handleDocumentMouseUp);
let highlightedCells = null;
// applyState(); //dev


function renderGameField() {
  const { width, height} = currentDifficulty;
  const table = document.createElement('table');
  table.classList.add('game-field');

  for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
    const row = document.createElement('tr');
    for (let colIdx = 0; colIdx < width; colIdx += 1) {
      const cellKey = toCellKey([rowIdx, colIdx]);
      const cell = document.createElement('td');
      cell.classList.add(cellClass);
      cell.classList.add(cellModificators.closed);
      cell.dataset.key = cellKey;
      cell.dataset.state = Cell.STATE_CLOSED;
      cells[cellKey] = cell;

      // gameState.openCell(rowIdx, colIdx); //dev

      row.insertAdjacentElement('beforeend', cell);
    }
    table.insertAdjacentElement('beforeend', row);
  }

  table.addEventListener('mousedown', handleGameFieldMouseDown);
  table.addEventListener('click', handleGameFieldLeftClick);
  table.addEventListener('contextmenu', handleGameFieldRightClick);
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

function applyState() {
  Object.keys(cells).forEach(key => {
    const [ rowIdx, colIdx ] = splitCellKey(key);
    const { state, value } = gameState.getCell(rowIdx, colIdx);
    const cell = cells[key];
    const cellState = +cell.dataset.state;
    if (state === Cell.STATE_OPENED && cellState !== Cell.STATE_OPENED) {
      cell.dataset.state = Cell.STATE_OPENED;
      cell.classList.remove(cellModificators.closed);
      cell.classList.add(getCellModificator(value));

    } else if (state === Cell.STATE_FLAGGED && cellState !== Cell.STATE_FLAGGED) {
      cell.dataset.state = Cell.STATE_FLAGGED;
      cell.classList.remove(cellModificators.closed);
      cell.classList.add(cellModificators.flagged);

    } else if (state === Cell.STATE_CLOSED && cellState !== Cell.STATE_CLOSED) {
      cell.dataset.state = Cell.STATE_CLOSED;
      cell.classList.remove(cellModificators.flagged);
      cell.classList.add(cellModificators.closed);
    }
  })
}

function handleGameFieldLeftClick(e) {
  const cell = e.target.closest('.game-field__cell');
  if (cell) {
    const [ rowIdx, colIdx ] = splitCellKey(cell.dataset.key);
    if (e.button === 0) {
      gameState.openCell(rowIdx, colIdx);
      if (gameState.getCellValue(rowIdx, colIdx) === Cell.VALUE_MINE) {
        console.log('You`r looser!')
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
  handleGameFieldLeftClick(e);
}

function handleDocumentMouseUp(e) {
  if (highlightedCells !== null) {
    highlightedCells.forEach(key => cells[key].classList.remove(cellModificators.highlighted));
    highlightedCells = null;
  }
}


function handleGameFieldMouseDown(e) {
  const cell = e.target.closest('.game-field__cell');
  if (cell) {
    const [ rowIdx, colIdx ] = splitCellKey(cell.dataset.key);
    if (e.button === 0) {
      const { value, state } = gameState.getCell(rowIdx, colIdx);
      if (state === Cell.STATE_OPENED && Cell.isNumberValue(value)) {
        highlightedCells = gameState.getHighlightedCells(rowIdx, colIdx).map(toCellKey);
        highlightedCells.forEach(key => cells[key].classList.add(cellModificators.highlighted));
      }
    }
  }
}