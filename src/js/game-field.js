import Cell from './cell';
import CellKey from './cell-key';
import { GAME_FIELD_CLASS, CELL_CLASS, CELL_MODIFICATORS, MOUSE } from './constants';

export default class GameField {
  constructor(difficulty, gameState) {
    this.difficulty = difficulty;
    this.gameState = gameState;
    this.cells = {};
    this.highlightedCells = null;

    this.gameField = this._createTable();
    this.gameField.addEventListener('mousedown', this.handleGameFieldMouseDown);
    this.gameField.addEventListener('mouseup', this.handleGameFieldMouseUp);
    this.gameField.addEventListener('contextmenu', this.handleGameFieldRightClick);
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
  
  handleGameFieldMouseUp = (e) => {
    const cellEl = e.target.closest(`.${CELL_CLASS}`);
    if (!cellEl) {
      return;
    }
    const cellKey = new CellKey(cellEl.dataset.key);
    const cell = this.gameState.getCell(cellKey);
    if (e.button === MOUSE.LEFT && !cell.isFlagged) {
      if (!this.gameState.isGameStart) {
        this.gameState.generateState(cellKey);
      }

      this.gameState.openCell(cellKey);

      if (cell.isMined) {
        console.log('You`r looser!');
      }
    }
    if (e.button === MOUSE.RIGHT) {
      this.gameState.flagCell(cellKey);
    }
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