import Cell from './cell';
import CellKey from './cell-key';
import { GAME_FIELD_CLASS, CELL_CLASS, CELL_MODIFICATORS, MOUSE } from './constants';
import { renderNumber } from './helpers';

export default class GameField {
  constructor(difficulty, gameState) {
    this.difficulty = difficulty;
    this.gameState = gameState;
    this.cells = {};
    this.highlightedCells = null;

    this.flagsCounter = document.querySelector('.game__flags-counter-value');
  }

  render = () => {
    return this.gameField;
  }

  _createCell = (cellKey) => {
    const cell = document.createElement('td');
    cell.classList.add(CELL_CLASS);
    cell.classList.add(CELL_MODIFICATORS.closed);
    cell.dataset.key = cellKey.value;
    cell.dataset.state = Cell.STATE_CLOSED;
    return cell;
  }
  
  _createTable = () => {
    const { width, height } = this.difficulty;
    const table = document.createElement('table');
    table.classList.add(GAME_FIELD_CLASS);
    this.cells = {};

    for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
      const row = document.createElement('tr');
      for (let colIdx = 0; colIdx < width; colIdx += 1) {
        const cellKey = new CellKey(rowIdx, colIdx);
        const cellEl = this._createCell(cellKey);
        this.cells[cellKey] = cellEl;
        row.insertAdjacentElement('beforeend', cellEl);
      }
      table.insertAdjacentElement('beforeend', row);
    }
    return table;
  }
  
  getCellModificator = (value) => {
    if (Cell.isNumberValue(value)) {
      return CELL_MODIFICATORS.number + value;
    } else if (value === Cell.VALUE_MINE) {
      return CELL_MODIFICATORS.mine;
    } else if (value === Cell.VALUE_EMPTY) {
      return CELL_MODIFICATORS.empty;
    }
  }
  
  applyState = () => {
    Object.keys(this.cells).forEach(key => {
      const cellKey = new CellKey(key);
      const cell = this.gameState.getCell(cellKey);
      const cellEl = this.cells[key];
      const cellElState = +cellEl.dataset.state;

      if (cell.isOpened && cellElState !== Cell.STATE_OPENED) {
        cellEl.dataset.state = Cell.STATE_OPENED;
        cellEl.classList.remove(CELL_MODIFICATORS.closed);
        cellEl.classList.add(this.getCellModificator(cell.value));
  
      } else if (cell.isFlagged && cellElState !== Cell.STATE_FLAGGED) {
        cellEl.dataset.state = Cell.STATE_FLAGGED;
        cellEl.classList.remove(CELL_MODIFICATORS.closed);
        cellEl.classList.add(CELL_MODIFICATORS.flagged);
  
      } else if (cell.isClosed && cellElState !== Cell.STATE_CLOSED) {
        cellEl.dataset.state = Cell.STATE_CLOSED;
        cellEl.classList.remove(CELL_MODIFICATORS.flagged);
        cellEl.classList.add(CELL_MODIFICATORS.closed);
      }
    })
  }
  
  reset = (newDifficulty) => {    
    if (newDifficulty !== undefined) {
      this.difficulty = newDifficulty;
    }
    this.gameField = this._createTable();
    this.gameField.addEventListener('mousedown', this.handleGameFieldMouseDown);
    this.gameField.addEventListener('mouseup', this.handleGameFieldMouseUp);
    this.gameField.addEventListener('contextmenu', this.handleGameFieldRightClick);

    this.flagsCounter.textContent = renderNumber(this.gameState.flagsCounter);
  }

  handleLose = ({ mineKey, wrongFlagsKeys }) => {
    setTimeout(() => {
      wrongFlagsKeys.forEach(key => {
        this.cells[key].classList.replace(
          CELL_MODIFICATORS.flagged, 
          CELL_MODIFICATORS.wronglyFlagged
        );
      });
  
      this.cells[mineKey.value].classList.replace(
        CELL_MODIFICATORS.mine,
        CELL_MODIFICATORS.mineBlowned
      );
    })
    this.removeEventListeners();
  }

  handleWin = () => {
    this.removeEventListeners();
  }
  
  removeEventListeners = () => {
    this.gameField.removeEventListener('mousedown', this.handleGameFieldMouseDown);
    this.gameField.removeEventListener('mouseup', this.handleGameFieldMouseUp);
    // this.gameField.removeEventListener('contextmenu', this.handleGameFieldRightClick);
  }

  handleGameFieldMouseUp = (e) => {
    const cellEl = e.target.closest(`.${CELL_CLASS}`);
    if (!cellEl) {
      return;
    }
    const cellKey = new CellKey(cellEl.dataset.key);
    if (e.button === MOUSE.LEFT) {
      this.gameState.reveal(cellKey);
    }
    if (e.button === MOUSE.RIGHT) {
      const flagsCounter = this.gameState.flagCell(cellKey);
      this.flagsCounter.textContent = renderNumber(flagsCounter);
    }

    //TODO: apply only revealed cells
    this.applyState();
  }
  
  handleGameFieldRightClick = (e) => {
    e.preventDefault();
  }
  
  handleDocumentMouseUp = (e) => {
    if (this.highlightedCells !== null) {
      this.highlightedCells.forEach(key => this.cells[key.value].classList.remove(CELL_MODIFICATORS.highlighted));
      this.highlightedCells = null;
      document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    }
  }
  
  
  handleGameFieldMouseDown = (e) => {
    e.preventDefault();
    const cellEl = e.target.closest(`.${CELL_CLASS}`);
    if (cellEl) {
      const cellKey = new CellKey(cellEl.dataset.key);
      if (e.button === 0) {
        const cell = this.gameState.getCell(cellKey);
        if (cell.isOpened && cell.isNumber) {
          this.highlightedCells = this.gameState.getHighlightedCells(cellKey);
          this.highlightedCells
            .forEach(key => this.cells[key.value].classList.add(CELL_MODIFICATORS.highlighted));

          document.addEventListener('mouseup', this.handleDocumentMouseUp);
        }
      }
    }
  }
}