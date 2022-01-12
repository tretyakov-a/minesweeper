import { randomNumber } from './helpers';
import Cell from './cell';

const checks = {
  topLeft: [-1, -1],
  top: [-1, 0],
  topRight: [-1, 1],
  left: [0, -1],
  right: [0, 1],
  bottomLeft: [1, -1],
  bottom: [1, 0],
  bottomRight: [1, 1]
};

export default class GameState {
  constructor(difficulty, onWin, onLose) {
    this.difficulty = difficulty;
    this.onWin = onWin;
    this.onLose = onLose;
    this.state = this._generateInitialMatrix();
    this._generateMines();
    this._fillGameStateWithNumbers();
  }

  getCell = (i, j) => {
    if (!this._checkCell(i, j)) {
      return undefined;
    }
    return this.state[i][j];
  }

  _checkCell = (i, j) => {
    return this.state[i] !== undefined && this.state[i][j] !== undefined
  };

  flagCell = (i, j) => {
    const cell = this.getCell(i, j);
    if (cell.isOpened) {
      return;
    }
    if (cell.isFlagged) {
      cell.state = Cell.STATE_CLOSED;
    } else {
      cell.state = Cell.STATE_FLAGGED
    }
  }
  
  openCell = (i, j) => {
    const cell = this.getCell(i, j);
    if (cell.isFlagged) {
      return;
    }
    if (cell.isOpened && cell.isNumber) {
      const cells = this.getHighlightedCells(i, j);
      if (cells.length === 0 || cell.value > this.countFlagsAround(i, j)) {
        return;
      }
      cells.forEach(([i, j]) => this.openCell(i, j));

      return;
    }
    cell.state = Cell.STATE_OPENED;
    if (cell.isEmpty) {
      this._revealEmptySpace(i, j);
    }
  }

  countFlagsAround = (i, j) => {
    return Object.values(checks)
      .reduce((counter, [dx, dy]) => {
        const cell = this.getCell(i + dx, j + dy);
        return counter + (cell ? cell.isFlagged : 0);
      }, 0);
  }

  getHighlightedCells = (i, j) => {
    return Object.values(checks)
      .reduce((cells, [dx, dy]) => {
        const cell = this.getCell(i + dx, j + dy);
        if (cell && cell.isClosed) {
          cells.push([i + dx, j + dy]);
        }
        return cells;
      }, []);
  }

  _revealEmptySpace = (startI, startJ) => {
    const reveal = (key, startI, startJ) => {
      const [ dx, dy ] = checks[key];
      const i = startI + dx;
      const j = startJ + dy;
      
      const cell = this.getCell(i, j);
      if (!cell || cell.isOpened || cell.isFlagged) {
        return;
      }
      if (cell.isNumber) {
        cell.state = Cell.STATE_OPENED;
        return;
      }
      if (cell.isEmpty) {
        cell.state = Cell.STATE_OPENED;
        Object.keys(checks).forEach(checkKey => reveal(checkKey, i, j))
      }
    }

    Object.keys(checks).forEach(key => reveal(key, startI, startJ));
  };

  _generateInitialMatrix = () => {
    const { width, height } = this.difficulty;
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
    const { mines: minesNumber, width, height } = this.difficulty;
    const mines = {};
    for (let k = 0; k < minesNumber; k += 1) {
      let rowIdx, colIdx, cellIdx;
      do {
        rowIdx = randomNumber(0, height);
        colIdx = randomNumber(0, width);
        cellIdx = `${rowIdx}-${colIdx}`;
      } while (mines[cellIdx]);
      mines[cellIdx] = 1;
      this.getCell(rowIdx, colIdx).value = Cell.VALUE_MINE;
    }
  }

  _countNeighboringMines = (i, j) => {
    return Object.values(checks)
      .reduce((counter, [ dx, dy ]) => {
        const cell = this.getCell(i + dx, j + dy);
        return counter + (cell ? cell.isMined : 0);
      }, 0);
  }

  _fillGameStateWithNumbers = () => {
    for (let i = 0; i < this.state.length; i += 1) {
      for (let j = 0; j < this.state[i].length; j += 1) {
        const cell = this.getCell(i, j);
        if (!cell.isMined) {
          const value = this._countNeighboringMines(i, j);
          cell.value = value;
        }
      }
    }
  }
}