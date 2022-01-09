import { randomNumber } from './helpers';
import Cell from './cell';

export default class GameState {
  constructor(difficulty) {
    this.checks = {
      topLeft: [-1, -1],
      top: [-1, 0],
      topRight: [-1, 1],
      left: [0, -1],
      right: [0, 1],
      bottomLeft: [1, -1],
      bottom: [1, 0],
      bottomRight: [1, 1]
    };

    this.difficulty = difficulty;
    this.state = this._generateInitialMatrix();
    this._generateMines();
    this._fillGameStateWithNumbers();
  }

  getCellValue = (i, j) => {
    return this.state[i][j].value;
  }

  getSellState = (i, j) => {
    return this.state[i][j].state;
  }

  getCell = (i, j) => {
    return this.state[i][j];
  }

  setCellState = (state, i, j) => {
    this.state[i][j].state = state;
  }

  setCellValue = (value, i, j) => {
    this.state[i][j].value = value;
  }

  flagCell = (i, j) => {
    const cellState = this.getSellState(i, j);
    if (cellState === Cell.STATE_OPENED) {
      return;
    }
    if (cellState === Cell.STATE_FLAGGED) {
      this.setCellState(Cell.STATE_CLOSED, i, j);
    } else {
      this.setCellState(Cell.STATE_FLAGGED, i, j);
    }

    console.log(this.getSellState(i, j));
  }
  
  openCell = (i, j) => {
    const { state, value } = this.getCell(i, j);
    if (state === Cell.STATE_FLAGGED) {
      return;
    }
    if (state === Cell.STATE_OPENED) {
      if (Cell.isNumberValue(value)) {
        const cells = this.getHighlightedCells(i, j);
        if (cells.length === 0 || value > this.countFlagsAround(i, j)) {
          return;
        }
        cells.forEach(([i, j]) => {
          this.openCell(i, j);
        })
      }
      return;
    }
    this.setCellState(Cell.STATE_OPENED, i, j);
    if (this.getCellValue(i, j) === Cell.VALUE_EMPTY) {
      this._revealEmptySpace(i, j);
    }
  }

  countFlagsAround = (i, j) => {
    return Object.values(this.checks)
    .reduce((counter, [dx, dy]) => (
      counter + this._checkFlagged(i + dx, j + dy)
    ), 0);
  }

  getHighlightedCells = (i, j) => {
    return Object.values(this.checks)
      .reduce((cells, [dx, dy]) => {
        if (this._checkClosed(i + dx, j + dy)) {
          cells.push([i + dx, j + dy]);
        }
        return cells;
      }, []);
  }

  _revealEmptySpace = (startI, startJ) => {
    const reveal = (key, startI, startJ) => {
      const [ dx = 0, dy = 0 ] = this.checks[key];
      const i = startI + dx;
      const j = startJ + dy;

      if (this._checkOpened(i, j)) {
        return;
      }
      if (this._checkNumber(i, j)) {
        this.setCellState(Cell.STATE_OPENED, i, j);
        return;
      }
      if (this._checkEmpty(i, j)) {
        this.setCellState(Cell.STATE_OPENED, i, j);
        Object.keys(this.checks).forEach(checkKey => reveal(checkKey, i, j))
      }
    }

    Object.keys(this.checks).forEach(key => reveal(key, startI, startJ));
  };

  _generateInitialMatrix = () => {
    const { width, height} = this.difficulty;
    const matrix = [];
    for (let rowIdx = 0; rowIdx < height; rowIdx += 1) {
      matrix.push(new Array(width).fill(null));
      for (let colIdx = 0; colIdx < width; colIdx += 1) {
        matrix[rowIdx][colIdx] = new Cell();
      }
    }
    return matrix;
  }
  
  _generateMines = () => {
    const { mines: minesNumber, width, height} = this.difficulty;
    const mines = {};
    for (let k = 0; k < minesNumber; k += 1) {
      let rowIdx, colIdx, cellIdx;
      do {
        rowIdx = randomNumber(0, height);
        colIdx = randomNumber(0, width);
        cellIdx = `${rowIdx}-${colIdx}`;
      } while (mines[cellIdx]);
      mines[cellIdx] = 1;
      this.setCellValue(Cell.VALUE_MINE, rowIdx, colIdx);
    }
  }

  _check = (i, j, state) => {
    return this._checkCell(i, j) && this.getSellState(i, j) === state;
  }

  _checkFlagged = (i, j) => {
    return this._check(i, j, Cell.STATE_FLAGGED);
  }

  _checkClosed = (i, j) => {
    return this._checkCell(i, j) && this.getSellState(i, j) === Cell.STATE_CLOSED;
  }

  _checkOpened = (i, j) => {
    return this._checkCell(i, j) && this.getSellState(i, j) === Cell.STATE_OPENED;
  }

  _checkEmpty = (i, j) => {
    return this._checkCell(i, j) && this.getCellValue(i, j) === Cell.VALUE_EMPTY;
  }

  _checkNumber = (i, j) => {
    return this._checkCell(i, j) && Cell.isNumberValue(this.getCellValue(i, j));
  }

  _checkMine = (i, j) => {
    return this._checkCell(i, j) && this.getCellValue(i, j) === Cell.VALUE_MINE;
  }

  _checkCell = (i, j) => {
    return this.state[i] !== undefined && this.state[i][j] !== undefined
  };

  _countNeighboringMines = (i, j) => {
    return Object.values(this.checks)
      .reduce((counter, [dx, dy]) => counter += this._checkMine(i + dx, j + dy), 0);
  }

  _fillGameStateWithNumbers = () => {
    for (let i = 0; i < this.state.length; i += 1) {
      for (let j = 0; j < this.state[i].length; j += 1) {
        if (this.getCellValue(i, j) !== Cell.VALUE_MINE) {
          const value = this._countNeighboringMines(i, j);
          this.setCellValue(value, i, j);
        }
      }
    }
  }
}