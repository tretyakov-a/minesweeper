import Cell from './cell';
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

    document.addEventListener('mouseup', this.handleDocumentMouseUp);
  }

  render = () => {
    return this.gameField;
  }

  _createCell = (cellKey) => {
    const cell = document.createElement('td');
    cell.classList.add(CELL_CLASS);
    cell.classList.add(CELL_MODIFICATORS.closed);
    cell.dataset.key = cellKey;
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
        const cellKey = this.toCellKey([rowIdx, colIdx]);
        const cell = this._createCell(cellKey);
        this.cells[cellKey] = cell;
        row.insertAdjacentElement('beforeend', cell);
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
  
  splitCellKey = (key) => {
    return key.split('-').map(Number);
  }
  
  toCellKey = ([rowIdx, colIdx]) => {
    return `${rowIdx}-${colIdx}`;
  }
  
  applyState = () => {
    Object.keys(this.cells).forEach(key => {
      const [ rowIdx, colIdx ] = this.splitCellKey(key);
      const cell = this.gameState.getCell(rowIdx, colIdx);
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
    if (cellEl) {
      const [ rowIdx, colIdx ] = this.splitCellKey(cellEl.dataset.key);
      const cell = this.gameState.getCell(rowIdx, colIdx);
      if (e.button === MOUSE.LEFT && !cell.isFlagged) {
        this.gameState.openCell(rowIdx, colIdx);
  
        if (cell.isMined) {
          console.log('You`r looser!');
        }
      }
      if (e.button === MOUSE.RIGHT) {
        this.gameState.flagCell(rowIdx, colIdx);
      }
      this.applyState();
    }
  }
  
  handleGameFieldRightClick = (e) => {
    e.preventDefault();
  }
  
  handleDocumentMouseUp = (e) => {
    if (this.highlightedCells !== null) {
      this.highlightedCells.forEach(key => this.cells[key].classList.remove(CELL_MODIFICATORS.highlighted));
      this.highlightedCells = null;
    }
  }
  
  
  handleGameFieldMouseDown = (e) => {
    e.preventDefault();
    const cellEl = e.target.closest(`.${CELL_CLASS}`);
    if (cellEl) {
      const [ rowIdx, colIdx ] = this.splitCellKey(cellEl.dataset.key);
      if (e.button === 0) {
        const cell = this.gameState.getCell(rowIdx, colIdx);
        if (cell.isOpened && cell.isNumber) {
          this.highlightedCells = this.gameState
            .getHighlightedCells(rowIdx, colIdx)
            .map(this.toCellKey);
          this.highlightedCells
            .forEach(key => this.cells[key].classList.add(CELL_MODIFICATORS.highlighted));
        }
      }
    }
  }
}